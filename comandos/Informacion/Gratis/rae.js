/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const UserAgent = require("user-agents");
const userAgent = new UserAgent()
const path = require('path');
const puppeteer = require('puppeteer');

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "rae [lo que quieras buscar]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#ACC5FB`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#ACC5FB`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let palabra = args.join(" ");
  if(!palabra) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **¿Qué quieres buscar? No lo has dicho**\n\n${estructura}`).setColor(`#ACC5FB`))

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if(request.resourceType() === 'document') request.continue();
    else request.abort();
  });

  await page.setUserAgent(userAgent.userAgent);
  await page.goto(`https://dle.rae.es/${palabra.toLowerCase()}`);

  let definicion;
  definicion = await page.evaluate(() => Array.from(document.getElementsByClassName('j'), e => e.innerText));
  browser.close();

  let enunciado = [];

  if(!definicion || definicion.length<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **No he encontrado esta palabra. Prueba con otra.**\n\n${estructura}`).setColor(`#ACC5FB`))

  for(var i=0 ; i<(definicion.length<=20 ? definicion.length : 20) ; i++){
    let auxiliar = await arreglo(definicion[i]);
    enunciado.push(`**${i+1}.**${auxiliar}`)
  }

  let embed = new Discord.MessageEmbed()
    .setAuthor(palabra, message.author.avatarURL())
    .setDescription(enunciado.join("\n"))
    .setColor(`#ACC5FB`)
    .setImage(`https://cdn.discordapp.com/attachments/823263020246761523/877150441547374592/rae.png`)
    .setTimestamp();
  return message.channel.send(embed)
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

function arreglo(frase){
  let enunciado = [];
  let contador = 0;
  for(var i=0 ; i<frase.length ; i++){
    if(contador >= 2) enunciado.push(frase[i])
    if(frase[i] === ".") contador++;
  }
  return enunciado.join("");
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
