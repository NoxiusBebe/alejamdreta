/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const emoticono = {
  1 : "1️⃣",
  2 : "2️⃣",
  3 : "3️⃣",
  4 : "4️⃣",
  5 : "5️⃣",
  6 : "6️⃣",
  7 : "7️⃣",
  8 : "8️⃣",
  9 : "9️⃣",
  10 : "🔟"
}

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_GUILD": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "votacion [motivo de la votación] | [opción 1] | [opción 2] | (opción 3) ... (opción 10)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let tema = args.join(" ").split(" | ")
  if(!tema[0]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:exploding_head: **¿De qué trata tu encuesta? Tienes que decirlo.**\n\n${estructura}`).setColor(`#F7F9F7`))
  if(!tema[1] || !tema[2]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pensive: **Debes poner mínimo 2 opciones a elegir.**\n\n${estructura}`).setColor(`#F7F9F7`))
  if(tema[11]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pensive: **Siento decirte que como máximo solo puedes 10 opciones**\n\n${estructura}`).setColor(`#F7F9F7`))
  if(tema[0].length>2000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:sweat: **¡El tema de la encuesta es demasiado largo, debes acortarlo!**\n\n${estructura}`).setColor(`#F7F9F7`))

  if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

  let descripcion = [];
  descripcion.push(tema[0]+"\n")

  for(var i=1 ; i<=10 ; i++) if(tema[i]) descripcion.push(`${emoticono[i]} ${tema[i]}`)

  let embed = new Discord.MessageEmbed()
    .setAuthor(`Votación de ${message.author.tag}`, message.member.user.avatarURL())
    .setDescription(`${descripcion.join("\n")}`)
    .setColor(`#F7F9F7`)
    .setTimestamp()
  message.channel.send(embed).then(async m => {
    for(var i=1 ; i<=10 ; i++) if(tema[i]) await m.react(`${emoticono[i]}`)
  });
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
