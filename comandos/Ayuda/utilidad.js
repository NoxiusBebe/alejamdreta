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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "utilidad`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`🔧 UTILIDADES VARIADAS`)
    .setDescription('Sin una temática definida, simplemente podemos considerar estos comandos "útiles" en el sentido de que llegará el día, que necesites alguno de ellos.\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'ausente     ➢ Ponte en modo ausente\n' +
    client.config.prefijos[message.guild.id] + 'bug         ➢ Informar de un bug del BOT\n' +
    client.config.prefijos[message.guild.id] + 'calculadora ➢ Usa la calculadora\n' +
    client.config.prefijos[message.guild.id] + 'confesar    ➢ Confiesa algo...\n' +
    client.config.prefijos[message.guild.id] + 'conversor   ➢ Haz conversiones entre divisas\n' +
    client.config.prefijos[message.guild.id] + 'encuesta    ➢ Hacer una encuesta\n' +
    client.config.prefijos[message.guild.id] + 'horario     ➢ Muestra la hora actual de un país\n' +
    client.config.prefijos[message.guild.id] + 'invitacion  ➢ Crea una invitacion de tu server\n' +
    client.config.prefijos[message.guild.id] + 'mkd         ➢ Texto a formato Markdown\n' +
    client.config.prefijos[message.guild.id] + 'valorar     ➢ Dale LIKE o DISLIKE al bot\n' +
    client.config.prefijos[message.guild.id] + 'votacion    ➢ Hacer una encuesta personalizada\n' +
    client.config.prefijos[message.guild.id] + 'votar       ➢ Vótame en Top.gg\n' +
    '```' +
    '\n__Cuando echas en falta un comando, es que en verdad lo necesitas; no te preocupes, menos mal que estoy yo aquí__')
    .setFooter('Cada comando se ejecuta de una forma distinta. Si te equivocas, te guiaré para que lo hagas bien')
    .setColor(`#F7F9F7`)

  let embed2 = new Discord.MessageEmbed()
    .setTitle(':crown: **SECCIÓN PREMIUM**')
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'sugerir  ➢ Realiza una sugerencia\n' +
    client.config.prefijos[message.guild.id] + 'voz      ➢ Digo algo en tu canal de voz\n' +
    client.config.prefijos[message.guild.id] + 'traducir ➢ Traduce una frase\n' +
    client.config.prefijos[message.guild.id] + 'guiri    ➢ Traduce una frase, y la digo por voz\n' +
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
