/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const disbut = require("discord-buttons");

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

let direccion = "./archivos/Pistas/Audios";

let dj_cooldown = new Set();

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "CONNECT": "✅",
  "SPEAK": "✅"
}
let permisos_bot = {
  "CONNECT": "✅",
  "SPEAK": "✅"
}
let permisos_bot_texto = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dj (@usuario1) (@usuario2) ... (@usuario20)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];
  let f_permisos_bot_texto = [];

  let Canalvoz = message.guild.member(message.author.id).voice.channel;
  if(!Canalvoz) return message.channel.send(new Discord.MessageEmbed().setDescription(`:mute: **${message.author} debes estar conectado en un canal de voz**\n\n${estructura}`).setColor(`#39F0BE`))

  await comprobar_permisos_usuario(client, message, Canalvoz);
  await comprobar_permisos_bot(client, message, Canalvoz);
  await comprobar_permisos_bot_texto(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};
  let g_permisos_bot_texto = {};

  let conv_permisos = require(`../../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)
  g_permisos_bot_texto = await conv_permisos.convertir(permisos_bot_texto)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)
  for(var i in g_permisos_bot_texto) f_permisos_bot_texto.push(`● **${i}** ➩ ${g_permisos_bot_texto[i]}`)

  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#39F0BE`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#39F0BE`))
    for(var i in permisos_bot_texto) if(permisos_bot_texto[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot_texto.join("\n")).setColor(`#39F0BE`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
    for(var i in permisos_bot_texto) if(permisos_bot_texto[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot_texto.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en "abrir" en ${message.guild.id}`)

    let row = new disbut.MessageActionRow()
      .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`${client.config.prefijos[message.guild.id]}18`).setID('18'))
      .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`${client.config.prefijos[message.guild.id]}aplaudir`).setID('aplaudir'))
      .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`${client.config.prefijos[message.guild.id]}bateria`).setID('bateria'))
      .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`${client.config.prefijos[message.guild.id]}cumpleaños`).setID('cumpleaños'))
      .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`${client.config.prefijos[message.guild.id]}eructo`).setID('eructo'))

    let row2 = new disbut.MessageActionRow()
      .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`${client.config.prefijos[message.guild.id]}f`).setID('f'))
      .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`${client.config.prefijos[message.guild.id]}fox`).setID('fox'))
      .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`${client.config.prefijos[message.guild.id]}grillo`).setID('grillo'))
      .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`${client.config.prefijos[message.guild.id]}ingles`).setID('ingles'))
      .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`${client.config.prefijos[message.guild.id]}latigo`).setID('latigo'))

    let row3 = new disbut.MessageActionRow()
      .addComponents(new disbut.MessageButton().setStyle('grey').setLabel(`${client.config.prefijos[message.guild.id]}oeste`).setID('oeste'))
      .addComponents(new disbut.MessageButton().setStyle('grey').setLabel(`${client.config.prefijos[message.guild.id]}pou`).setID('pou'))
      .addComponents(new disbut.MessageButton().setStyle('grey').setLabel(`${client.config.prefijos[message.guild.id]}random`).setID('random'))
      .addComponents(new disbut.MessageButton().setStyle('grey').setLabel(`${client.config.prefijos[message.guild.id]}trompeta`).setID('trompeta'))

    let row4;
  /*  if(!filas || (filas.premium===null && filas.audio===null)){
      row4 = new disbut.MessageActionRow()
        .addComponents(new disbut.MessageButton().setStyle('red').setLabel(`${client.config.prefijos[message.guild.id]}owo`).setID('owo').setEmoji('👑').setDisabled())
        .addComponents(new disbut.MessageButton().setStyle('red').setLabel(`${client.config.prefijos[message.guild.id]}ryan`).setID('ryan').setEmoji('👑').setDisabled())
        .addComponents(new disbut.MessageButton().setStyle('red').setLabel(`${client.config.prefijos[message.guild.id]}uwu`).setID('uwu').setEmoji('👑').setDisabled())
    }
    else{*/
      row4 = new disbut.MessageActionRow()
        .addComponents(new disbut.MessageButton().setStyle('red').setLabel(`${client.config.prefijos[message.guild.id]}owo`).setID('owo').setEmoji('👑'))
        .addComponents(new disbut.MessageButton().setStyle('red').setLabel(`${client.config.prefijos[message.guild.id]}ryan`).setID('ryan').setEmoji('👑'))
        .addComponents(new disbut.MessageButton().setStyle('red').setLabel(`${client.config.prefijos[message.guild.id]}uwu`).setID('uwu').setEmoji('👑'))
    /*}*/


    let menciones = message.mentions.users.map(m => m.id);
    let usuarios_permitidos = [];
    usuarios_permitidos.push('<@'+message.author.id+'>')
    for(var i=0 ; i<menciones.length ; i++) usuarios_permitidos.push('<@'+menciones[i]+'>')

    if(usuarios_permitidos.length>20) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **No podeis usar la mesa más de 20 usuarios**\n\n${estructura}`).setColor(`#39F0BE`))
    if(dj_cooldown.has(Canalvoz.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 30 minutos para usar esto** ⛔`).setColor(`#95F5FC`).setFooter(`Ya hay una mesa de DJ activa en este canal de voz`)).then(m => m.delete({ timeout: 6000}))
    dj_cooldown.add(Canalvoz.id);
    setTimeout(() => { dj_cooldown.delete(Canalvoz.id); }, 1800000);

    let msg = await message.channel.send(new Discord.MessageEmbed().setTitle(`:minidisc: __**LA MESA DEL DJ**__ :headphones:`).setDescription(`Quienes pueden usar los botones: ${usuarios_permitidos.join(", ")}`).setColor(`#39F0BE`).setFooter(`Si quieres que esta mesa la puedan usar más personas, menciónalas la próxima vez que uses el comando`), { components: [row, row2, row3, row4 ]})

    const filter = (row) => menciones.some(df => row.clicker.id === df) || row.clicker.id === message.author.id;
    const collector = msg.createButtonCollector(filter, {time: 1800000})

    collector.on('collect', async (row) => {
      let carpeta;
      if(row.id==="owo" || row.id==="ryan" || row.id==="uwu") carpeta = 'Premium';
      else carpeta = 'Gratis';
      const reproducir_sonido = require(`../../../comandos/Audio/${carpeta}/${row.id}.js`)
      row.reply.defer()
      reproducir_sonido(client, message, args, Canalvoz)
    })
  })
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
async function comprobar_permisos_usuario(client, message, Canalvoz){
  for(var i in permisos_user) permisos_user[i] = "✅";
  for(var i in permisos_user) if(!message.member.hasPermission(i) && !Canalvoz.permissionsFor(message.member).has(i)) permisos_user[i] = "❌";
}
async function comprobar_permisos_bot(client, message, Canalvoz){
  for(var i in permisos_bot) permisos_bot[i] = "✅";
  for(var i in permisos_bot) if(!Canalvoz.permissionsFor(message.guild.me).has(i)) permisos_bot[i] = "❌";
}
async function comprobar_permisos_bot_texto(client, message){
  for(var i in permisos_bot_texto) permisos_bot_texto[i] = "✅";
  for(var i in permisos_bot_texto) if(!message.guild.me.hasPermission(i) && !message.channel.permissionsFor(message.guild.me).has(i)) permisos_bot_texto[i] = "❌";
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
