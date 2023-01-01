/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.crear`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};

  let conv_permisos = require(`../../../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)
  

  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#9262FF`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#9262FF`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 creando cuenta de DH`)
    if(filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **YA TIENES UNA CUENTA CREADA.**\n\nSi quieres empezar de nuevo, el comando es: **${client.config.prefijos[message.guild.id]}dh.resetear**`).setColor(`#9262FF`))
    db_discordhunter.run(`INSERT INTO usuarios(id, vida, escudo, coins, nivel, xp, prestigio, arma, critico, defensa, logro_incursion, logro_incursion_heroica, logro_ascension, logro_desafio, estado_incursion, estado_incursion_heroica, estado_ascension, estado_supervivencia, estado_royale, estado_batalla_1, estado_duelos, estado_batalla_5, estado_desafios, puños, vara, arco, dagas, martillo, ballesta, hacha, espada, sable, katana, magia, baculo, misticos, oscuros, excalibur, lanza, tridente, casco, rayos, guadaña, armazon, prohibidos, hercules, cuartente, cetro, diario, contrato_excalibur, contrato_lanza, contrato_tridente, contrato_casco, contrato_rayos, contrato_guadaña, macro, estado_publicidad, mensaje_publicidad, auto_farmear) VALUES('${message.author.id}', 100, ':x:', 1000, 1, 0, 1, 1, 0, 0, ':x:', ':x:', ':x:', ':x:', 0, 0, 0, 0, 0, 0, 0, 0, 0, ':white_check_mark:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', ':x:', '0', 0, 0, 0, 0, 0, 0, 0, 1, '---', 0)`, function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 creando cuenta de DH`)
      return message.channel.send(new Discord.MessageEmbed().setDescription(`:hugging: Acabas de adentrarte en el mundo de **DISCORD HUNTER**.\n\nRecuerda ser cuidadoso con lo que haces; hay muchos monstruos salvajes y feroces que no dudarán en atacarte...`).setColor(`#9262FF`))
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
