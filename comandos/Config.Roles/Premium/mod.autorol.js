/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_roles_mod = new sqlite3.Database("./memoria/db_roles_mod.sqlite");
const db_roles_mod_todos = new sqlite3.Database("./memoria/db_roles_mod_todos.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

let frases_autorol = require("../../../archivos/Documentos/Emojis/frases_autorol.json")

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_ROLES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "MANAGE_ROLES": "✅",
  "MANAGE_MESSAGES": "✅",
  "ADD_REACTIONS": "✅",
  "USE_EXTERNAL_EMOJIS": "✅",
  "MANAGE_MESSAGES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "mod.autorol [@rol1] [emoji1] (@rol2) (emoji2) ... (@rol20) (emoji20)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FF772C`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FF772C`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.config_roles===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-config_roles.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`)
        .setColor(`#FF772C`);
      return message.channel.send(embed_no)
    }*/

    db_roles_mod.run(`CREATE TABLE IF NOT EXISTS '${message.guild.id}' (canal TEXT, mensaje TEXT, rol_1 TEXT, emoji_1 TEXT, rol_2 TEXT,	emoji_2 TEXT, rol_3 TEXT,	emoji_3 TEXT, rol_4 TEXT,	emoji_4 TEXT, rol_5 TEXT, emoji_5 TEXT, rol_6 TEXT,	emoji_6 TEXT, rol_7 TEXT,	emoji_7 TEXT, rol_8 TEXT,	emoji_8 TEXT, rol_9 TEXT,	emoji_9 TEXT, rol_10 TEXT, emoji_10 TEXT, rol_11 TEXT, emoji_11 TEXT, rol_12 TEXT, emoji_12 TEXT, rol_13 TEXT, emoji_13 TEXT, rol_14 TEXT, emoji_14 TEXT, rol_15 TEXT, emoji_15 TEXT, rol_16 TEXT, emoji_16 TEXT, rol_17 TEXT, emoji_17 TEXT, rol_18 TEXT, emoji_18 TEXT, rol_19 TEXT, emoji_19 TEXT, rol_20 TEXT, emoji_20 TEXT)`, async function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "mod.autorol" => ${message.content}`)

      let conjunto = args.join(" ").split(" ")

      let sentencia = " ";

      if(!conjunto[0]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **No has mencionado ningún rol**\n\n${estructura}`).setColor(`#FF772C`))
      if(conjunto[40]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:slight_frown: **Por desgracia, el máximo de roles por mensaje es de 20 roles. Quita alguno**\n\n${estructura}`).setColor(`#FF772C`))

      let emojis = [];
      for(i=1 ; i<args.length ; i=i+2){
        // let id_emoji = checkEmoji(args[i])
        // var bean = message.guild.emojis.cache.find(emoji => emoji.id === id_emoji);
        // if(!bean) return message.channel.send(new Discord.MessageEmbed().setDescription(`:lying_face: **El ${i+1}º emoji, no corresponde a ningún emoji del servidor. Reazlo.**\n\n${estructura}`).setColor(`#FF772C`))
        if(emojis.some(er => er===args[i])) return message.channel.send(new Discord.MessageEmbed().setDescription(`:lying_face: **El emoji ${args[i]} ya lo habías mencionado. No puedes incluirlo más de 1 vez. Reazlo.**\n\n${estructura}`).setColor(`#FF772C`))
        emojis.push(args[i]);
      }

      let roles = [];
      for(i=0 ; i<args.length ; i=i+2){
        let rol = checkMentionRol(args[i]);
        rol = message.guild.roles.cache.find(r => r.id === rol);
        if(!rol) return message.channel.send(new Discord.MessageEmbed().setDescription(`:lying_face: **El ${(i/2)+1}º rol, no corresponde a ningún rol del servidor. Reazlo.**\n\n${estructura}`).setColor(`#FF772C`))
        if(roles.some(er => er===rol.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:lying_face: **El rol ${rol} ya lo habías mencionado. No puedes incluirlo más de 1 vez. Reazlo.**\n\n${estructura}`).setColor(`#FF772C`))
        roles.push(rol.id);
      }

      let lista = [];
      for(var i=0 ; i<roles.length ; i++) lista.push(`${emojis[i]} <@&${roles[i]}>`)
      if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();
      let mensaje = await message.channel.send(new Discord.MessageEmbed().setDescription(`${frases_autorol[Math.round(Math.random()*(frases_autorol.length-1))]}\n\n${lista.join("\n")}`).setColor(`#FF772C`)).then(async m => {
        let insert_1 = [];
        let insert_2 = [];
        insert_1.push(`canal, mensaje,`)
        insert_2.push(`'${message.channel.id}', '${m.id}',`)
        for(var i=0 ; i<emojis.length ; i++) try{await m.react(emojis[i])}catch{
          m.delete();
          return m.channel.send(new Discord.MessageEmbed().setDescription(`:lying_face: **El ${i+1}º emoji, no corresponde a ningún emoji del servidor. Reazlo.**\n\n${estructura}`).setColor(`#FF772C`))
        }
        for(var i=0 ; i<roles.length ; i++){
          if(i===roles.length-1){
            insert_1.push(`rol_${i+1}, emoji_${i+1}`)
            insert_2.push(`'${roles[i]}', '${emojis[i]}'`)
          }
          else{
            insert_1.push(`rol_${i+1}, emoji_${i+1},`)
            insert_2.push(`'${roles[i]}', '${emojis[i]}',`)
          }
        }
        db_roles_mod.run(`INSERT INTO '${message.guild.id}'(${insert_1.join(" ")}) VALUES(${insert_2.join(" ")})`, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "mod.autorol" => ${message.content}`)
          db_roles_mod_todos.run(`INSERT INTO servidores(servidor, ${insert_1.join(" ")}) VALUES('${message.guild.id}', ${insert_2.join(" ")})`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "mod.autorol" => ${message.content}`)
          });
        });
      })
    });
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

function checkMentionRol(args){
  let match = args.match(/(?<=(<@&))(\d{17,19})(?=>)/g)
  return match ? match[0] : args;
};
function checkEmoji(args){
  let id_emoji = [];
  let contador = 0;
  for(var i=0 ; i<args.length ; i++){
    if(args[i]===':') contador++;
    if(contador===2 && !isNaN(args[i])) id_emoji.push(args[i])
  }
  return id_emoji.join("");
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
