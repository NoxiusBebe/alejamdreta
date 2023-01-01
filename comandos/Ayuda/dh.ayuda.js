/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

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
  "EMBED_LINKS": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.ayuda`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};

  let conv_permisos = require(`../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)


  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#ACC5FB`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#ACC5FB`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 de DH`)
    if(!filas){
      let embed = new Discord.MessageEmbed()
        .setTitle(`:ringed_planet: EL UNIVERSO DE DISCORD HUNTER`)
        .setDescription('Para ver todas las páginas de ayuda, primero debes crearte un personaje con el primer comando que te aparece justo debajo\n\n' +
        '```\n' +
        client.config.prefijos[message.guild.id] + 'dh.crear      ➢ Crea un personaje\n' +
        client.config.prefijos[message.guild.id] + 'dh.reset      ➢ Reinicia tu personaje\n' +
        client.config.prefijos[message.guild.id] + 'dh.borrar     ➢ Borra tu personaje\n' +
        client.config.prefijos[message.guild.id] + 'dh.estado     ➢ Consulta tu estado\n' +
        client.config.prefijos[message.guild.id] + 'dh.jugadores  ➢ ¿Cuántas personas juegan?\n' +
        client.config.prefijos[message.guild.id] + 'dh.top        ➢ Top 10 de jugadores\n' +
        client.config.prefijos[message.guild.id] + 'dh.rol        ➢ Reclama tus roles\n' +
        client.config.prefijos[message.guild.id] + 'dh.ranking    ➢ Top 10 de Supervivencia\n' +
        client.config.prefijos[message.guild.id] + 'dh.tienda     ➢ Visita la tienda\n' +
        client.config.prefijos[message.guild.id] + 'dh.armero     ➢ Visita al armero\n' +
        client.config.prefijos[message.guild.id] + 'dh.mezclar    ➢ Usa la Mesa de Mezclas\n' +
        client.config.prefijos[message.guild.id] + 'dh.auto.info  ➢ Informacion de tu farmeo\n' +
        client.config.prefijos[message.guild.id] + 'dh.auto.parar ➢ Parar farmeo automático\n' +
        '```')
        .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
        .setColor(`#9262FF`);
      return message.channel.send(embed)
    }
    else{
      let embed = new Discord.MessageEmbed()
        .setTitle(`:ringed_planet: EL UNIVERSO DE DISCORD HUNTER`)
        .setDescription('Adéntrate en este mundo con fantásticos seres y peligrosas amenazas...\n\n' +
        '__**INFORMACIÓN**__\n' +
        '```\n' +
        client.config.prefijos[message.guild.id] + 'dh.crear      ➢ Crea un personaje\n' +
        client.config.prefijos[message.guild.id] + 'dh.reset      ➢ Reinicia tu personaje\n' +
        client.config.prefijos[message.guild.id] + 'dh.borrar     ➢ Borra tu personaje\n' +
        client.config.prefijos[message.guild.id] + 'dh.estado     ➢ Consulta tu estado\n' +
        client.config.prefijos[message.guild.id] + 'dh.jugadores  ➢ ¿Cuántas personas juegan?\n' +
        client.config.prefijos[message.guild.id] + 'dh.top        ➢ Top 10 de jugadores\n' +
        client.config.prefijos[message.guild.id] + 'dh.rol        ➢ Reclama tus roles\n' +
        client.config.prefijos[message.guild.id] + 'dh.ranking    ➢ Top 10 de Supervivencia\n' +
        client.config.prefijos[message.guild.id] + 'dh.tienda     ➢ Visita la tienda\n' +
        client.config.prefijos[message.guild.id] + 'dh.armero     ➢ Visita al armero\n' +
        client.config.prefijos[message.guild.id] + 'dh.mezclar    ➢ Usa la Mesa de Mezclas\n' +
        client.config.prefijos[message.guild.id] + 'dh.auto.info  ➢ Informacion de tu farmeo\n' +
        client.config.prefijos[message.guild.id] + 'dh.auto.parar ➢ Parar farmeo automático\n' +
        '```\n'+
        `Obtendreis doble de experiencia si jugais en el servidor soporte. ||  Invitacion: **${client.config.prefijos[message.guild.id]}bot**`)
        .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
        .setColor(`#9262FF`)
        .setFooter(`Sección de comandos: Información || Pág 1/5`);
      let mensaje = await message.channel.send(embed).then(m => {
        m.react("⏪");
        setTimeout(function() {
          m.react("⏩");
        }, 400);
        db_discordhunter.run(`UPDATE usuarios SET canal_ayuda = '${m.channel.id}', mensaje_ayuda = '${m.id}', pagina_ayuda = 1 WHERE id = '${message.author.id}'`, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 viendo estado del usuario`)
        });
      })
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
