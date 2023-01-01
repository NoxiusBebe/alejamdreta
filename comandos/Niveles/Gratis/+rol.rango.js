/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_rangos = new sqlite3.Database("./memoria/db_rangos.sqlite");

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅",
  "MANAGE_ROLES": "✅",
  "MANAGE_GUILD": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "MANAGE_ROLES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "+rol.rango [@rol] [nº del nivel]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#93DBFF`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#93DBFF`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let rol = message.mentions.roles.first()
  let nivel = args[1];

  if(!rol) return message.channel.send(new Discord.MessageEmbed().setDescription(`:face_with_raised_eyebrow: **Te ha faltado mencionar el rol**\n\n${estructura}`).setColor(`#93DBFF`))
  if(!nivel) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Se te ha olvidado poner a qué nivele quieres asignar el rol**\n\n${estructura}`).setColor(`#93DBFF`))
  if(isNaN(nivel)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¡El número del nivel, debe ser sin letras ni símbolos!**\n\n${estructura}`).setColor(`#93DBFF`))
  nivel = parseInt(nivel);
  if(nivel<1 || nivel>1000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Los niveles deben estar entre el nivel 1 y el 1.000**\n\n${estructura}`).setColor(`#93DBFF`))

  db_rangos.run(`ALTER TABLE servidores ADD r_${nivel} TEXT`, function(err) {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 asignando rango al nivel`)
  })

  if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

  setTimeout(() => {

    db_rangos.get(`SELECT * FROM servidores WHERE id = '${message.guild.id}'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 asignando rango al nivel`)

      let sentencia;
      if(!filas) sentencia = `INSERT INTO servidores(id,r_${nivel}) VALUES('${message.guild.id}','${rol.name}')`;
      else sentencia = `UPDATE servidores SET r_${nivel} = '${rol.name}' WHERE id = '${message.guild.id}'`;

      db_rangos.run(sentencia, function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #4 asignando rango al nivel`)
        return message.channel.send(new Discord.MessageEmbed().setDescription(`:postbox: **Has asignado el rol ${rol} al nivel ${nivel}**`).setColor(`#93DBFF`))
      })
    });
  }, 1000);
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
