/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');
const { MessageMenuOption, MessageMenu } = require("discord-buttons")
const ct = require('countries-and-timezones');
var emoji = require('node-emoji')

const conversor = require('../../../archivos/Documentos/Paises/paises.js')

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "horario [nombre del país]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let pais = args.join(" ")
  if(!pais) return message.channel.send(new Discord.MessageEmbed().setDescription(`🌐 **Te falta el nombre del país**\n\n${estructura}`).setColor(`#F7F9F7`))
  pais = await conversor.convertir(pais)

  let countries = ct.getAllCountries();
  let sistema;
  for(var i in countries) if(countries[i].name === pais[0]) sistema = countries[i]

  if(!sistema || sistema.length<0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **No he encontrado el país. Intenta poner su nombre completo**\n\n${estructura}`).setColor(`#F7F9F7`))

  let emisoras = new Discord.MessageEmbed()
    .setDescription(`🕝 __**Hay países con distintos horarios en función de la región del país.**__\nA continuación, te mostraré todas las regiones horarias de **${pais[1][0]}**`)
    .setColor(`#F7F9F7`)
    .setFooter("El menú dejará de funcionar en 10 minutos")
    .setTimestamp();

  let menu = new MessageMenu()
    .setID("menu-timezonw")
    .setPlaceholder(`🌐 Escoge la región correcta 🏳️`);

  let longitud = sistema['timezones'].length<=25 ? sistema['timezones'].length : 25

  var bandera = emoji.emojify(`:flag-${sistema['id'].toLowerCase()}:`)
  for(var i=0 ; i<(sistema['timezones'].length<=25 ? sistema['timezones'].length : 25); i++) menu.addOption(new MessageMenuOption().setValue(sistema.timezones[i]).setLabel(sistema.timezones[i]).setDescription(pais[1][0]).setEmoji(bandera))

  let msg = await message.channel.send(emisoras, menu.toJSON())

  const filter = (menu) => menu.clicker.id === message.author.id;
  const collector = msg.createMenuCollector(filter, {time: 600000})

  collector.on('collect', async (menu) => {
    let eleccion = menu.values[0]

    let region;
    let hour = ct.getTimezonesForCountry(sistema.id)

    for(var i=0 ; i<hour.length ; i++){
      if(hour[i].name === eleccion) region = hour[i]
    }

    var tiempo = new Date();
    var horas = parseInt(tiempo.getUTCHours());
    var minutos = parseInt(tiempo.getUTCMinutes());
    var segundos = parseInt(tiempo.getUTCSeconds());

    horas = horas+parseInt(region.dstOffsetStr);
    if(horas<0) horas = horas+24;
    else if(horas>=24) horas = horas-24;

    horas = horas.toString();
    minutos = minutos.toString();
    segundos = segundos.toString();

    horas = horas.length < 2 ? "0" + horas : horas;
    minutos = minutos.length < 2 ? "0" + minutos : minutos;
    segundos = segundos.length < 2 ? "0" + segundos : segundos;

    message.channel.send(new Discord.MessageEmbed().setDescription(`${bandera} **La hora actual de __${eleccion}__ es:** ${horas}:${minutos}:${segundos}`).setColor(`#F7F9F7`))

    menu.reply.defer()
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
