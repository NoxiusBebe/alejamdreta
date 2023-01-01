/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_CHANNELS": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "MANAGE_CHANNELS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot && message.author.id!=client.config.id) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "sugerencias (ON, OFF)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#D6FBAC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#D6FBAC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en "sugerencias" en ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.config_canales===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-config_canales.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#D6FBAC`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    let aux = args.join(" ")
    if(aux==='OFF'){
      if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();
      db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "sugerencias" => ${message.content}`)
        let sentencia;
        if(!filas) sentencia = `INSERT INTO servidores(id,sugerencias,sugerencias_mensaje) VALUES('${message.guild.id}',NULL,NULL)`;
        else{
          let canal = filas.sugerencias;
          let mensaje = filas.sugerencias_mensaje;
          try{client.channels.resolve(canal).messages.delete(mensaje, true)}catch(err){};
          sentencia = `UPDATE servidores SET sugerencias = NULL, sugerencias_mensaje = NULL WHERE id = '${message.guild.id}'`;
         }
        db_canales.run(sentencia, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "sugerencias" => ${message.content}`)
          client.channels.resolve(message.channel.id).updateOverwrite(message.guild.id, { SEND_MESSAGES: true });
          return message.channel.send(new Discord.MessageEmbed().setDescription(`🗑️ **SE HA DESHABILITADO EL CANAL DE __SUGERENCIAS__**`).setColor(`#D6FBAC`)).then(m => m.delete({ timeout: 5000}))
        });
      })
    }
    else{
      if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();
      db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "sugerencias" => ${message.content}`)
        let sentencia;
        if(!filas) sentencia = `INSERT INTO servidores(id,sugerencias) VALUES('${message.guild.id}','${message.channel.id}')`;
        else{
          let canal = filas.sugerencias;
          let mensaje = filas.sugerencias_mensaje;
          try{client.channels.resolve(canal).messages.delete(mensaje, true)}catch(err){};
          sentencia = `UPDATE servidores SET sugerencias = '${message.channel.id}' WHERE id = '${message.guild.id}'`;
        }
        db_canales.run(sentencia, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #4 comando "sugerencias" => ${message.content}`)
          let mensaje = message.channel.send(new Discord.MessageEmbed().setDescription(`:mailbox_with_mail: **¡ESTE ES EL BUZÓN DE SUGERENCIAS!**\n\nUtiliza el comando **${client.config.prefijos[message.guild.id]}sugerir** para que tu sugerencia aparezca en este canal y pueda ser votada.\n\nGracias :slight_smile:`).setColor(`#D6FBAC`)).then(m => {
            db_canales.run(`UPDATE servidores SET sugerencias_mensaje = ${m.id} WHERE id = ${message.guild.id}`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #5 comando "sugerencias" => ${message.content}`)
              let el_bot = client.users.resolve(client.config.id)
              client.channels.resolve(message.channel.id).updateOverwrite(client.users.resolve(el_bot.id), { VIEW_CHANNEL: true, ADD_REACTIONS: true, SEND_MESSAGES: true });
              client.channels.resolve(message.channel.id).updateOverwrite(message.guild.id, { SEND_MESSAGES: false });
            });
          })
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
