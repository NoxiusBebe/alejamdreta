/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const fetch = require("node-fetch");

const DIG = require("discord-image-generation");

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "obra (@usuario)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#88FFC8`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#88FFC8`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let url = `https://top.gg/api/bots/${client.config.id}/check?userId=${message.author.id}`;

  fetch(url, { method: "GET", headers: { Authorization: client.config.token_top_gg }}).then((res) => res.text()).then(async (json) => {
    var isVoted = JSON.parse(json).voted;
    if(isVoted === 0){
  try{
    return message.author.send(new Discord.MessageEmbed().setDescription(`:hushed: **Oh vaya, hoy no me has votado...**\n\nPara desbloquear los comandos de Memes, vótame aquí: https://top.gg/bot/${client.config.id}/vote\n\n*(Acción necesaria cada 12 horas)*`).setThumbnail(`https://cdn.discordapp.com/attachments/823263020246761523/862330928876355584/0.png`).setFooter(`Y ya de paso, si dejas un comentario, estaría de lujo 👌`).setColor(`#F7F9F7`))
  }catch{return message.channel.send(new Discord.MessageEmbed().setDescription(`:hushed: **Oh vaya, hoy no me has votado...**\n\nPara desbloquear los comandos de Memes, vótame aquí: https://top.gg/bot/${client.config.id}/vote\n\n*(Acción necesaria cada 12 horas)*`).setThumbnail(`https://cdn.discordapp.com/attachments/823263020246761523/862330928876355584/0.png`).setFooter(`Y ya de paso, si dejas un comentario, estaría de lujo 👌`).setColor(`#F7F9F7`))}
} 
    let usuario = message.mentions.members.first()
    let avatar;

    if(usuario) avatar = usuario.user.displayAvatarURL({ dynamic: false, format: 'png' });
    else avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });

    let img = await new DIG.Ad().getImage(avatar)
    await message.channel.send(new Discord.MessageEmbed()
      .attachFiles([new MessageAttachment(img, "delete.png")])
      .setImage(`attachment://delete.png`)
      .setColor(`#88FFC8`)
      .setAuthor(message.author.username, message.author.avatarURL()))
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
