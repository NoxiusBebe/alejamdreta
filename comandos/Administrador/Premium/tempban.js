/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_tempban = new sqlite3.Database("./memoria/db_tempban.sqlite");
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "BAN_MEMBERS": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "BAN_MEMBERS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "tempban [@usuario] [motivo] | [duración con su unidad: s {segundos}, m {minutos}, h {horas}, d {días}]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.administrador===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-administrador.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#FF3D5E`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    let user = message.mentions.members.first()
    let reason = args.join(" ").slice(22).split(" | ");
    let temp_limit = args.join(" ").split(" | ")

    if(!user) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **¿Recordaste mencionar al usuario?**\n\n${estructura}`).setColor(`#FF3D5E`))
    if(!reason) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pencil: **Debes incluir el motivo del baneo**\n\n${estructura}`).setColor(`#FF3D5E`))
    if(!temp_limit[1]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¿Cuánto tiempo va a estar baneado? ¡No me lo has dicho!**\n\n${estructura}`).setColor(`#FF3D5E`))
    let tiempo_duracion = await getNumbersInString(temp_limit[1])
    let tiempo_unidad = await getCharactersInString(temp_limit[1])
    if(!tiempo_duracion) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes poner la duración del baneo junto con su unidad**\n\n${estructura}`).setColor(`#FF3D5E`))
    if(tiempo_unidad==='s') tiempo_unidad = 1000;
    else if(tiempo_unidad==='m') tiempo_unidad = 60*1000;
    else if(tiempo_unidad==='h') tiempo_unidad = 60*60*1000;
    else if(tiempo_unidad==='d') tiempo_unidad = 24*60*60*1000;
    else return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes poner la duración del baneo junto con su unidad**\n\n${estructura}`).setColor(`#FF3D5E`))
    if(isNaN(tiempo_duracion)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes poner la duración del baneo junto con su unidad**\n\n${estructura}`).setColor(`#FF3D5E`))
    tiempo_duracion = parseFloat(tiempo_duracion);
    if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

    let canal;
    let embed;

    db_tempban.run(`INSERT INTO servidores(servidor, usuario, fecha) VALUES('${message.guild.id}', '${user.id}', '${Date.now()+(tiempo_duracion*tiempo_unidad)}')`, function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #0 haciendo tempban a un usuario`)
    })

    db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 haciendo tempban a un usuario`)
      if(filas && filas.sanciones){
        let embed = new Discord.MessageEmbed()
          .setAuthor(`Usuario baneado por ${message.author.tag}`, 'https://cdn.discordapp.com/attachments/823263020246761523/840903757591609364/OIP.png')
          .setDescription(`**Motivo:** ${reason[0]}`)
        	.setColor("#BC0000")
        	.setThumbnail(user.user.displayAvatarURL())
          .addField("Servidor: ", message.guild.name, true)
        	.addField("Usuario baneado: ", `${user}`, true)
        	.addField("Baneado desde: ", message.channel, true)
          .addField("Tiempo de ban: ", T_convertor(tiempo_duracion*tiempo_unidad), false)
          .setTimestamp();
        if(!message.guild.member(user).bannable) return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido banear a este usuario. Lo siento.`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 6000}))
        user.send(embed)
        message.guild.member(user).ban(reason)
        try{return client.channels.resolve(filas.sanciones).send(embed);}catch{message.channel.send(new Discord.MessageEmbed().setDescription(`El **BANEO TEMPORAL** ha sido realizado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 10000}))}
      }
      else{
        if(!message.guild.member(user).bannable) return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido banear a este usuario. Lo siento.`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 6000}))
        return message.channel.send(new Discord.MessageEmbed().setDescription(`El **BANEO TEMPORAL** ha sido realizado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 10000}))
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
  if(segundos > 0) final += segundos > 1 ? `${segundos} segundos.` : `${segundos} segundo.`
  return final
};

function getNumbersInString(string){
  var tmp = string.split("");
  var map = tmp.map(function(current) {
    if (!isNaN(parseInt(current))) {
      return current;
    }
  });
  var numbers = map.filter(function(value) {
    return value != undefined;
  });
  return numbers.join("");
}
function getCharactersInString(string){
  var tmp = string.split("");
  var map = tmp.map(function(current) {
    if (isNaN(parseInt(current))) {
      return current;
    }
  });
  var numbers = map.filter(function(value) {
    return value != undefined;
  });
  return numbers.join("");
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
