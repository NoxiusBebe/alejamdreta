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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "informacion`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`:bookmark: TODA LA INFORMACIÓN A TU ALCANCE`)
    .setDescription('Siempre es bueno disponer de algunos comandos para poder ver toda la informacion relacionada con el servidor y más.\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'amazon   ➢ Busca un producto en Amazon\n' +
    client.config.prefijos[message.guild.id] + 'listado  ➢ Ver 5 servidores aleatorios premium\n' +
    client.config.prefijos[message.guild.id] + 'canales  ➢ Listado de canales que puedes visitar\n' +
    client.config.prefijos[message.guild.id] + 'googleps ➢ Busca algo en la Google Play Store\n' +
    client.config.prefijos[message.guild.id] + 'servidor ➢ Mira la informacion del servidor\n' +
    client.config.prefijos[message.guild.id] + 'usuario  ➢ Consulta tus datos, o de quien menciones\n' +
    client.config.prefijos[message.guild.id] + 'meteo    ➢ Parte meteorológico del lugar que quieras\n' +
    client.config.prefijos[message.guild.id] + 'rae      ➢ Busca una palabra en la RAE\n' +
    client.config.prefijos[message.guild.id] + 'wiki     ➢ Busca algo en Wikipedia\n' +
    client.config.prefijos[message.guild.id] + 'bot      ➢ ¿Quién soy?\n' +
    client.config.prefijos[message.guild.id] + 'ayuda    ➢ El cuadro de ayuda original\n' +
    '```' +
    '\n__Si precisas de mas informacion, pregúntale al staff__')
    .setFooter('Si quereis puedo informaros tambien de los planes secretos del Pentágono, pero como no tengo un comando para hacerlo, pues os quedais con las ganas :)')
    .setColor(`#ACC5FB`);

  let embed2 = new Discord.MessageEmbed()
    .setTitle(':crown: **SECCIÓN PREMIUM**')
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + '+listado ➢ Ingresa a tu servidor en el listado premium\n' +
    client.config.prefijos[message.guild.id] + '-listado ➢ Retira a tu servidor del listado premium\n' +
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
