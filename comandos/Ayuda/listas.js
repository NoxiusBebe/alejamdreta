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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "listas`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`:notepad_spiral: LISTAS, EVENTOS Y SORTEOS`)
    .setDescription('¿Necesitas crear un listado donde se pueda apuntar la gente para una determinada actividad? Quizás pueda ayudarte con eso\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'crear.lista   ➢ Crear una lista\n' +
    client.config.prefijos[message.guild.id] + 'borrar.lista  ➢ Borrar una lista concreta\n' +
    client.config.prefijos[message.guild.id] + 'borrar.listas ➢ Borrar todas las listas\n' +
    client.config.prefijos[message.guild.id] + 'ver.lista     ➢ Ver una lista concreta \n' +
    client.config.prefijos[message.guild.id] + 'ver.listas    ➢ Ver todas las listas\n' +
    client.config.prefijos[message.guild.id] + 'azar.lista    ➢ Sacar un participante al azar de una lista\n' +
    client.config.prefijos[message.guild.id] + '+lista        ➢ Apuntarse a una lista concreta\n' +
    client.config.prefijos[message.guild.id] + '-lista        ➢ Borrarse de una lista concreta\n' +
    '```' +
    '\n__Es un sistema de listas complejo, pero eficaz; doy fe__')
    .setFooter('IMPORTANTE: cuando visualices o elimines una lista, deberás indicar la posición numérica en la que se encuentra esa lista en el listado de listas || Ejemplo: '+client.config.prefijos[message.guild.id]+'borrar.lista 3')
    .setColor(`#A9FF3D`)

  let embed2 = new Discord.MessageEmbed()
    .setTitle(':crown: **SECCIÓN PREMIUM**')
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'grupos.lista ➢ Hacer grupos con los usuarios de una lista\n' +
    client.config.prefijos[message.guild.id] + 'evento       ➢ Mensaje que da un rol a quien reaccione\n' +
    client.config.prefijos[message.guild.id] + 'sorteo       ➢ Crea un sorteo automatizado con tiempo\n' +
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
