/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }

let pausa_apodos = new Set();

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_NICKNAMES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "MANAGE_NICKNAMES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "apodos [texto a añadir al apodo]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FF3D5E`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FF3D5E`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }



  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en "apodos" en ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.administrador===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-administrador.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#FF3D5E`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    if(!args.join(" ")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:face_with_raised_eyebrow: **¿Sabes qué quieres añadir al apodo de los usuarios?**\n\n${estructura}`).setColor(`#FF3D5E`))

    await message.guild.members.fetch()
    let miembros = message.guild.members.cache.map(guild => guild.id);

    if(pausa_apodos.has(message.guild.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 1 hora para volver a usar este comando** ⛔`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 6000}))
    pausa_apodos.add(message.guild.id);
    setTimeout(() => { pausa_apodos.delete(message.guild.id); }, 3600000);

    await message.channel.send(new Discord.MessageEmbed().setDescription(`:pencil: **Se está realizando el cambio de apodo. Este proceso tardará: ${T_convertor(miembros.length*1000)} aproximadamente**\n\nTe avisaré cuando termine...`).setFooter(`El tiempo se debe al cumplimiento de las limitaciones de Discord`).setColor(`#FF3D5E`))

    var contador = 0;

    for(var i=0 ; i<miembros.length ; i++){
      let miembro = await message.guild.members.resolve(`${miembros[i]}`);
      if(miembro.nickname) try{await miembro.setNickname(`${miembro.nickname}`+`${args.join(" ")}`)}catch{}
      else try{await miembro.setNickname(`${miembro.user.username}`+`${args.join(" ")}`)}catch{}
      contador++;
      if(contador>=10) contador = 0, sleep(10000);
      if(i === miembros.length-1) message.channel.send(`:white_check_mark: **${message.author}, ya he terminado de cambiar todos los apodos** :thumbsup:`)
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

function T_convertor(ms){
  let años = Math.floor((ms) / (1000 * 60 * 60 * 24 * 365));
  let meses = Math.floor(((ms) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  let dias = Math.floor(((ms) % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
	let horas = Math.floor(((ms) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutos = Math.floor(((ms) % (1000 * 60 * 60)) / (1000 * 60));
  let segundos = Math.floor(((ms) % (1000 * 60)) / 1000);

	let final = ""
  if(años > 0) final += años > 1 ? `${años} años, ` : `${años} año, `
  if(meses > 0) final += meses > 1 ? `${meses} meses, ` : `${meses} mes, `
  if(dias > 0) final += dias > 1 ? `${dias} dias, ` : `${dias} dia, `
  if(horas > 0) final += horas > 1 ? `${horas} horas, ` : `${horas} hora, `
  if(minutos > 0) final += minutos > 1 ? `${minutos} minutos ` : `${minutos} minuto `
  if(segundos > 0) final += segundos > 1 ? `${segundos} segundos` : `${segundos} segundo`
  return final
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
