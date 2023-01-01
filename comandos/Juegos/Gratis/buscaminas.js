/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const mines = require('discord-minesweeper');

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "buscaminas [opciones: novato, facil, normal, dificil, extremo]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FBACAC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FBACAC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let dificultad = args.join(" ")
  if(!dificultad) return message.channel.send(new Discord.MessageEmbed().setDescription(`:boom: **No has elegido ninguna dificultad**\n\n${estructura}`).setColor(`#FBACAC`))
  if(dificultad==='Novato' || dificultad==='novato' || dificultad==='NOVATO'){
    message.channel.send(`:bomb: **BUSCAMINAS NOVATO (4 BOMBAS)**`)
    return message.channel.send(mines(3, 3, 4, ' :boom: ', true));
  }
  else if(dificultad==='Facil' || dificultad==='facil' || dificultad==='FACIL'){
    message.channel.send(`:bomb: **BUSCAMINAS FÁCIL (8 BOMBAS)**`)
    return message.channel.send(mines(6, 6, 8, ' :boom: ', true));
  }
  else if(dificultad==='Normal' || dificultad==='normal' || dificultad==='NORMAL'){
    message.channel.send(`:bomb: **BUSCAMINAS NORMAL (11 BOMBAS)**`)
    return message.channel.send(mines(9, 9, 11, ' :boom: ', true));
  }
  else if(dificultad==='Dificil' || dificultad==='dificil' || dificultad==='DIFICIL'){
    message.channel.send(`:bomb: **BUSCAMINAS DIFICIL (13 BOMBAS)**`)
    return message.channel.send(mines(12, 12, 13, ' :boom: ', true));
  }
  else if(dificultad==='Extremo' || dificultad==='extremo' || dificultad==='EXTREMO'){
    message.channel.send(`:bomb: **BUSCAMINAS EXTREMO (14 BOMBAS)**`)
    return message.channel.send(mines(13, 13, 14, ' :boom: ', true));
  }
  else return message.channel.send(new Discord.MessageEmbed().setDescription(`:boom: **No has elegido ninguna dificultad válida**\n\n${estructura}`).setColor(`#FBACAC`))
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
