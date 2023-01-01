/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_coleccion = new sqlite3.Database("./memoria/db_coleccion.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "coleccion`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#95F5FC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#95F5FC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_coleccion.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "coleccion" => ${message.content}`)
    let emojis = [];
    let nombres = [];
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:feather: **¡Tienes la colección de lujos vacía!**`).setColor(`#95F5FC`))
    for(var i=1 ; i<=18 ; i++){
      if(filas[`N${i}`]){
        nombres.push(filas[`N${i}`])
        emojis.push(filas[`P${i}`])
      }
      else{
        nombres.push(`- - - - - - - -`)
        emojis.push(`:question: :question: :question:`)
      }
      if(i===18){
        let embed = new Discord.MessageEmbed()
          .setDescription(`:shopping_bags: __**COLECCIÓN DE LUJO**__`)
          .setThumbnail(message.author.avatarURL())
          .setColor(`#95F5FC`)
          .addField(`${nombres[0]}`, `${emojis[0]}`, true)
          .addField(`${nombres[1]}`, `${emojis[1]}`, true)
          .addField(`${nombres[2]}`, `${emojis[2]}`, true)
          .addField(`${nombres[3]}`, `${emojis[3]}`, true)
          .addField(`${nombres[4]}`, `${emojis[4]}`, true)
          .addField(`${nombres[5]}`, `${emojis[5]}`, true)
          .addField(`${nombres[6]}`, `${emojis[6]}`, true)
          .addField(`${nombres[7]}`, `${emojis[7]}`, true)
          .addField(`${nombres[8]}`, `${emojis[8]}`, true)
          .addField(`${nombres[9]}`, `${emojis[9]}`, true)
          .addField(`${nombres[10]}`, `${emojis[10]}`, true)
          .addField(`${nombres[11]}`, `${emojis[11]}`, true)
          .addField(`${nombres[12]}`, `${emojis[12]}`, true)
          .addField(`${nombres[13]}`, `${emojis[13]}`, true)
          .addField(`${nombres[14]}`, `${emojis[14]}`, true)
          .addField(`${nombres[15]}`, `${emojis[15]}`, true)
          .addField(`${nombres[16]}`, `${emojis[16]}`, true)
          .addField(`${nombres[17]}`, `${emojis[17]}`, true)
          .setTimestamp();
        return message.channel.send(embed);
      }
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
