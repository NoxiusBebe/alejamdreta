/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_niveles = new sqlite3.Database("./memoria/db_niveles.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "rango`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  db_niveles.get(`SELECT * FROM '${message.guild.id}' WHERE usuario = '${message.author.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 sacando los puntos de un usuario`)
    let nivel_xp;
    let xp_xp;
    let barra;
    if(!filas){
      nivel_xp = 0;
      xp_xp = 0;
    }
    else{
      nivel_xp = filas.nivel
      xp_xp = filas.xp
    }
    xp_xp = xp_xp.toFixed(2);
    if(xp_xp<50) barra = `⬛|⬛|⬛|⬛|⬛|⬛|⬛|⬛|⬛|⬛`;
    if(xp_xp<100 && xp_xp>=50) barra = `🟩|⬛|⬛|⬛|⬛|⬛|⬛|⬛|⬛|⬛`
    if(xp_xp<150 && xp_xp>=100) barra = `🟩|🟩|⬛|⬛|⬛|⬛|⬛|⬛|⬛|⬛`
    if(xp_xp<200 && xp_xp>=150) barra = `🟩|🟩|🟩|⬛|⬛|⬛|⬛|⬛|⬛|⬛`
    if(xp_xp<250 && xp_xp>=200) barra = `🟩|🟩|🟩|🟩|⬛|⬛|⬛|⬛|⬛|⬛`
    if(xp_xp<300 && xp_xp>=250) barra = `🟩|🟩|🟩|🟩|🟩|⬛|⬛|⬛|⬛|⬛`
    if(xp_xp<350 && xp_xp>=300) barra = `🟩|🟩|🟩|🟩|🟩|🟩|⬛|⬛|⬛|⬛`
    if(xp_xp<400 && xp_xp>=350) barra = `🟩|🟩|🟩|🟩|🟩|🟩|🟩|⬛|⬛|⬛`
    if(xp_xp<450 && xp_xp>=400) barra = `🟩|🟩|🟩|🟩|🟩|🟩|🟩|🟩|⬛|⬛`
    if(xp_xp<500 && xp_xp>=450) barra = `🟩|🟩|🟩|🟩|🟩|🟩|🟩|🟩|🟩|⬛`
    if(xp_xp>=500) barra = `🟩|🟩|🟩|🟩|🟩|🟩|🟩|🟩|🟩|🟩`
    let embed = new Discord.MessageEmbed()
      .setTitle(`:vibration_mode: ¿ERES ACTIVO EN EL SERVIDOR? VEÁMOSLO:`)
      .setDescription(barra)
      .addField(`NIVEL: `, nivel_xp, true)
      .addField(`EXPERIENCIA: `, xp_xp+'/500', true)
      .setColor(`#93DBFF`)
      .setThumbnail(message.author.avatarURL())
    return message.channel.send(embed)
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
