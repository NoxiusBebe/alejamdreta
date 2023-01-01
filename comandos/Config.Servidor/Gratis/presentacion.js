/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_configuracion = new sqlite3.Database("./memoria/db_configuracion.sqlite");

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "presentacion [elegir: mensaje de presentación, OFF]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let aux = args.join(" ")
  if(!aux) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Y... ¿cuál es el mensaje de presentación?**\n\n${estructura}`).setColor(`#807C80`))

  if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

  if(aux==='OFF'){
    message.delete();
    db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "presentacion" => ${message.content}`)
      let sentencia;
      if(!filas) sentencia = `INSERT INTO servidores(id, presentacion) VALUES('${message.guild.id}', NULL)`;
      else sentencia = `UPDATE servidores SET presentacion = NULL WHERE id = '${message.guild.id}'`;

      db_configuracion.run(`UPDATE servidores SET presentacion = NULL WHERE id = ${message.guild.id}`, function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "presentacion" => ${message.content}`)
        return message.channel.send(new Discord.MessageEmbed().setDescription(`🗑️ **El mensaje de presentación ha sido deshabilitado**`).setColor(`#807C80`))
      })
    })
  }
  else{
    message.delete();
    db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "presentacion" => ${message.content}`)
      let sentencia;
      if(!filas) sentencia = `INSERT INTO servidores(id, presentacion) VALUES('${message.guild.id}', '${aux}')`;
      else sentencia = `UPDATE servidores SET presentacion = '${aux}' WHERE id = '${message.guild.id}'`;

      db_configuracion.run(`UPDATE servidores SET presentacion = NULL WHERE id = ${message.guild.id}`, function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #4 comando "presentacion" => ${message.content}`)
        return message.channel.send(new Discord.MessageEmbed().setDescription(`:white_check_mark: **Ha sido asignado el mensaje de presentación**\n\n__El mensaje es:__\n\n${aux}`).setColor(`#807C80`))
      })
    })
  }
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
