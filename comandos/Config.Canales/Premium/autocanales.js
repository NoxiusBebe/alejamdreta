/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_CHANNELS": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "MANAGE_CHANNELS": "✅",
  "MANAGE_GUILD": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "autocanales`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#D6FBAC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#D6FBAC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en "autocanales" en ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.config_canales===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-config_canales.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#D6FBAC`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    await message.channel.send(new Discord.MessageEmbed().setDescription(`:repeat: **Creando y configurando canales...**`).setColor(`#D6FBAC`))
    let chn_1 = await message.guild.channels.create(`✅ᴠᴇʀɪꜰɪᴄᴀᴄɪᴏɴ`, {type: 'text',  permissionOverwrites: [{id: message.guild.id, deny: ['VIEW_CHANNEL']}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}verificacion`)
    })
    let chn_2 = await message.guild.channels.create(`📥ʙɪᴇɴᴠᴇɴɪᴅᴀ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ["SEND_MESSAGES"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}bienvenida`)
    })
    let chn_3 = await message.guild.channels.create(`📤ᴅᴇꜱᴘᴇᴅɪᴅᴀ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ["SEND_MESSAGES"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}despedida`)
    })
    let chn_4 = await message.guild.channels.create(`📂ʀᴇɢɪꜱᴛʀᴏ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, deny: ["SEND_MESSAGES", "VIEW_CHANNEL"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}registro`)
    })
    let chn_5 = await message.guild.channels.create(`🚫ꜱᴀɴᴄɪᴏɴᴇꜱ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ["SEND_MESSAGES"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}sanciones`)
    })
    let chn_6 = await message.guild.channels.create(`🎫ᴛɪᴄᴋᴇᴛꜱ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ["SEND_MESSAGES"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}ticket`)
    })
    let chn_7 = await message.guild.channels.create(`📨ꜱᴜɢᴇʀᴇɴᴄɪᴀꜱ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ["SEND_MESSAGES"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}sugerencias`)
    })
    let chn_8 = await message.guild.channels.create(`🏪ᴏꜰᴇʀᴛᴀꜱ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ["SEND_MESSAGES"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}ofertas`)
    })
    let chn_9 = await message.guild.channels.create(`🤫ᴄᴏɴꜰᴇꜱɪᴏɴᴇꜱ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ["SEND_MESSAGES"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}confesiones`)
    })
    let chn_10 = await message.guild.channels.create(`🤖ᴀʟᴇᴊᴀɴᴅʀᴇᴛᴀ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ["SEND_MESSAGES"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}parches`)
    })
    let chn_11 = await message.guild.channels.create(`📰ɴᴏᴛɪᴄɪᴀꜱ`, {type: 'text', permissionOverwrites: [{id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ["SEND_MESSAGES"]}]}).then(d => {
      d.send(`${client.config.prefijos[message.guild.id]}periodico`)
    })
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
