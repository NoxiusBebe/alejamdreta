/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

const nombres_armas_dh = require("../../../../archivos/Documentos/Discord Hunter/armas/armas.json")

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.estado`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 viendo estado del usuario`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
    let nivel_mostrar = filas.nivel;
    if(filas.prestigio === 2) nivel_mostrar = nivel_mostrar-49999;
    else if(filas.prestigio === 3) nivel_mostrar = nivel_mostrar-149999;
    let vidanormal = 100+((filas.nivel-1)*2);
    let limitexp = 100+(20*(filas.nivel-1));
    let embed = new Discord.MessageEmbed()
      .setTitle(`:newspaper2: **Estadisticas del personaje** :newspaper2:`)
      .setColor("#6e5496")
      .setThumbnail(message.author.avatarURL())
      .addField("Jugador: ", `<@${message.author.id}>`, true)
      .addField("Nivel: ", nivel_mostrar, true)
      .addField("Prestigio: ", filas.prestigio, true)
      .addField("XP: ", `${filas.xp.toFixed(2)}/${limitexp}`, true)
      .addField("Vida: ", `${filas.vida.toFixed(2)}/${vidanormal}`, true)
      .addField("Escudo: ", `${filas.escudo}`, true)
      .addField("Arma: ", nombres_armas_dh[filas.arma-1], true)
      .addField("Coins: ", filas.coins.toFixed(2), true)
      .addField("**----------------------------------**", "---------------------------------")
      .addField("Trofeo de incursion: ", filas.logro_incursion, true)
      .addField("Trofeo de incursion heroica: ", filas.logro_incursion_heroica, true)
      .addField("Trofeo de ascension: ", filas.logro_ascension, true)
      .addField("Trofeo de desafio: ", filas.logro_desafio, true)
      .setFooter("Un resumen de las estadisticas de tu personaje", client.user.displayAvatarURL());
    let mensaje = await message.channel.send(embed).then(m => {
      m.react("⏪");
      setTimeout(function() {
        m.react("⏩");
      }, 400);
      db_discordhunter.run(`UPDATE usuarios SET canal_estadisticas = '${m.channel.id}', mensaje_estadisticas = '${m.id}', pagina_estadisticas = 1 WHERE id = '${message.author.id}'`, async function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 viendo estado del usuario`)
      });
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
