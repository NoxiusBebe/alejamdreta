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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "memes`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`🖼️ ¿QUÉ MEMES TE HACEN REIR?`)
    .setDescription('Tienes dos opciones: o buscas un meme totalmente aleatorio, o de una temática que te haga reir; tu eliges.\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'meme      ➢ Te muestra un meme\n' +
    client.config.prefijos[message.guild.id] + 'gato      ➢ Muestra una foto random de un gato\n' +
    client.config.prefijos[message.guild.id] + 'perro     ➢ Muestra una foto random de un perro\n' +
    client.config.prefijos[message.guild.id] + 'arcoiris  ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'arte      ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'bonito    ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'borroso   ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'gris      ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'invertir  ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'liquidar  ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'motivado  ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'obra      ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'otaku     ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'pesadilla ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'pum       ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'sepia     ➢ Meme personalizado, ¡pruebalo!\n' +
    '```' +
    '\n__Si junto al comando, escribes la temática de la que quieres que sea el meme, te buscará un meme personalizado para eso, en vez de uno aleatorio cualquiera__')
    .setFooter('Aqui tienes las dos formas: !meme || !meme Discord')
    .setColor(`#88FFC8`);

  let embed2 = new Discord.MessageEmbed()
    .setTitle(`:crown: SECCIÓN PREMIUM`)
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'basura    ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'beso      ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'cachetada ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'cansado   ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'hitler    ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'huevo     ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'jaula     ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'lisa      ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'peligro   ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'pobre     ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'rico      ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'ricos     ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'rip       ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'rusia     ➢ Meme personalizado, ¡pruebalo!\n' +
    client.config.prefijos[message.guild.id] + 'tatuaje   ➢ Meme personalizado, ¡pruebalo!\n' +
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
