/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "casino`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let embed = new Discord.MessageEmbed()
    .setTitle(`:money_mouth: LAS VEGAS NO ES NADA COMPARADO CON ESTO`)
    .setDescription('Si finalmente caiste en un mal vicio, no lo abandones; total, ya estas perdido :money_mouth:\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'ruleta      ➢ Tira de la ruleta\n' +
    client.config.prefijos[message.guild.id] + 'caballos    ➢ Apuesta a las carreras de caballos\n' +
    client.config.prefijos[message.guild.id] + 'quiniela    ➢ Apuesta en un partido de futbol\n' +
    client.config.prefijos[message.guild.id] + 'tragaperras ➢ Juega a las maquinas tragaperras\n' +
    client.config.prefijos[message.guild.id] + 'blackjack   ➢ Juega al blackjack\n' +
    client.config.prefijos[message.guild.id] + 'sicbo       ➢ Juega al Sic-Bo\n' +
    client.config.prefijos[message.guild.id] + 'bingo       ➢ Juega al Bingo\n' +
    '```' +
    '```' +
    client.config.prefijos[message.guild.id] + 'cartera   ➢ Revisa tu crédito del casino\n' +
    client.config.prefijos[message.guild.id] + 'coleccion ➢ Revisa tus coleccionables de lujo\n' +
    client.config.prefijos[message.guild.id] + 'lujos     ➢ Lujos que puedes comprar para tu coleccion\n' +
    client.config.prefijos[message.guild.id] + 'articulo  ➢ Compra uno de los articulos de lujo del casino\n' +
    '```' +
    '\n__Te diría que los usases con moderación; pero, ¿para qué?__')
    .setFooter('Cada juego da su propia cantidad de monedas. Influye la dificultad de ganar, y del tiempo que deberás esperar para poder volver a jugar. ¿Cuánto ganas con cada juego? Descúbrelo.')
    .setColor(`#95F5FC`)

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
