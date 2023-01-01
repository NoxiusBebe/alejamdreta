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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "config.servidor`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`:gear: AJUSTES DEL SERVIDOR`)
    .setDescription('Configura tu servidor con mis distintas opciones. Cada una de ellas sirve para algo diferente, pero todas te resultarán útiles para tener tu servidor perfectamente configurado y a la última.\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'antiflood    ➢ Sistema de seguridad contra flood\n' +
    client.config.prefijos[message.guild.id] + 'antiscam     ➢ Sistema de seguridad contra enlaces-scam\n' +
    client.config.prefijos[message.guild.id] + 'palabrotas   ➢ Filtro de lenguaje ofensivo\n' +
    client.config.prefijos[message.guild.id] + 'invitaciones ➢ Filtro de invitaciones de Discord\n' +
    client.config.prefijos[message.guild.id] + 'terminator   ➢ Protocolo de seguridad para emergencias\n' +
    '```' +
    '```' +
    client.config.prefijos[message.guild.id] + 'presentacion ➢ Asignar mensaje para nuevos miembros por MD\n' +
    client.config.prefijos[message.guild.id] + 'rol.inicial  ➢ Asignar rol de inicio para nuevos miembros\n' +
    '```' +
    '\n__Cada uno se ejecuta de una forma diferente. Si te equivocas, yo misma te diré como hacerlo bien__')
    .setFooter('Algunos comandos se activan poniendo ON y OFF, mientras que otros necesitan mas detalles || Ejemplo: '+client.config.prefijos[message.guild.id]+'antispam ON')
    .setColor(`#807C80`)

  let embed2 = new Discord.MessageEmbed()
    .setTitle(`:crown: SECCIÓN PREMIUM`)
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'consultar   ➢ Consulta los datos de un backup\n' +
    client.config.prefijos[message.guild.id] + 'guardar     ➢ Crear un backup del servidor\n' +
    client.config.prefijos[message.guild.id] + 'extraer     ➢ Restaurar el backup del servidor\n' +
    client.config.prefijos[message.guild.id] + 'mens.bienve ➢ Cambiar mensaje de las bienvenidas\n' +
    client.config.prefijos[message.guild.id] + 'mens.desped ➢ Cambiar mensaje de las despedidas\n' +
    client.config.prefijos[message.guild.id] + 'img.bienve  ➢ Cambiar imagen de las bienvenidas\n' +
    client.config.prefijos[message.guild.id] + 'img.desped  ➢ Cambiar imagen de las despedidas\n' +
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
