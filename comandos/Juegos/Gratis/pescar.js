/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_pescaderia = new sqlite3.Database("./memoria/db_pescaderia.sqlite");

let cañadepescar = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "pescar`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FBACAC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FBACAC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  if(cañadepescar.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 5 segundos** ⛔`).setColor(`#FBACAC`)).then(m => m.delete({ timeout: 5000}))
  cañadepescar.add(message.author.id);
  setTimeout(() => {cañadepescar.delete(message.author.id);}, 5000);

  let rollfish = Math.floor(Math.random() * 100);
  let pescado;
  if(rollfish === 1) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :tropical_fish:').setColor(`#FBACAC`)), pescado = ':tropical_fish:';
  else if(rollfish === 2) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :fish:').setColor(`#FBACAC`)), pescado = ':fish:';
  else if(rollfish === 3) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :blowfish:').setColor(`#FBACAC`)), pescado = ':blowfish:';
  else if(rollfish === 4) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :squid:').setColor(`#FBACAC`)), pescado = ':squid:';
  else if(rollfish === 5) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :octopus:').setColor(`#FBACAC`)), pescado = ':octopus:';
  else if(rollfish === 6) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :dolphin:').setColor(`#FBACAC`)), pescado = ':dolphin:';
  else if(rollfish === 7) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :whale2:').setColor(`#FBACAC`)), pescado = ':whale2:';
  else if(rollfish === 8) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :shark:').setColor(`#FBACAC`)), pescado = ':shark:';
  else if(rollfish === 9) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :crocodile:').setColor(`#FBACAC`)), pescado = ':crocodile:';
  else if(rollfish === 10) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :seal:').setColor(`#FBACAC`)), pescado = ':seal:';
  else if(rollfish === 11) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :crab:').setColor(`#FBACAC`)), pescado = ':crab:';
  else if(rollfish === 12) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :lobster:').setColor(`#FBACAC`)), pescado = ':lobster:';
  else if(rollfish === 13) message.channel.send(new Discord.MessageEmbed().setDescription('Enhorabuena, <@' + message.author + '> ! Has pescado: :shrimp:').setColor(`#FBACAC`)), pescado = ':shrimp:';
  else if(rollfish>13 && rollfish<=21) message.channel.send(new Discord.MessageEmbed().setDescription('Upss... <@' + message.author + '> ! Has pescado: :manual_wheelchair:').setColor(`#FBACAC`));
  else if(rollfish>21 && rollfish<=28) message.channel.send(new Discord.MessageEmbed().setDescription('Upss... <@' + message.author + '> ! Has pescado: :scooter:').setColor(`#FBACAC`));
  else if(rollfish>28 && rollfish<=35) message.channel.send(new Discord.MessageEmbed().setDescription('Upss... <@' + message.author + '> ! Has pescado: :hiking_boot:').setColor(`#FBACAC`));
  else if(rollfish>35 && rollfish<=42) message.channel.send(new Discord.MessageEmbed().setDescription('Upss... <@' + message.author + '> ! Has pescado: :goggles:').setColor(`#FBACAC`));
  else if(rollfish>42 && rollfish<=49) message.channel.send(new Discord.MessageEmbed().setDescription('Upss... <@' + message.author + '> ! Has pescado: :probing_cane:').setColor(`#FBACAC`));
  else if(rollfish>49 && rollfish<=56) message.channel.send(new Discord.MessageEmbed().setDescription('Upss... <@' + message.author + '> ! Has pescado: :toothbrush:').setColor(`#FBACAC`));
  else if(rollfish>56 && rollfish<=63) message.channel.send(new Discord.MessageEmbed().setDescription('Upss... <@' + message.author + '> ! Has pescado: :key:').setColor(`#FBACAC`));
  else message.channel.send(new Discord.MessageEmbed().setDescription('Upss... <@' + message.author + '> ! Has pescado: :shopping_cart:').setColor(`#FBACAC`));
  if(rollfish>0 && rollfish<14){
    db_pescaderia.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 pescando un pez`)
      let sentencia;
      if(!filas) sentencia = `INSERT INTO usuarios(id, Especie${rollfish}) VALUES(${message.author.id}, '${pescado}')`;
      else sentencia = `UPDATE usuarios SET Especie${rollfish} = '${pescado}' WHERE id = ${message.author.id}`;

      db_pescaderia.run(sentencia, function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 pescando un pez`)
      });
    });
  }
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
