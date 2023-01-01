/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_instagram = new sqlite3.Database("./memoria/db_instagram.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅",
  "ADMINISTRATOR": "✅"
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

  return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "instagram [URL del canal] (@rol)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FC5F8B`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FC5F8B`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    if(!filas || (filas.premium===null && filas.social===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-social.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#FC5F8B`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }
    let canal_instagram = args.join(" ")

    if(!canal_instagram || !message.content.includes("https://www.instagram.com/")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:face_with_raised_eyebrow: **Debes poner la URL de la cuenta de Instagram**\n\n${estructura}`).setColor(`#FC5F8B`))

    let role_ping = message.mentions.roles.first();
    if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();
    let nombre_streamer = []
    for(var i=26 ; i<canal_instagram.length ; i++){
      if(canal_instagram[i]==="/") break;
      nombre_streamer.push(canal_instagram[i])
    }
    db_instagram.run(`CREATE TABLE IF NOT EXISTS '${message.guild.id}' (servidor TEXT, canal TEXT, cuenta TEXT, post TEXT, rol TEXT)`, async function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 en +tw`)
      db_instagram.get(`SELECT * FROM '${message.guild.id}' WHERE servidor = '${message.guild.id}' AND canal = '${message.channel.id}' AND cuenta = '${nombre_streamer.join("")}'`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 en +tw`)

        let sentencia;
        if(!filas && !role_ping) sentencia = `INSERT INTO '${message.guild.id}'(servidor, canal, cuenta, rol) VALUES('${message.guild.id}', '${message.channel.id}', '${nombre_streamer.join("")}', '---')`;
        else if(!filas && role_ping) sentencia = `INSERT INTO '${message.guild.id}'(servidor, canal, cuenta, rol) VALUES('${message.guild.id}', '${message.channel.id}', '${nombre_streamer.join("")}', '${role_ping.id}')`;
        else sentencia = `DELETE FROM '${message.guild.id}' WHERE servidor = '${message.guild.id}' AND canal = '${message.channel.id}' AND cuenta = '${nombre_streamer.join("")}'`;

        db_instagram.run(sentencia, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #3 en +tw`)
          if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:inbox_tray: Los post de Instagram de esta cuenta se subiran a este canal`).setColor(`#FC5F8B`))
          else return message.channel.send(new Discord.MessageEmbed().setDescription(`:outbox_tray: Los post de Instagram de esta cuenta que se subían en este canal, ya no se subirán más`).setColor(`#FC5F8B`))
        })
      })
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
