/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");
const db_scammers = new sqlite3.Database("./memoria/db_scammers.sqlite");

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "KICK_MEMBERS": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "KICK_MEMBERS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "expulsar [@usuario] [motivo]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  await message.guild.members.fetch()
  let miembros = message.guild.members.cache.map(guild => guild.id);

  if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

  db_scammers.all(`SELECT * FROM usuarios`, async (err, filas) => {
    if(err || !filas || filas.length<1) return message.channel.send(new Discord.MessageEmbed().setDescription("`🌄` **No hay usuarios peligrosos en el servidor**").setColor(`#FF3D5E`))
    let peligrosos = [];
    for(var i=0 ; i<filas.length ; i++) if(miembros.some(m => filas[i].scam === m)) peligrosos.push(filas[i].scam)
    db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "expulsar" => ${message.content}`)
      for(var i=0 ; i<peligrosos.length ; i++){
        let user = message.guild.members.resolve(peligrosos[i])
        if(filas2 && filas2.sanciones){
          let embed = new Discord.MessageEmbed()
            .setAuthor(`Usuario expulsado por ${message.author.tag}`, 'https://cdn.discordapp.com/attachments/823263020246761523/840905123836067850/boom-emoji-by-twitter.png')
            .setDescription(`**Motivo:** Expulsión de usuarios SCAMMERS automática, activada.`)
            .setColor("#E56B00")
            .setThumbnail(user.user.displayAvatarURL())
            .addField("Servidor: ", message.guild.name, true)
            .addField("Usuario expulsado: ", `${user}`, true)
            .addField("Expulsado desde: ", message.channel, true)
            .setTimestamp();
          if(!message.guild.member(user).kickable) message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido expulsar a este usuario. Lo siento.`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 6000}))
          await user.send(embed)
          await message.guild.member(user).kick("Expulsión de usuarios SCAMMERS automática, activada.")
          try{client.channels.resolve(filas2.sanciones).send(embed);}catch{message.channel.send(new Discord.MessageEmbed().setDescription(`La **EXPULSIÓN** ha sido realizada con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 10000}))}
        }
        else{
          if(!message.guild.member(user).kickable) message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido expulsar a este usuario. Lo siento.`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 6000}))
          message.channel.send(new Discord.MessageEmbed().setDescription(`La **EXPULSIÓN** ha sido realizada con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 10000}))
        }
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
