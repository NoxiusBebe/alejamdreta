/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

let direccion = "./archivos/Pistas/Audios";

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
module.exports = async (client, message, args, canal_dj) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "pou`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  if(canal_dj){
    canal_dj.join().then(async connection => {
      const dispatcher = await connection.play(`${direccion}/pou.mp3`, {
        volume: 2
      });
      message.channel.send(new Discord.MessageEmbed().setDescription(`:headphones: ÑO!`).setColor(`#39F0BE`))
      dispatcher.on("finish",() => canal_dj.leave());
    }).catch(err => console.log(`ERROR #1 comando "pou" => ${message.content}`))
  }
  else{
    Canalvoz.join().then(async connection => {
      const dispatcher = await connection.play(`${direccion}/pou.mp3`, {
        volume: 2
      });
      message.channel.send(new Discord.MessageEmbed().setDescription(`:headphones: ÑO!`).setColor(`#39F0BE`))
      dispatcher.on("finish",() => Canalvoz.leave());
    }).catch(err => console.log(`ERROR #1 comando "pou" => ${message.content}`))
  }

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
