/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_ausente = new sqlite3.Database("./memoria/db_ausente.sqlite");

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "ausente [elegir: 'el motivo de la ausencia' o 'OFF']`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#F7F9F7`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#F7F9F7`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let motivo = args.join(" ")
  if(!motivo) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **¿Por qué vas a estar ausente? No lo has dicho**\n\n${estructura}`).setColor(`#F7F9F7`))

  let sentencia;
  if(motivo === "OFF" || motivo === "off") sentencia = `DELETE FROM ausentes WHERE usuario = '${message.author.id}'`;
  else sentencia = `INSERT INTO ausentes(usuario, motivo, tiempo) VALUES('${message.author.id}', '${motivo}', '${Date.now()}')`;
  db_ausente.run(sentencia, function(err) {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 reportando bug`)
    if(motivo === "OFF" || motivo === "off") return message.channel.send(new Discord.MessageEmbed().setDescription(`:tada: __**¡HAS VUELTO!**__ :tada:\n\nComo me gusta tenerte por aquí de nuevo :kissing_closed_eyes:`).setColor(`#F7F9F7`))
    else return message.channel.send(new Discord.MessageEmbed().setDescription(`:thumbsup: __**¡NOS VEMOS PRONTO!**__\n\nY no te preocupes, si alguien te pinguea, me encargaré de decirle por qué estás ausente :wink:`).setFooter(`Para desactivar el modo ausente, teclea: ${client.config.prefijos[message.guild.id]}ausente OFF`).setColor(`#F7F9F7`))
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
