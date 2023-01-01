/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MUTE_MEMBERS": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "MUTE_MEMBERS": "✅",
  "MANAGE_ROLES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "mutear [@usuario] [motivo]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FF3D5E`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FF3D5E`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let user = message.mentions.members.first()
	let reason = args.join(" ").slice(22);

  if(!user) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **No encuentro a este usuario. ¿Lo has mencionado?**\n\n${estructura}`).setColor(`#FF3D5E`))
  if(!reason) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¡Debes de dar un motivo para el muteo!**\n\n${estructura}`).setColor(`#FF3D5E`))
  if(reason[0].length>2000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:sweat: **¡El motivo es muy largo, debes acortarlo!**\n\n${estructura}`).setColor(`#FF3D5E`))

  if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

  let role = await message.guild.roles.cache.find(r => r.name === "Muteado por Alejandreta")
  if(!role){
    role = await message.guild.roles.create({
      data : {
        name : "Muteado por Alejandreta",
        color : "#ff0000",
        permissions : []
      }
    })
  }
  message.guild.channels.cache.filter(ch => ch.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')).forEach(async (channel) => {
    await channel.updateOverwrite(role, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false,
      USE_VAD: false,
      SPEAK: false
    })
  })

  db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "mutear" => ${message.content}`)
    if(filas && filas.sanciones){
      let embed = new Discord.MessageEmbed()
        .setAuthor(`Usuario muteado por ${message.author.tag}`, 'https://cdn.discordapp.com/attachments/823263020246761523/840904595692847114/1f507.png')
        .setDescription(`**Motivo:** ${reason}`)
        .setColor("#3A53F7")
        .setThumbnail(user.user.displayAvatarURL())
        .addField("Servidor: ", message.guild.name, true)
        .addField("Usuario muteado: ", `${user}`, true)
        .addField("Muteado desde: ", message.channel, true)
        .setTimestamp();
      try{await user.send(embed)}catch{}
      try{await user.roles.add(role).catch();}catch{}
      try{return client.channels.resolve(filas.sanciones).send(embed);}catch{}
    }
    else{
      try{await user.roles.add(role).catch();}catch{}
      return message.channel.send(new Discord.MessageEmbed().setDescription(`El **MUTEO** ha sido realizado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 10000}))
    }
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
