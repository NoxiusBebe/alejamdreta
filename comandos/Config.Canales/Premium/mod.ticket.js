/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_tickets_mod = new sqlite3.Database("./memoria/db_tickets_mod.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_CHANNELS": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "MANAGE_CHANNELS": "✅",
  "MANAGE_MESSAGES": "✅",
  "MANAGE_GUILD": "✅",
  "USE_EXTERNAL_EMOJIS": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot && message.author.id!=client.config.id) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "mod.ticket [elegir: 'texto1' o 'OFF'] | [emoji1] | (texto2) | (emoji2) ... (texto10) | (emoji10)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#D6FBAC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#D6FBAC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en "tickets" en ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.config_canales===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-config_canales.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#D6FBAC`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/

    let aux = args.join(" ").split(" | ")
    if(!aux || (!aux[1] && aux[0]!='OFF')) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Debes poner tus opciones junto con sus emojis**\n\n${estructura}`).setColor(`#D6FBAC`))
    if(aux[20]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **La cantidad de opciones está limitada a 10**\n\n${estructura}`).setColor(`#D6FBAC`))

    let emojis = [];
    for(i=1 ; i<aux.length ; i=i+2){
      if(emojis.some(er => er===aux[i])) return message.channel.send(new Discord.MessageEmbed().setDescription(`:lying_face: **El emoji ${aux[i]} ya lo habías mencionado. No puedes incluirlo más de 1 vez. Reazlo.**\n\n${estructura}`).setColor(`#FF772C`))
      emojis.push(aux[i]);
    }

    let frases = [];
    for(i=0 ; i<aux.length ; i=i+2) frases.push(aux[i])

    let lista = [];
    for(var i=0 ; i<frases.length ; i++) lista.push(`${emojis[i]} **${frases[i]}**`)

    if(aux[0]==='OFF'){
      if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();
      db_tickets_mod.get(`SELECT * FROM servidores WHERE servidor = ${message.guild.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "mod.ticket" => ${message.content}`)
        let sentencia;
        if(!filas) sentencia = `DELETE FROM servidores WHERE servidor = '${message.guild.id}'`;
        else{
          let canal = filas.canal;
          let mensaje = filas.mensaje;
          try{client.channels.resolve(canal).messages.delete(mensaje, true)}catch(err){};
          sentencia = `DELETE FROM servidores WHERE servidor = '${message.guild.id}'`;
        }
        db_tickets_mod.run(sentencia, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "ticket" => ${message.content}`)
          client.channels.resolve(message.channel.id).updateOverwrite(message.guild.id, { VIEW_CHANNEL: true }).catch(err => {});
          return message.channel.send(new Discord.MessageEmbed().setDescription(`🗑️ **SE HA DESHABILITADO EL CANAL DE __SOLICITUD DE TICKETS PERSONALIZADAS__**`).setColor(`#D6FBAC`)).then(m => m.delete({ timeout: 7000}))
        })
      })
    }
    else{
      if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();
      let mensaje = await message.channel.send(new Discord.MessageEmbed().setDescription(`🎫 __**SECCIÓN DE TICKETS**__ 🎫\n\nA continuación encontrarás todas las clases de tickets que puedes crear. Reacciona a los emojis en función de tus necesidades.\n\n${lista.join("\n")}`).setColor(`#D6FBAC`)).then(async m => {
        let insert_1 = [];
        let insert_2 = [];
        insert_1.push(`servidor, canal, mensaje, `)
        insert_2.push(`'${message.guild.id}', '${message.channel.id}', '${m.id}', `)
        for(var i=0 ; i<emojis.length ; i++) try{await m.react(emojis[i])}catch{
          m.delete();
          return m.channel.send(new Discord.MessageEmbed().setDescription(`:lying_face: **El ${i+1}º emoji, no corresponde a ningún emoji del servidor. Reazlo.**\n\n${estructura}`).setColor(`#D6FBAC`))
        }
        for(var i=0 ; i<frases.length ; i++){
          if(i===frases.length-1){
            insert_1.push(`texto_${i+1}, emoji_${i+1}`)
            insert_2.push(`'${frases[i]}', '${emojis[i]}'`)
          }
          else{
            insert_1.push(`texto_${i+1}, emoji_${i+1}, `)
            insert_2.push(`'${frases[i]}', '${emojis[i]}', `)
          }
        }
        db_tickets_mod.get(`SELECT * FROM servidores WHERE servidor = ${message.guild.id}`, async (err, filas) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "mod.ticket" => ${message.content}`)
          if(filas){
            let canal = filas.canal;
            let mensaje = filas.mensaje;
            try{client.channels.resolve(canal).messages.delete(mensaje, true)}catch(err){};
          }
          db_tickets_mod.run(`DELETE FROM servidores WHERE servidor = '${message.guild.id}'`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #4 comando "mod.ticket" => ${message.content}`)
            db_tickets_mod.run(`INSERT INTO servidores(${insert_1.join("")}) VALUES(${insert_2.join("")})`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #5 comando "mod.tickets" => ${message.content}`)
              let el_bot = client.users.resolve(client.config.id)
              client.channels.resolve(message.channel.id).updateOverwrite(client.users.resolve(el_bot), {
                VIEW_CHANNEL: true,
                ADD_REACTIONS: true
              }).then(() => {
                client.channels.resolve(message.channel.id).updateOverwrite(message.guild.id, {
                  SEND_MESSAGES: false
                }).catch(err => {});
              }).catch(error => {});
            });
          })
        })
      })
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
