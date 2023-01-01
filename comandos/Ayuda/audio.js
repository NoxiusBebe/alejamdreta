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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "audio`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`:headphones: HAZ LA GRACIA CON GRANDES SONIDOS`)
    .setDescription('Estos comandos en verdad no tiene una finalidad práctica ni mucho menos, pero espero que de una forma inocente y simpática, puedas pasarlo bien haciendo tonterias con el resto de tus amigos\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'dj         ➢ Accede a la mesa de DJ\n' +
    '```' +
    '```' +
    client.config.prefijos[message.guild.id] + 'random     ➢ Reproduce un audio "demasiado" random\n' +
    client.config.prefijos[message.guild.id] + 'ingles     ➢ Reproduce una frase en ingles gracioso\n' +
    client.config.prefijos[message.guild.id] + 'grillo     ➢ Reproduce un sonido de grillo\n' +
    client.config.prefijos[message.guild.id] + 'latigo     ➢ Reproduce el sonido de un latigo\n' +
    client.config.prefijos[message.guild.id] + 'bateria    ➢ Ideal despues de contar un chiste\n' +
    client.config.prefijos[message.guild.id] + 'oeste      ➢ Pon ambiente de duelo\n' +
    client.config.prefijos[message.guild.id] + 'trompeta   ➢ Llamada de la caballería\n' +
    client.config.prefijos[message.guild.id] + 'cumpleaños ➢ ¡Feliz Cumpleaños!\n' +
    client.config.prefijos[message.guild.id] + 'aplaudir   ➢ Aplausos del publico\n' +
    client.config.prefijos[message.guild.id] + 'eructo     ➢ Abre la boca y di...\n' +
    client.config.prefijos[message.guild.id] + 'fox        ➢ 20th Century Fox\n' +
    client.config.prefijos[message.guild.id] + 'pou        ➢ Mmm... ÑO!\n' +
    client.config.prefijos[message.guild.id] + '18         ➢ PEGI 18\n' +
    client.config.prefijos[message.guild.id] + 'f          ➢ Menudo FAIL\n' +
    '```' +
    '\nSi tienes al bot muteado, desmutealo. Si no, ¿cómo lo vas a oir?')
    .setFooter('Ni que decir tiene que para usarlos, tienes que estar en un canal de voz. No me seas cebollino.')
    .setColor(`#39F0BE`)

  let embed2 = new Discord.MessageEmbed()
    .setTitle(`:crown: SECCIÓN PREMIUM`)
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'archivo    ➢ Reproduce un archivo tuyo\n' +
    '```' +
    '```' +
    client.config.prefijos[message.guild.id] + 'ryan       ➢ ¿Habéis visto la película?\n' +
    client.config.prefijos[message.guild.id] + 'uwu        ➢ ¡UwU!\n' +
    client.config.prefijos[message.guild.id] + 'owo        ➢ ¿¡OWO!?\n' +
    '```' +
    '```' +
    client.config.prefijos[message.guild.id] + 'radio      ➢ Escucha la radio\n' +
    client.config.prefijos[message.guild.id] + 'fav.radio  ➢ Escucha tus emisoras favoritas\n' +
    client.config.prefijos[message.guild.id] + '+fav.radio ➢ Añade una emisora favorita\n' +
    client.config.prefijos[message.guild.id] + '-fav.radio ➢ Quita una emisora favorita\n' +
    '```')
    .setFooter('Para mas información acerca de cómo obtener premium || '+client.config.prefijos[message.guild.id]+'premium')
    .setColor(`#FFB801`)

  return message.channel.send(embed2, embed)
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
