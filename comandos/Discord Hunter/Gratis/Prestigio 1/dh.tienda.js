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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.tienda`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let embed = new Discord.MessageEmbed()
    .setTitle(`**:crystal_ball: La tienda de la hechicera :moneybag:**`)
    .setDescription("Pociones de sanacion, conjuros de poder... todo lo que necesita un gran guerrero\n"+'```\n'+
    client.config.prefijos[message.guild.id]+'dh.diario ➢ Reclama tus 500 coins diarias (Gratis)\n'+
    client.config.prefijos[message.guild.id]+'dh.boost  ➢ Obten extra de vida (1 vida = 1.000 coins)\n'+
    client.config.prefijos[message.guild.id]+'dh.sanar  ➢ Recupera toda tu vida\n'+
                                             '                           (Prestigio 1 ~ 500 coins)\n'+
                                             '                           (Prestigio 2 ~ 3000 coins)\n'+
                                             '                           (Prestigio 3 ~ 10000 coins)\n'+
    '```\n'+
    '```\n'+
    client.config.prefijos[message.guild.id]+'dh.armadura ➢ Obten una armadura\n\n'+
             'madera   - 100 de escudo (100 coins) [Prestigio 1]\n'+
             'acero    - 500 de escudo (1.000 coins) [Prestigio 1]\n'+
             'bronce   - 1.000 de escudo (5.000 coins) [Prestigio 1]\n'+
             'plata    - 6.000 de escudo (20.000 coins) [Prestigio 2]\n'+
             'oro      - 20.000 de escudo (100.000 coins) [Prestigio 2]\n'+
             'platino  - 50.000 de escudo (1.000.000 coins) [Prestigio 2]\n'+
             'diamante - 100.000 de escudo (20.000.000 coins) [Prestigio 3]\n'+
             'divina   - 500.000 de escudo (50.000.000 coins) [Prestigio 3]\n'+
    '```')
    .setColor(`#9262FF`)
  return message.channel.send(embed)
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
