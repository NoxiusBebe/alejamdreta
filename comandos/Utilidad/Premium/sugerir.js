/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");
const db_sugerencias = new sqlite3.Database("./memoria/db_sugerencias.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "sugerir [texto] | (URL tipo png o jpg)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.utilidad===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-utilidad.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#F7F9F7`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    let frase = args.join(" ").split(" | ")
    if(!frase[0]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:mailbox_with_no_mail: **Y... ¿cuál es tu sugerencia?**\n\n${estructura}`).setColor(`#F7F9F7`))
    if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();
    db_canales.get(`SELECT * FROM servidores WHERE id = '${message.guild.id}'`, async (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 al hacer sugerencia en ${message.guild.id}`)
      if(!filas2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:confounded: **ESTE SERVIDOR NO CUENTA CON CANAL DE SUGERENCIAS**\n\nDile a un administrador que lo haga usando el comando **${client.config.prefijos[message.guild.id]}sugerencias** en el canal que quiera establecer como canal de sugerencias.`).setColor(`#F7F9F7`))
      else if(!filas2.sugerencias) return message.channel.send(new Discord.MessageEmbed().setDescription(`:confounded: **ESTE SERVIDOR NO CUENTA CON CANAL DE SUGERENCIAS**\n\nDile a un administrador que lo haga usando el comando **${client.config.prefijos[message.guild.id]}sugerencias** en el canal que quiera establecer como canal de sugerencias.`).setColor(`#F7F9F7`))
      else{
        let embed = new Discord.MessageEmbed()
          .setTitle(`:mailbox: SE HA RECIBIDO UNA SUGERENCIA`)
          .setDescription(frase[0])
          .setColor("#FCE14E")
          .addField(`Votos a favor: `,`👍`, true)
          .addField(`Votos en contra: `,`👎`, true)
          .addField("**----------------------------------**", "---------------------------------")
          .addField(`Aprobar: `,`✅`, true)
          .addField(`Denegar: `,`⛔`, true)
          .setFooter(`Sugerencia aportada por: ${message.author.tag}`)
          .setTimestamp();
        if(frase[1]) embed.setImage(frase[1])
        await client.channels.resolve(filas2.sugerencias).send(embed).then(m => {
          m.react('👍')
          setTimeout(function() {
            m.react("👎");
          }, 400);
          setTimeout(function() {
            m.react("✅");
          }, 800);
          setTimeout(function() {
            m.react("⛔");
          }, 1200);
          db_sugerencias.run(`INSERT INTO sugerencias(servidor, titulo, autor, canal, mensaje, nombre, imagen) VALUES('${message.guild.id}', '${frase[0]}', '${message.author.id}', '${filas2.sugerencias}', '${m.id}', '${message.author.tag}', '${frase[1] ? frase[1] : "---"}')`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 al hacer sugerencia en ${message.guild.id}`)
            return message.channel.send(new Discord.MessageEmbed().setDescription(`:postbox: TU SUGERENCIA SE HA ENVIADO CORRECTAMENTE`)).then(m => m.delete({ timeout: 5000}))
          })
        })
      }
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
