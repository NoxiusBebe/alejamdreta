/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.armero`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};

  let conv_permisos = require(`../../../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)
  

  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#9262FF`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#9262FF`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let embed = new Discord.MessageEmbed()
    .setTitle(`**:hammer_pick: El horno del herrero :dollar:**`)
    .setDescription("Adquiere aqui aquello que vayas a usar contra tus peores enemigos.\n"+'```\n'+
    client.config.prefijos[message.guild.id]+'dh.puños    ➢ 40 ~ 50 de daño (Gratis)\n'+
    client.config.prefijos[message.guild.id]+'dh.vara     ➢ 60 ~ 70 de daño (10.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.arco     ➢ 100 ~ 120 de daño (30.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.dagas    ➢ 140 ~ 190 de daño (40.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.martillo ➢ 200 ~ 240 de daño (50.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.ballesta ➢ 280 ~ 340 de daño (90.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.hacha    ➢ 350 ~ 400 de daño (180.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.espada   ➢ 420 ~ 480 de daño (300.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.sable    ➢ 500 ~ 600 de daño (800.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.katana   ➢ 650 ~ 750 de daño (1.500.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.magia    ➢ 800 ~ 900 de daño (3.000.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.baculo   ➢ 980 ~ 1150 de daño (10.000.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.misticos ➢ 1500 ~ 2500 de daño (25.000.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.oscuros  ➢ 3000 ~ 4500 de daño (50.000.000 coins)\n'+
    '```')
    .setColor(`#9262FF`)
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
