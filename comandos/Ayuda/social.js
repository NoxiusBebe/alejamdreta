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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "social`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`:satellite: REDES SOCIALES Y GRUPOS`)
    .setDescription('Mantente conectado a tus redes sociales favoritas, y no ser el típico del grupo de amigos que no tiene ni idea de nada sobre lo último de lo último\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'ajedrez      ➢ Juega al Ajedrez\n' +
    client.config.prefijos[message.guild.id] + 'apalabrados  ➢ Juega al Apalabrados\n' +
    client.config.prefijos[message.guild.id] + 'betrayal     ➢ Juega al Betrayal.io\n' +
    client.config.prefijos[message.guild.id] + 'damas        ➢ Juega a las damas\n' +
    client.config.prefijos[message.guild.id] + 'hechizo      ➢ Juega al SpellCast\n' +
    client.config.prefijos[message.guild.id] + 'pesca        ➢ Juega al Fishington.io\n' +
    client.config.prefijos[message.guild.id] + 'pinturillo   ➢ Juega al Pinturillo\n' +
    client.config.prefijos[message.guild.id] + 'poker        ➢ Juega al Poker Texas Holdem\n' +
    client.config.prefijos[message.guild.id] + 'scrabble     ➢ Juega al Scrabble\n' +
    client.config.prefijos[message.guild.id] + 'ytsync       ➢ Accede a Youtube Together\n' +
    '```' +
    '\n__Y todo sin salir de Discord, es una maravilla como yo__ :kissing_closed_eyes:')
    .setFooter('Y si estas funciones no terminan de funcionar bien, quizás sea hora de renovar la patata que tienes por PC')
    .setColor(`#FC5F8B`)

  let embed2 = new Discord.MessageEmbed()
    .setTitle(`:crown: **SECCIÓN PREMIUM**`)
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'youtube ➢ Follow/Unfollow canal de Youtube\n' +
    client.config.prefijos[message.guild.id] + 'twitch  ➢ Follow/Unfollow canal de Twitch\n' +
    // client.config.prefijos[message.guild.id] + 'tiktok  ➢ Follow/Unfollow cuenta de TikTok\n' +
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
