/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');
const disbut = require("discord-buttons");
const math = require("math-expression-evaluator");

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "MANAGE_MESSAGES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "calculadora`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let resultado = 0;

  let row = new disbut.MessageActionRow()
    .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`AC`).setID('AC'))
    .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`√`).setID('√'))
    .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`(`).setID('('))
    .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`)`).setID(')'))
    .addComponents(new disbut.MessageButton().setStyle('grey').setLabel(`π`).setID('π'))

  let row2 = new disbut.MessageActionRow()
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`7`).setID('7'))
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`8`).setID('8'))
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`9`).setID('9'))
    .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`/`).setID('/'))
    .addComponents(new disbut.MessageButton().setStyle('grey').setLabel(`e`).setID('e'))

  let row3 = new disbut.MessageActionRow()
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`4`).setID('4'))
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`5`).setID('5'))
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`6`).setID('6'))
    .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`*`).setID('*'))
    .addComponents(new disbut.MessageButton().setStyle('grey').setLabel(`^`).setID('^'))

  let row4 = new disbut.MessageActionRow()
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`1`).setID('1'))
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`2`).setID('2'))
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`3`).setID('3'))
    .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`-`).setID('-'))
    .addComponents(new disbut.MessageButton().setStyle('grey').setLabel(`log`).setID('log'))

  let row5 = new disbut.MessageActionRow()
    .addComponents(new disbut.MessageButton().setStyle('green').setLabel(`0`).setID('0'))
    .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`.`).setID('.'))
    .addComponents(new disbut.MessageButton().setStyle('red').setLabel(`=`).setID('='))
    .addComponents(new disbut.MessageButton().setStyle('blurple').setLabel(`+`).setID('+'))
    .addComponents(new disbut.MessageButton().setStyle('grey').setLabel(`ln`).setID('ln'))

  let msg = await message.channel.send(new Discord.MessageEmbed().setAuthor("Calculadora", message.author.avatarURL()).setDescription("```js\n"+resultado+"\n➢ \n```").setColor(`#F7F9F7`).setFooter("El menú dejará de funcionar en 10 minutos"), { components: [row, row2, row3, row4, row5]})

  const filter = (row) => row.clicker.id === message.author.id;
  const collector = msg.createButtonCollector(filter, {time: 600000})

  let calculo = [];
  let eval = [];
  collector.on('collect', async (row) => {
    if(row.id === "AC"){
      resultado = 0;
      calculo = [];
      eval = [];
      msg.edit(new Discord.MessageEmbed().setAuthor("Calculadora", message.author.avatarURL()).setDescription("```js\n"+resultado+"\n➢ "+calculo.join("")+"\n```").setColor(`#F7F9F7`).setFooter("El menú dejará de funcionar en 10 minutos"))
    }
    else if(row.id === "="){
      if(eval.length <= 0) calculo.push("0"), eval.push("0");
      try{resultado = math.eval(eval.join(""))}catch(e){ resultado = "Sintax Error!"; }
      if(isNaN(resultado) && resultado != "Infinity") resultado = "Sintax Error!";
      else if(resultado === "Infinity") resultado = "∞";
      msg.edit(new Discord.MessageEmbed().setAuthor("Calculadora", message.author.avatarURL()).setDescription("```js\n"+resultado+"\n➢ "+calculo.join("")+"\n```").setColor(`#F7F9F7`).setFooter("El menú dejará de funcionar en 10 minutos"))
      resultado = 0;
      calculo = [];
      eval = [];
    }
    else{
      calculo.push(row.id)
      if(row.id === "√") eval.push("root")
      else if(row.id === "π") eval.push("pi")
      else eval.push(row.id)
      msg.edit(new Discord.MessageEmbed().setAuthor("Calculadora", message.author.avatarURL()).setDescription("```js\n"+resultado+"\n➢ "+calculo.join("")+"\n```").setColor(`#F7F9F7`).setFooter("El menú dejará de funcionar en 10 minutos"))
    }
    row.reply.defer()
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
