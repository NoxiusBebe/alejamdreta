/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');
const { MessageMenuOption, MessageMenu } = require("discord-buttons")

const sqlite3 = require('sqlite3').verbose();
const db_radio = new sqlite3.Database("./memoria/db_radio.sqlite");
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

const radio = require('discord-radio-player')

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "+fav.radio [nombre de la emisora] | (region: ES, MX, US, FR, AU...)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#39F0BE`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#39F0BE`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en "abrir" en ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.audio===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-audio.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#39F0BE`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    let cadena = args.join(" ").split(" | ")
    if(!cadena[0]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **¿Y la emisora?**\n\n${estructura}`).setColor(`#39F0BE`))
    let searchInit = await radio.Radio.search({searchterm:cadena[0],limit:100,by:'name'})
    let search = [];
    if(cadena[1]){
      for(var i=0 ; i<searchInit.length ; i++){
        if(searchInit[i].countrycode===cadena[1] && searchInit[i].country!=''){
          if(search.length<=0) search.push(`:wink: Aquí tienes las radios que buscas. Si las hay, también te incluyo otras más:\n`)
          search.push(searchInit[i])
        }
      }
      if(search.length<=0) search.push(`:x: No he encontrado esta emisora para esa región. Aun así, están todas estas:\n`)
    }
    else search.push(`:wink: Estas son todas las cadenas que he encontrado para tu búsqueda:\n`)
    for(var i=0 ; i<searchInit.length ; i++){
      if(search.some(k => k === searchInit[i])) null;
      else if(searchInit[i].country!='' && searchInit[i].countrycode!='') search.push(searchInit[i]);
    }

    if(search.length<=1) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **No he encontrado esta emisora. Prueba con otra.**\n\n${estructura}`).setColor(`#39F0BE`))

    let longitud;

    if(search.length<20) longitud = search.length;
    else longitud = 20;

    let emisoras = new Discord.MessageEmbed()
      .setDescription(search[0])
      .setColor(`#39F0BE`)
      .setFooter("El menú dejará de funcionar en 5 minutos")
      .setTimestamp();

    let menu = new MessageMenu()
      .setID("menu-radio")
      .setPlaceholder(`⭐ ¿Qué emisora quieres añadir a tus favoritos? 🎙️`);

    for(var i=1 ; i<longitud ; i++) menu.addOption(new MessageMenuOption().setValue(i).setLabel(search[i].name).setDescription(search[i].country).setEmoji('📻'))

    let msg = await message.channel.send(emisoras, menu.toJSON())

    const filter = (menu) => menu.clicker.id === message.author.id;
    const collector = msg.createMenuCollector(filter, {time: 300000})

    collector.on('collect', async (menu) => {
      let eleccion = parseInt(menu.values[0])
      let icono = search[eleccion].favicon;
      let portada = [];
      for(var i=0 ; i<icono.length ; i++){
        if(icono[i]===" ") portada.push("%20")
        else portada.push(icono[i])
      }
      db_radio.run(`CREATE TABLE IF NOT EXISTS '${message.author.id}' (cadena TEXT, region TEXT, enlace TEXT, imagen TEXT)`, function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 creando tabla en la radio`)
        db_radio.all(`SELECT * FROM '${message.author.id}'`, async (err, filas2) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 creando tabla en la radio`)
          if(filas2.length >= 25) return message.channel.send(new Discord.MessageEmbed().setDescription(`🥵 **Tu lista de favoritos está llena. Debes quitar alguna antes.**`).setColor(`#39F0BE`))
          if(filas2.some(p => p.enlace === search[eleccion].url_resolved)) return message.channel.send(new Discord.MessageEmbed().setDescription(`🔄 **Esta emisora ya estaba en tu lista de favoritos. Elige otra.**`).setColor(`#39F0BE`))
          db_radio.run(`INSERT INTO '${message.author.id}'(cadena, region, enlace, imagen) VALUES('${search[eleccion].name}','${search[eleccion].country}','${search[eleccion].url_resolved}','${search[eleccion].favicon}')`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 creando tabla en la radio`)
            return message.channel.send(new Discord.MessageEmbed().setDescription(`⭐ La emisora **${search[eleccion].name}** se ha guardado en tu lista de favoritos :radio:`).setColor(`#39F0BE`).setImage(`${portada.join("")}`).setFooter(`${search[eleccion].country}`))
          })
        })
      })
      menu.reply.defer()
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
