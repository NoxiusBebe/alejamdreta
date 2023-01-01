/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_tematicos = new sqlite3.Database("./memoria/db_tematicos.sqlite");
const db_valentin = new sqlite3.Database("./memoria/db_valentin.sqlite");
const db_regalos_sv = new sqlite3.Database("./memoria/db_regalos_sv.sqlite");

const sv_bombones = require("../../../archivos/Documentos/Tematicos/San Valentin/bombones.json")
const sv_bombones_imagenes = require("../../../archivos/Documentos/Tematicos/San Valentin/bombones_imagenes.json")
const sv_ingredientes = require("../../../archivos/Documentos/Tematicos/San Valentin/ingredientes.json")
const sv_ingredientes_comandos = require("../../../archivos/Documentos/Tematicos/San Valentin/ingredientes_comandos.json")
const sv_ingredientes_imagenes = require("../../../archivos/Documentos/Tematicos/San Valentin/ingredientes_imagenes.json")

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "sv.regalar [@usuario] [tipo de bombón: del 1 al 5]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};

  let conv_permisos = require(`../../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)


  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FF4949`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FF4949`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    if(!filas || (filas.premium===null && filas.tematicos===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-tematicos.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#FF4949`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'valentin'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 en funciones automatas de san valentin`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_valentin.get(`SELECT * FROM '${message.guild.id}' WHERE id = '${message.author.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 ganando puntos`)
        if(!filas2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **No tienes ingredientes**`).setColor("#FB2727"))

        let texto = args.join(" ").split(" ")
        let usuario = message.mentions.members.first()
        let tipo_bombon = texto[1];
        if(!usuario) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **No has mencionado a ningún usuario**\n\n${estructura}`).setColor("#FB2727"))
        if(usuario.id===message.author.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **No puedes mencionarte a ti mismo**\n\n${estructura}`).setColor("#FB2727"))
        if(!tipo_bombon || (tipo_bombon!="1" && tipo_bombon!="2" && tipo_bombon!="3" && tipo_bombon!="4" && tipo_bombon!="5")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **Elige el número de un tipo de bombón:**\n\n${estructura}`).setColor("#FB2727"))

        let bombon_1 = 0;
        let bombon_2 = 0;
        let bombon_3 = 0;
        let bombon_4 = 0;
        let bombon_5 = 0;

        let negro = filas2.ingrediente_1;
        let blanco = filas2.ingrediente_2;
        let frambuesa = filas2.ingrediente_3;
        let mousse = filas2.ingrediente_4;
        let virutas = filas2.ingrediente_5;
        let naranja = filas2.ingrediente_6;
        let chile = filas2.ingrediente_7;

        message.delete();

        if(tipo_bombon==="1"){
          if(negro<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **No tienes ingredientes suficientes para regalar este tipo de bombón**`).setColor("#FB2727"))
          db_valentin.run(`UPDATE '${message.guild.id}' SET ingrediente_1 = ${negro-1}, regalos = ${filas2.regalos+1}, num_regalos = ${filas2.num_regalos+1} WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
            message.channel.send(`<@${usuario.id}>`)
            message.channel.send(new Discord.MessageEmbed().setTitle(`:heart: TIENES UN ADMIRADOR SECRETO :heart:`).setDescription(`<@${usuario.id}>, acabas de recibir una caja de San Valentín\n\n¡Ábrela a ver qué hay!`).setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837050744176711/caja_cerrada_icono.png`).setColor(`#FF5C93`).setTimestamp()).then(async m => {
              db_regalos_sv.run(`INSERT INTO servidores(id, canal, mensaje, bombon, autor) VALUES('${usuario.id}', '${m.channel.id}', '${m.id}', 1, '${message.author.id}')`, async function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #4 ganando puntos`)
                await m.react("🎁");
              })
            })
          })
        }

        if(tipo_bombon==="2"){
          if(negro<=0 || blanco<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **No tienes ingredientes suficientes para regalar este tipo de bombón**`).setColor("#FB2727"))
          db_valentin.run(`UPDATE '${message.guild.id}' SET ingrediente_1 = ${negro-1}, ingrediente_2 = ${blanco-1}, regalos = ${filas2.regalos+2}, num_regalos = ${filas2.num_regalos+1} WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
            message.channel.send(`<@${usuario.id}>`)
            message.channel.send(new Discord.MessageEmbed().setTitle(`:heart: TIENES UN ADMIRADOR SECRETO :heart:`).setDescription(`<@${usuario.id}>, acabas de recibir una caja de San Valentín\n\n¡Ábrela a ver qué hay!`).setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837050744176711/caja_cerrada_icono.png`).setColor(`#FF5C93`).setTimestamp()).then(async m => {
              db_regalos_sv.run(`INSERT INTO servidores(id, canal, mensaje, bombon, autor) VALUES('${usuario.id}', '${m.channel.id}', '${m.id}', 2, '${message.author.id}')`, async function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #4 ganando puntos`)
                await m.react("🎁");
              })
            })
          })
        }

        if(tipo_bombon==="3"){
          if(frambuesa<=0 || blanco<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **No tienes ingredientes suficientes para regalar este tipo de bombón**`).setColor("#FB2727"))
          db_valentin.run(`UPDATE '${message.guild.id}' SET ingrediente_3 = ${frambuesa-1}, ingrediente_2 = ${blanco-1}, regalos = ${filas2.regalos+3}, num_regalos = ${filas2.num_regalos+1} WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
            message.channel.send(`<@${usuario.id}>`)
            message.channel.send(new Discord.MessageEmbed().setTitle(`:heart: TIENES UN ADMIRADOR SECRETO :heart:`).setDescription(`<@${usuario.id}>, acabas de recibir una caja de San Valentín\n\n¡Ábrela a ver qué hay!`).setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837050744176711/caja_cerrada_icono.png`).setColor(`#FF5C93`).setTimestamp()).then(async m => {
              db_regalos_sv.run(`INSERT INTO servidores(id, canal, mensaje, bombon, autor) VALUES('${usuario.id}', '${m.channel.id}', '${m.id}', 3, '${message.author.id}')`, async function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #4 ganando puntos`)
                await m.react("🎁");
              })
            })
          })
        }

        if(tipo_bombon==="4"){
          if(mousse<=0 || virutas<=0 || naranja<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **No tienes ingredientes suficientes para regalar este tipo de bombón**`).setColor("#FB2727"))
          db_valentin.run(`UPDATE '${message.guild.id}' SET ingrediente_4 = ${mousse-1}, ingrediente_5 = ${virutas-1}, ingrediente_6 = ${naranja-1}, regalos = ${filas2.regalos+4}, num_regalos = ${filas2.num_regalos+1} WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
            message.channel.send(`<@${usuario.id}>`)
            message.channel.send(new Discord.MessageEmbed().setTitle(`:heart: TIENES UN ADMIRADOR SECRETO :heart:`).setDescription(`<@${usuario.id}>, acabas de recibir una caja de San Valentín\n\n¡Ábrela a ver qué hay!`).setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837050744176711/caja_cerrada_icono.png`).setColor(`#FF5C93`).setTimestamp()).then(async m => {
              db_regalos_sv.run(`INSERT INTO servidores(id, canal, mensaje, bombon, autor) VALUES('${usuario.id}', '${m.channel.id}', '${m.id}', 4, '${message.author.id}')`, async function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #4 ganando puntos`)
                await m.react("🎁");
              })
            })
          })
        }

        if(tipo_bombon==="5"){
          if(mousse<=0 || virutas<=0 || chile<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **No tienes ingredientes suficientes para regalar este tipo de bombón**`).setColor("#FB2727"))
          db_valentin.run(`UPDATE '${message.guild.id}' SET ingrediente_4 = ${mousse-1}, ingrediente_5 = ${virutas-1}, ingrediente_7 = ${chile-1}, regalos = ${filas2.regalos+5}, num_regalos = ${filas2.num_regalos+1} WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
            message.channel.send(`<@${usuario.id}>`)
            message.channel.send(new Discord.MessageEmbed().setTitle(`:heart: TIENES UN ADMIRADOR SECRETO :heart:`).setDescription(`<@${usuario.id}>, acabas de recibir una caja de San Valentín\n\n¡Ábrela a ver qué hay!`).setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837050744176711/caja_cerrada_icono.png`).setColor(`#FF5C93`).setTimestamp()).then(async m => {
              db_regalos_sv.run(`INSERT INTO servidores(id, canal, mensaje, bombon, autor) VALUES('${usuario.id}', '${m.channel.id}', '${m.id}', 5, '${message.author.id}')`, async function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #4 ganando puntos`)
                await m.react("🎁");
              })
            })
          })
        }

      })
    })
  })
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
async function comprobar_permisos_usuario(client, message){
  for(var i in permisos_user) permisos_user[i] = "✅";
  for(var i in permisos_user) if(!message.member.hasPermission(i) && !message.channel.permissionsFor(message.member).has(i)) permisos_user[i] = "❌";
}
async function comprobar_permisos_bot(client, message){
  for(var i in permisos_bot) permisos_bot[i] = "✅";
  for(var i in permisos_bot) if(!message.guild.me.hasPermission(i) && !message.channel.permissionsFor(message.guild.me).has(i)) permisos_bot[i] = "❌";
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
