/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");
const db_strikes = new sqlite3.Database("./memoria/db_strikes.sqlite");
const db_configuracion = new sqlite3.Database("./memoria/db_configuracion.sqlite");

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "BAN_MEMBERS": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "BAN_MEMBERS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "reportar [@usuario] [motivo]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let user = message.mentions.members.first()
  let reason = args.join(" ").slice(22);

  if(!user) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **No encuentro a este usuario. ¿Lo has mencionado?**\n\n${estructura}`).setColor(`#FF3D5E`))
  if(!reason) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¡Debes de dar un motivo para el reporte!**\n\n${estructura}`).setColor(`#FF3D5E`))
  if(reason[0].length>2000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:sweat: **¡El motivo es muy largo, debes acortarlo!**\n\n${estructura}`).setColor(`#FF3D5E`))

  var num_warns;
  let sentencia;

  if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

  db_strikes.run(`CREATE TABLE IF NOT EXISTS '${message.guild.id}' (usuario TEXT, strikes INTEGER)`, async function(err) {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "reportar" => ${message.content}`)
    db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "reportar" => ${message.content}`)
      db_strikes.get(`SELECT * FROM '${message.guild.id}' WHERE usuario = ${user.id}`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "reportar" => ${message.content}`)
        if(!filas2) sentencia = `INSERT INTO '${message.guild.id}'(usuario, strikes) VALUES(${user.id}, 1)`, num_warns = 1;
        else sentencia = `UPDATE '${message.guild.id}' SET strikes = ${filas2.strikes+1} WHERE usuario = ${user.id}`, num_warns = filas2.strikes+1;

        db_strikes.run(sentencia, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #4 comando "reportar" => ${message.content}`)
          if(filas && filas.sanciones){
            let embed = new Discord.MessageEmbed()
              .setAuthor(`Usuario reportado por ${message.author.tag}`, 'https://cdn.discordapp.com/attachments/823263020246761523/840905320908849162/81186-triangle-danger-text-area-sign-messaging-emoji.png')
              .setDescription(`**Motivo:** ${reason}`)
              .setColor("#5ECD45")
              .setThumbnail(user.user.displayAvatarURL())
              .addField("Servidor: ", message.guild.name, true)
              .addField("Usuario reportado: ", `${user}`, true)
              .addField("Reportado en: ", message.channel, true)
              .addField("Número de reportes: ", num_warns, true)
              .setTimestamp();
            try{await user.send(embed)}catch{};
            try{await client.channels.resolve(filas.sanciones).send(embed);}catch{message.channel.send(new Discord.MessageEmbed().setDescription(`El **REPORTE** ha sido adjudicado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 10000}))}
          }
          else message.channel.send(new Discord.MessageEmbed().setDescription(`El **REPORTE** ha sido adjudicado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 10000}))
          db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas3) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #5 comando "reportar" => ${message.content}`)
            if(!filas3) return;
            if(num_warns >= filas3.limit_warns){
              if(filas && filas.sanciones){
                let embed2 = new Discord.MessageEmbed()
                  .setAuthor(`Usuario baneado por Alejandreta#5603`, 'https://cdn.discordapp.com/attachments/823263020246761523/840903757591609364/OIP.png')
                  .setDescription(`**Motivo:** __SUPERADO LÍMITE DE REPORTES__. El usuario ha sido baneado automáticamente`)
                	.setColor("#BC0000")
                	.setThumbnail(user.user.displayAvatarURL())
                  .addField("Servidor: ", message.guild.name, true)
                	.addField("Usuario baneado: ", `${user}`, true)
                	.addField("Baneado desde: ", message.channel, true)
                  .setTimestamp();
                if(!message.guild.member(user).bannable) return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido banear a este usuario. Lo siento.`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 6000}))
                await user.send(embed2)
                await message.guild.members.ban(user, {reason: reason})
                try{return client.channels.resolve(filas.sanciones).send(embed2);}catch{}
              }
              else{
                if(!message.guild.member(user).bannable) return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido banear a este usuario. Lo siento.`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 6000}))
                return message.channel.send(new Discord.MessageEmbed().setDescription(`El **BANEO** ha sido realizado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 10000}))
              }
            }
          })
        })
      })
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
