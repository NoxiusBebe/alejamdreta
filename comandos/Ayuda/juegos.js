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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "juegos`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`:partying_face: JUEGA A ESTOS MINIJUEGOS Y DISFRUTA`)
    .setDescription('Juega un rato y despeja la mente. De vez en cuando, está bien evadirte para ver las cosas con perspectiva\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'bola8      ➢ Prueba suerte con tu futuro\n' +
    client.config.prefijos[message.guild.id] + 'pescar     ➢ ¿Pescarás un pez, o un resfriado?\n' +
    client.config.prefijos[message.guild.id] + 'pescaderia ➢ ¿Los pescaste todos? Compruébalo\n' +
    client.config.prefijos[message.guild.id] + 'dado       ➢ Tira el dado para tus juegos de azar\n' +
    client.config.prefijos[message.guild.id] + 'buscaminas ➢ El buscaminas con varios niveles de dificultad\n' +
    client.config.prefijos[message.guild.id] + 'cox        ➢ ¿Cara o cruz?\n' +
    client.config.prefijos[message.guild.id] + 'ppt        ➢ Pidedra, papel, tijeras, lagarto o Spock\n' +
    client.config.prefijos[message.guild.id] + '3enraya    ➢ Juega al 3 en raya con un amigo\n' +
    '```' +
    '\n__Úsalos con moderación. La ludopatía nunca es buena :upside_down:__')
    .setFooter('Diviértete, pero no en exceso. Recuerda: todo lo que sea en exceso, es malo; incluidas las hamburguesas.')
    .setColor(`#FBACAC`)

  let embed2 = new Discord.MessageEmbed()
    .setTitle(`:crown: SECCIÓN PREMIUM`)
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + '4enraya  ➢ Jugar al 4 en raya con un amigo\n' +
    client.config.prefijos[message.guild.id] + 'carrera  ➢ Haz una carrera con todo el servidor\n' +
    client.config.prefijos[message.guild.id] + 'ordenar  ➢ Se el más rápido en escribir bien la palabra\n' +
    client.config.prefijos[message.guild.id] + 'ahorcado ➢ Jugar al ahorcado contra el BOT\n' +
    client.config.prefijos[message.guild.id] + 'akinator ➢ Jugar al Akinator\n' +
    client.config.prefijos[message.guild.id] + 'pizzero  ➢ Cocina pizzas a quien las pida\n' +
    client.config.prefijos[message.guild.id] + 'cliente  ➢ Pide una pizza a domicilio\n' +
    client.config.prefijos[message.guild.id] + 'gourmet  ➢ Coleccion de pizzas extrañas\n' +
    client.config.prefijos[message.guild.id] + 'monedero ➢ Dinero para comprar Pizzas\n' +
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
