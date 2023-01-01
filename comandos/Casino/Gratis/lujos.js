/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_cartera = new sqlite3.Database("./memoria/db_cartera.sqlite");

let direccion = "./archivos/Imagenes/Casino";

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "lujos`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#95F5FC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#95F5FC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let embed = new Discord.MessageEmbed()
    .setDescription(`:person_in_tuxedo: **__BOUTIQUE DE LUJO__**`)
    .setThumbnail(`https://cdn.discordapp.com/attachments/823263020246761523/850821828502224906/rico.gif`)
    .setColor(`#95F5FC`)
    .addField(`Artículo 1:`, `:crown:`, true)
    .addField(`Artículo 2:`, `:apple:`, true)
    .addField(`Artículo 3:`, `:guitar:`, true)
    .addField(`Artículo 4:`, `:stopwatch:`, true)
    .addField(`Artículo 5:`, `:gloves:`, true)
    .addField(`Artículo 6:`, `:red_car:`, true)
    .addField(`Artículo 7:`, `:mobile_phone:`, true)
    .addField(`Artículo 8:`, `:closed_umbrella:`, true)
    .addField(`Artículo 9:`, `:magic_wand:`, true)
    .addField(`Artículo 10:`, `:mermaid:`, true)
    .addField(`Artículo 11:`, `:sauropod:`, true)
    .addField(`Artículo 12:`, `:dark_sunglasses:`, true)
    .addField(`Artículo 13:`, `:skull:`, true)
    .addField(`Artículo 14:`, `:teddy_bear:`, true)
    .addField(`Artículo 15:`, `:cloud:`, true)
    .addField(`Artículo 16:`, `:chestnut:`, true)
    .addField(`Artículo 17:`, `:shield:`, true)
    .addField(`Artículo 18:`, `:mage:`, true)
    .addField(`-----------------------------------`, 'Cada artículo cuesta: `250.000` :diamond_shape_with_a_dot_inside:')
    .setFooter(`Para comprar, teclea este comando con el nº de articulo || Ejemplo: `+client.config.prefijos[message.guild.id]+`articulo 9`)
    .setTimestamp();
  return message.channel.send(embed);
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
