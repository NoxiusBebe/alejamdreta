/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_configuracion = new sqlite3.Database("./memoria/db_configuracion.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_GUILD": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "mens.desped [elegir: mensaje, OFF]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#807C80`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#807C80`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en "apodos" en ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.config_servidor===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-config_servidor.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#807C80`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    let aux = args.join(" ")
    if(!aux) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Y... ¿cuál es el mensaje de despedida?**\n\n${estructura}`))

    if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

    if(aux==='OFF'){
      db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "mens_desped" => ${message.content}`)
        let sentencia;
        if(!filas) sentencia = `INSERT INTO servidores(id, mens_desped) VALUES('${message.guild.id}', NULL)`;
        else sentencia = `UPDATE servidores SET mens_desped = NULL WHERE id = '${message.guild.id}'`;

        db_configuracion.run(sentencia, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "mens_desped" => ${message.content}`)
          return message.channel.send(new Discord.MessageEmbed().setDescription(`🗑️ **El mensaje de despedida ha sido deshabilitado**`).setColor(`#807C80`))
        })
      })
    }
    else{
      db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "mens_desped" => ${message.content}`)
        let sentencia;
        if(!filas) sentencia = `INSERT INTO servidores(id, mens_desped) VALUES('${message.guild.id}', '${aux}')`;
        else sentencia = `UPDATE servidores SET mens_desped = '${aux}' WHERE id = '${message.guild.id}'`;

        db_configuracion.run(sentencia, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #4 comando "mens_desped" => ${message.content}`)
          return message.channel.send(new Discord.MessageEmbed().setDescription(`:white_check_mark: **Ha sido asignado el mensaje de despedida**\n\n__El mensaje es:__\n${aux}`).setColor(`#807C80`))
        })
      })
    }
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
