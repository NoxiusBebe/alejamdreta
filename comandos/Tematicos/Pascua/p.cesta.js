/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_tematicos = new sqlite3.Database("./memoria/db_tematicos.sqlite");
const db_pascua = new sqlite3.Database("./memoria/db_pascua.sqlite");

const huevos_pascua = require("../../../archivos/Documentos/Tematicos/Pascua/huevos_pascua.json")
const gif_huevos_pascua = require("../../../archivos/Documentos/Tematicos/Pascua/gif_huevos_pascua.json")

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "p.cesta`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FF4949`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FF4949`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    if(!filas || (filas.premium===null && filas.tematicos===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-tematicos.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#FF4949`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'pascua'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 en funciones automatas de san valentin`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_pascua.get(`SELECT * FROM '${message.guild.id}' WHERE id = '${message.author.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 ganando puntos`)
        let huevo_1, huevo_2, huevo_3, huevo_4, huevo_5, huevo_6, huevo_7, huevo_8, huevo_9, huevo_10, huevo_11, huevo_12, huevo_13, huevo_14, huevo_15, puntos;
        if(!filas2) huevo_1=0, huevo_2=0, huevo_3=0, huevo_4=0, huevo_5=0, huevo_6=0, huevo_7=0, huevo_8=0, huevo_9=0, huevo_10=0, huevo_11=0, huevo_12=0, huevo_13=0, huevo_14=0, huevo_15=0, puntos=0;
        else huevo_1=filas2.huevo_1, huevo_2=filas2.huevo_2, huevo_3=filas2.huevo_3, huevo_4=filas2.huevo_4, huevo_5=filas2.huevo_5, huevo_6=filas2.huevo_6, huevo_7=filas2.huevo_7, huevo_8=filas2.huevo_8, huevo_9=filas2.huevo_9, huevo_10=filas2.huevo_10, huevo_11=filas2.huevo_11, huevo_12=filas2.huevo_12, huevo_13=filas2.huevo_13, huevo_14=filas2.huevo_14, huevo_15=filas2.huevo_15, puntos=filas2.puntos;
        let embed = new Discord.MessageEmbed()
          .setTitle(`🧺 CESTA DE PASCUA`)
          .setDescription(`**Puntos conseguidos:** ${puntos}`)
          .setThumbnail(`https://cdn.discordapp.com/attachments/823263020246761523/825853099289608192/Icono2.jpg`)
          .addField(`Zigzag: `, huevo_1, true)
          .addField(`Puzzle: `, huevo_2, true)
          .addField(`Nublado: `, huevo_3, true)
          .addField(`Oleaje: `, huevo_4, true)
          .addField(`Manchitas: `, huevo_5, true)
          .addField(`Lava: `, huevo_6, true)
          .addField(`Confetti: `, huevo_7, true)
          .addField(`Cintas: `, huevo_8, true)
          .addField(`Fresón: `, huevo_9, true)
          .setImage(`https://cdn.discordapp.com/attachments/823263020246761523/825189280032751626/banner.png`)
          .setColor(`#81F7F3`)
          .setTimestamp();
        message.channel.send(embed).then(async m => {
          if(huevo_10>0 || huevo_11>0 || huevo_12>0 || huevo_13>0 || huevo_14>0 || huevo_15>0){
            await m.react("⏪");
            await m.react("⏩");
            db_pascua.run(`UPDATE '${message.guild.id}' SET canal_ayuda = ${m.channel.id}, mensaje_ayuda = ${m.id}, pagina_ayuda = 1 WHERE id = '${message.author.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #1 mostrando estadisticas de pascua`)
            })
          }
        });
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
