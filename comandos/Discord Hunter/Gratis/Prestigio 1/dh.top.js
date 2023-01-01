/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.top`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};

  let conv_permisos = require(`../../../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)
  

  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#9262FF`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#9262FF`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_discordhunter.all(`SELECT * FROM usuarios`, (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 sacando el top de jugadores`);
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:dash: **No hay jugadores en Discord Hunter**`).setColor(`#9262FF`))
    let frases = [];
    let usuarios = [];
    let niveles = [];
    let prestigio = []
    let aux1;
    let aux2;
    let marcador;
    for(var j=0 ; j<9 ; j++){
      for(var i=0 ; i<filas.length ; i++){
        if(i===0) marcador = i;
        else if(filas[marcador].nivel<filas[i].nivel) marcador = i;
        if(i===filas.length-1){
          usuarios.push(filas[marcador].id)
          if(filas[marcador].prestigio === 1) niveles.push(filas[marcador].nivel)
          else if(filas[marcador].prestigio === 2) niveles.push(filas[marcador].nivel-49999)
          else if(filas[marcador].prestigio === 3) niveles.push(filas[marcador].nivel-149999)
          prestigio.push(filas[marcador].prestigio)
          filas.splice(marcador, 1)
        }
      }
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(`:trophy: **TOP JUGADORES DISCORD HUNTER**`)
      .setDescription(frases.join('\n'))
      .addField(`:first_place: **${niveles[0]}** | ${prestigio[0]} :gem:`, `<@${usuarios[0]}>`, true)
      .addField(`:second_place: ${niveles[1]} | ${prestigio[1]} :gem:`, `<@${usuarios[1]}>`, true)
      .addField(`:third_place: ${niveles[2]} | ${prestigio[2]} :gem:`, `<@${usuarios[2]}>`, true)
      .addField(`:medal: ${niveles[3]} | ${prestigio[3]} :gem:`, `<@${usuarios[3]}>`, true)
      .addField(`:medal: ${niveles[4]} | ${prestigio[4]} :gem:`, `<@${usuarios[4]}>`, true)
      .addField(`:medal: ${niveles[5]} | ${prestigio[5]} :gem:`, `<@${usuarios[5]}>`, true)
      .addField(`:medal: ${niveles[6]} | ${prestigio[6]} :gem:`, `<@${usuarios[6]}>`, true)
      .addField(`:medal: ${niveles[7]} | ${prestigio[7]} :gem:`, `<@${usuarios[7]}>`, true)
      .addField(`:medal: ${niveles[8]} | ${prestigio[8]} :gem:`, `<@${usuarios[8]}>`, true)
      .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
      .setColor("#8c48e0");
    message.channel.send(embed);
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
