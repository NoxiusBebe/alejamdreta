/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_tematicos = new sqlite3.Database("./memoria/db_tematicos.sqlite");
const db_valentin = new sqlite3.Database("./memoria/db_valentin.sqlite");

const sv_bombones = require("../../../archivos/Documentos/Tematicos/San Valentin/bombones.json")
const sv_bombones_imagenes = require("../../../archivos/Documentos/Tematicos/San Valentin/bombones_imagenes.json")
const sv_ingredientes = require("../../../archivos/Documentos/Tematicos/San Valentin/ingredientes.json")
const sv_ingredientes_comandos = require("../../../archivos/Documentos/Tematicos/San Valentin/ingredientes_comandos.json")
const sv_ingredientes_imagenes = require("../../../archivos/Documentos/Tematicos/San Valentin/ingredientes_imagenes.json")

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
  "ATTACH_FILES": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "sv.caja`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'valentin'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 en funciones automatas de san valentin`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_valentin.get(`SELECT * FROM '${message.guild.id}' WHERE id = '${message.author.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 ganando puntos`)
        if(!filas2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **No tienes ingredientes**`).setColor("#FB2727"))

        let bombon_1 = 0;
        let bombon_2 = 0;
        let bombon_3 = 0;
        let bombon_4 = 0;
        let bombon_5 = 0;

        let negro = filas2.ingrediente_1;
        let blanco = filas2.ingrediente_2;
        let frambuesa = filas2.ingrediente_3;
        let mousse = filas2.ingrediente_4;
        let virutas = filas2.ingrediente_5;
        let naranja = filas2.ingrediente_6;
        let chile = filas2.ingrediente_7;

        while(negro>0){
          bombon_1++;
          negro=negro-1
        }

        negro = filas2.ingrediente_1;
        blanco = filas2.ingrediente_2;
        frambuesa = filas2.ingrediente_3;
        mousse = filas2.ingrediente_4;
        virutas = filas2.ingrediente_5;
        naranja = filas2.ingrediente_6;
        chile = filas2.ingrediente_7;

        while(negro>0 && blanco>0){
          bombon_2++;
          negro=negro-1;
          blanco=blanco-1;
        }

        negro = filas2.ingrediente_1;
        blanco = filas2.ingrediente_2;
        frambuesa = filas2.ingrediente_3;
        mousse = filas2.ingrediente_4;
        virutas = filas2.ingrediente_5;
        naranja = filas2.ingrediente_6;
        chile = filas2.ingrediente_7;

        while(frambuesa>0 && blanco>0){
          bombon_3++;
          frambuesa=frambuesa-1;
          blanco=blanco-1;
        }

        negro = filas2.ingrediente_1;
        blanco = filas2.ingrediente_2;
        frambuesa = filas2.ingrediente_3;
        mousse = filas2.ingrediente_4;
        virutas = filas2.ingrediente_5;
        naranja = filas2.ingrediente_6;
        chile = filas2.ingrediente_7;

        while(mousse>0 && virutas>0 && naranja>0){
          bombon_4++;
          mousse=mousse-1;
          virutas=virutas-1;
          naranja=naranja-1;
        }

        negro = filas2.ingrediente_1;
        blanco = filas2.ingrediente_2;
        frambuesa = filas2.ingrediente_3;
        mousse = filas2.ingrediente_4;
        virutas = filas2.ingrediente_5;
        naranja = filas2.ingrediente_6;
        chile = filas2.ingrediente_7;

        while(mousse>0 && virutas>0 && chile>0){
          bombon_5++;
          mousse=mousse-1;
          virutas=virutas-1;
          chile=chile-1;
        }

        let embed = new Discord.MessageEmbed()
          .setTitle(`:revolving_hearts: CAJA DE SAN VALENTÍN :revolving_hearts:`)
          .setDescription(`:cake: Los bombones que puedes cocinar son:`)
          .addField(`1. Bombón de chocolate:`, bombon_1, true)
          .addField(`2. Bombón blanco y negro:`, bombon_2, true)
          .addField(`3. Bombón de frambuesa:`, bombon_3, true)
          .addField(`4. Trufa de naranja:`, bombon_4, true)
          .addField(`\u200b`, `\u200b`, true)
          .addField(`5. Trufa picante:`, bombon_5, true)
          .setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837043261145139/caja.png`)
          .setColor("#F576E4")
          .setFooter(`Podrás ver los ingredientes que tienes en la siguiente página || Pág 1/3`)
        message.channel.send(embed).then(async m => {
          await m.react("⏪");
          await m.react("⏩");
          db_valentin.run(`UPDATE '${message.guild.id}' SET canal_ayuda = ${m.channel.id}, mensaje_ayuda = ${m.id}, pagina_ayuda = 1 WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #1 mostrando estadisticas de san valentin`)
          })
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
