/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment, Util} = require('discord.js');

const fetch = require("node-fetch");

let pausa_actividad = new Set();

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
let permisos_bot_voz = {
  "CREATE_INSTANT_INVITE": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "zombie [elegir: 't' {temporal} o 'p' {permanente}] [conectarse a un canal de voz]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];
  let f_permisos_bot_voz = [];

  const Canalvoz = message.guild.member(message.author.id).voice.channel;
  if(!Canalvoz) return message.channel.send(new Discord.MessageEmbed().setDescription(`:mute: **${message.author} debes estar conectado en un canal de voz**\n\n${estructura}`).setColor(`#FC5F8B`))

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);
  await comprobar_permisos_bot_voz(client, message, Canalvoz);

  let g_permisos_user = {};
  let g_permisos_bot = {};
  let g_permisos_bot_voz = {};

  let conv_permisos = require(`../../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)
  g_permisos_bot_voz = await conv_permisos.convertir(permisos_bot_voz)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)
  for(var i in g_permisos_bot_voz) f_permisos_bot_voz.push(`● **${i}** ➩ ${g_permisos_bot_voz[i]}`)

  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FC5F8B`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FC5F8B`))
    for(var i in permisos_bot_voz) if(permisos_bot_voz[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot_voz.join("\n")).setColor(`#39F0BE`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
    for(var i in permisos_bot_voz) if(permisos_bot_voz[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot_voz.join("\n"))
  }

  if(pausa_actividad.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 5 minutos para volver a usar este comando** ⛔`).setColor(`#39F0BE`)).then(m => m.delete({ timeout: 6000}))
  pausa_actividad.add(message.author.id);
  setTimeout(() => { pausa_actividad.delete(message.author.id); }, 300000);

  let seleccion = args.join(" ")
  if(!seleccion || (seleccion!="t" && seleccion!="p")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:mute: **${message.author}, ¿has dicho que la querías temporal o permanente?**\n\n${estructura}`).setColor(`#FC5F8B`))
  var tiempo;
  if(seleccion === "p") tiempo = 0;
  else tiempo = 3*60*60;

  fetch(`https://discord.com/api/v8/channels/${Canalvoz.id}/invites`, {
      method: "POST",
      body: JSON.stringify({
          max_age: tiempo,
          max_uses: 0,
          target_application_id: "763133495793942528",
          target_type: 2,
          temporary: false,
          validate: null
      }),
      headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
      }
  }).then(res => res.json()).then(invite => {
      if(invite.error || !invite.code || Number(invite.code)===50013 || invite.code==="50013") message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Ha habido un problema con la invitación. Prueba otra vez**`).setColor(`#FC5F8B`))
      message.channel.send(new Discord.MessageEmbed().setTitle(`:chess_pawn: ¿Que tal un Ajedrez? :reminder_ribbon:`).setDescription(`Haced click aquí: <https://discord.gg/${invite.code}>`).setColor(`#FC5F8B`))
  }).catch(e => {
      message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Ha habido un problema con la invitación. Prueba otra vez**`).setColor(`#FC5F8B`))
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
async function comprobar_permisos_bot_voz(client, message, Canalvoz){
  for(var i in permisos_bot) permisos_bot[i] = "✅";
  for(var i in permisos_bot) if(!Canalvoz.permissionsFor(message.guild.me).has(i)) permisos_bot[i] = "❌";
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
