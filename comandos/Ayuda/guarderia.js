/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "guarderia`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};

  let conv_permisos = require(`../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)


  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#ACC5FB`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#ACC5FB`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let embed = new Discord.MessageEmbed()
    .setTitle(`:baby: COMANDOS PARA HACER TONTERIAS`)
    .setDescription('Estos comandos en verdad no tiene una finalidad práctica ni mucho menos, pero esperemo que de una forma inocente y simpática, puedas pasarlo bien haciendo tonterias con el resto de tus amigos\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'amor       ➢ Calcula el amor entre dos usuarios\n' +
    client.config.prefijos[message.guild.id] + 'boda       ➢ Cásate con algun amigo\n' +
    client.config.prefijos[message.guild.id] + 'divorcio   ➢ Si te dejó de gustar, pues divórciate\n' +
    client.config.prefijos[message.guild.id] + 'matrimonio ➢ ¿Muy borracho para acordarte?\n' +
    client.config.prefijos[message.guild.id] + 'decir      ➢ Haz que diga algo en tu nombre\n' +
    client.config.prefijos[message.guild.id] + 'md         ➢ Te envío un MD con lo que tu me digas\n' +
    client.config.prefijos[message.guild.id] + 'dash       ➢ Muestra una frase con una fuente especial\n' +
    client.config.prefijos[message.guild.id] + 'fortnite   ➢ Muestra una frase con una fuente especial\n' +
    client.config.prefijos[message.guild.id] + 'numero     ➢ Saca un numero al azar hasta donde digas\n' +
    client.config.prefijos[message.guild.id] + 'embed      ➢ Haz un mensaje embed conmigo\n' +
    client.config.prefijos[message.guild.id] + 'minecraft  ➢ Muestra tu cabeza de tu cuenta de Minecraft\n' +
    client.config.prefijos[message.guild.id] + 'chiste     ➢ ¿Te cuento un chiste?\n' +
    client.config.prefijos[message.guild.id] + 'tema       ➢ Muestra un tema de conversación del que hablar\n' +
    '```' +
    '\n__Hay comandos mas sencillos y algunos mas complejos. Aprederás a usarlos, no te preocupes__')
    .setFooter('Creo que aqui no tengo que puntualizar nada, solo esperar que te lo pases bien conmigo y tus amigos')
    .setColor(`#FF83F8`)

  let embed2 = new Discord.MessageEmbed()
    .setTitle(':crown: **SECCIÓN PREMIUM**')
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'thanos   ➢ Desconecta a medio servidor en canales de voz\n' +
    client.config.prefijos[message.guild.id] + 'galactus ➢ Expulsa a todo el mundo del servidor\n' +
    client.config.prefijos[message.guild.id] + 'bh       ➢ Desconéctate con efecto de bomba de humo\n' +
    client.config.prefijos[message.guild.id] + 'bn       ➢ Desconecta todo el servidor en canales de voz\n' +
    '```')
    .setFooter('Para mas información acerca de cómo obtener premium || '+client.config.prefijos[message.guild.id]+'premium')
    .setColor(`#FFB801`)

  return message.channel.send(embed2, embed)
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
