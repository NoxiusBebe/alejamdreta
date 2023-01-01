/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');
const { MessageMenuOption, MessageMenu } = require("discord-buttons")
const fetch = require('node-fetch');

const monedas = require('../../../archivos/Documentos/Monedas/monedas.json')

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "conversor [número]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let moneda = args.join(" ")
  if(!moneda || isNaN(moneda)) return message.channel.send(new Discord.MessageEmbed().setDescription("`💱`"+` **Debes poner un número que represente tu dinero**\n\n${estructura}`).setColor(`#F7F9F7`))

  let panel1 = new Discord.MessageEmbed()
    .setTitle(`💶 **Conversor de monedas** 💵`)
    .setDescription(`¿Cuál es la divisa de tu dinero?`)
    .setColor(`#F7F9F7`)
    .setFooter("El menú dejará de funcionar en 10 minutos")
    .setTimestamp();

  let menu1 = new MessageMenu()
    .setID("menu-conversor1")
    .setPlaceholder(`💷 Elige una opción:`);

  for(var i in monedas) menu1.addOption(new MessageMenuOption().setValue(`${i}`).setLabel(`${monedas[i][1]} (${i})`).setDescription(`${monedas[i][0]}`).setEmoji(`${monedas[i][2]}`))

  let msg1 = await message.channel.send(panel1, menu1.toJSON())

  const respuesta1 = await new Promise((resolve, reject) => {
    const filter1 = (menu1) => menu1.clicker.id === message.author.id;
    const collector1 = msg1.createMenuCollector(filter1, {time: 600000})
    collector1.on('collect', async (menu1) => {
      let eleccion = menu1.values[0]
      resolve(eleccion)
      menu1.reply.defer()
      collector1.stop();
    })
    collector1.on('end', () => resolve(null));
  });

  let panel2 = new Discord.MessageEmbed()
    .setDescription(`¿A qué divisa quieres convertir tu dinero?`)
    .setColor(`#F7F9F7`)
    .setFooter("El menú dejará de funcionar en 10 minutos")
    .setTimestamp();

  let menu2 = new MessageMenu()
    .setID("menu-conversor2")
    .setPlaceholder(`💴 Elige una opción:`);

  for(var i in monedas) menu2.addOption(new MessageMenuOption().setValue(`${i}`).setLabel(`${monedas[i][1]} (${i})`).setDescription(`${monedas[i][0]}`).setEmoji(`${monedas[i][2]}`))

  let msg2 = await message.channel.send(panel2, menu2.toJSON())

  const respuesta2 = await new Promise((resolve, reject) => {
    const filter2 = (menu2) => menu2.clicker.id === message.author.id;
    const collector2 = msg2.createMenuCollector(filter2, {time: 600000})
    collector2.on('collect', async (menu2) => {
      let eleccion = menu2.values[0]
      if(eleccion === respuesta1) message.channel.send(new Discord.MessageEmbed().setDescription(`:x: No elijas la misma divisa; elije otra...`).setColor(`#F7F9F7`))
      else{
        resolve(eleccion)
        collector2.stop();
      }
      menu2.reply.defer()
    })
    collector2.on('end', () => resolve(null));
  });

  fetch(`http://www.floatrates.com/daily/${respuesta1}.json`, { method: "GET" })
    .then((res) => res.text())
    .then(async (json) => {
      json = JSON.parse(json);
      return message.channel.send(new Discord.MessageEmbed().setAuthor(`${monedas[respuesta1][2]} ⇌ ${monedas[respuesta2][2]}`, message.author.avatarURL()).setDescription("`💱`"+` **${moneda} ${monedas[respuesta1][1]}** son: **${(moneda*json[respuesta2.toLowerCase()].rate).toFixed(2)} ${monedas[respuesta2][1]}**`).setColor(`#F7F9F7`))
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
