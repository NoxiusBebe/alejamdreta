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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "+dh.inc [nº de la incursión]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 entrando en incursion de 3 de DH`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
    if(filas.estado_incursion===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: Ya estás participando en una **INCURSIÓN**.\n\nCuando acabes, podrás apuntarte a otra").setColor(`#9262FF`))
    if(filas.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud**\n\nCúrate en la tienda`).setColor(`#9262FF`))

    let incursion = args.join(" ")

    db_discordhunter.get(`SELECT * FROM incursiones WHERE numero = ${parseInt(incursion)}`, (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 entrando en incursion de 3 de DH`)
      if(!filas2 || (filas2.id != message.guild.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **No existe ninguna incursión con este número**\n\n${estructura}`).setColor(`#9262FF`))
      if(!filas2.jugador2){
        db_discordhunter.run(`UPDATE incursiones SET jugador2 = ${message.author.id} WHERE numero = ${parseInt(incursion)}`, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #3 entrando en incursion de 3 de DH`)
        })
        db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 1 WHERE id = '${message.author.id}'`, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #4 entrando en incursion de 3 de DH`)
        })
        message.channel.send(new Discord.MessageEmbed().setDescription(`:gear: Has ingresado en la **Incursion**, ${message.author}`))
      }
      else if(!filas2.jugador3){
        db_discordhunter.run(`UPDATE incursiones SET jugador3 = ${message.author.id} WHERE numero = ${parseInt(incursion)}`, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #5 entrando en incursion de 3 de DH`)
        })
        db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 1 WHERE id = '${message.author.id}'`, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #6 entrando en incursion de 3 de DH`)
        })
        message.channel.send(new Discord.MessageEmbed().setDescription(`:gear: Has ingresado en la **Incursion**, ${message.author}`).setColor(`#9262FF`))
      }
      else return message.channel.send(new Discord.MessageEmbed().setDescription(`:frowning: Escuadra llena. No puedes unirte a la **Incursion**, ${message.author}`).setColor(`#9262FF`))
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
