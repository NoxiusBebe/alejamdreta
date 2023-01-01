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
  "SEND_MESSAGES": "✅",
  "MANAGE_GUILD": "✅"
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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "p.canales [#canal1] [#canal2] [#canal3] [#canal4] [#canal5]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

      let conjunto = args.join(" ").split(" ")
      if(conjunto.length!=5) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes mencionar 5 canales**\n\n${estructura}`).setColor("#819FF7"))
      let rol;
      let canales_pascua = [];
      for(var i=0 ; i<5 ; i++){
        if(!conjunto[i]) break;
        rol = checkMentionChannel(args[i]);
        rol = await message.guild.channels.cache.find(c => c.id === `${rol}`)
        if(!rol){
          return message.channel.send(new Discord.MessageEmbed().setDescription(`:lying_face: **La ${i+1}º mención del canal, no corresponde con ningún canal del servidor**\n\n${estructura}`).setColor("#819FF7"))
          break;
        }
        canales_pascua.push(rol.id)
        if(i===4){
          await message.channel.send(new Discord.MessageEmbed().setAuthor(`Se están asignando los canales. ¡Disfruta de la Pascua!`, `https://www.filo.news/export/sites/claro/img/2017/04/10/-2145811942-huevo_de_pascua-iloveimg-cropped.gif`))
          for(var h=0 ; h<5 ; h++) await message.guild.channels.resolve(canales_pascua[h]).send(new Discord.MessageEmbed().setAuthor(`El conejo de Pascua ha pasado por aquí. ¿Habrá dejado algo? ...`, 'https://cdn.discordapp.com/attachments/523268901719769088/816282262417047552/9134e0df260bf6079c2fc92f4a19c0a05956abbf_00.gif').setColor("#819FF7"))
          db_pascua.get(`SELECT * FROM servidores WHERE id = '${message.guild.id}'`, async (err, filas2) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 ganando puntos`)
            if(!filas2){
              db_pascua.run(`INSERT INTO servidores(id,canal1,canal2,canal3,canal4,canal5) VALUES('${message.guild.id}','${canales_pascua[0]}','${canales_pascua[1]}','${canales_pascua[2]}','${canales_pascua[3]}','${canales_pascua[4]}')`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
              })
            }
            else{
              db_pascua.run(`UPDATE servidores SET canal1 = '${canales_pascua[0]}', canal2 = '${canales_pascua[1]}', canal3 = '${canales_pascua[2]}', canal4 = '${canales_pascua[3]}', canal5 = '${canales_pascua[4]}' WHERE id = '${message.guild.id}'`, function(err) {
                if(err) return console.log(err.message + ` ERROR #4 en la funcion de reaccion al check`)
              })
            }
          })
        }
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

function checkMentionChannel(args){
  let match = args.match(/(?<=(<#))(\d{17,19})(?=>)/g)
  return match ? match[0] : args;
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
