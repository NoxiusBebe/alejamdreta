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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "ayuda`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`:police_officer: COMANDOS PARA USO DEL STAFF`)
    .setDescription('La tarea de un miembro del staff nunca es sencilla, y lo menos que se merecen son comandos que les permitan conservar un orden de la manera mas organizada posible\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'limpiar     ➢ Borrar un numero de mensajes de un chat\n' +
    client.config.prefijos[message.guild.id] + 'avisos      ➢ Establece máx. reportes para ser baneado\n' +
    client.config.prefijos[message.guild.id] + 'reportar    ➢ Reportar a un usuario\n' +
    client.config.prefijos[message.guild.id] + 'desestimar  ➢ Quita un reporte a un usuario\n' +
    client.config.prefijos[message.guild.id] + 'reportes    ➢ 10 usuarios con mas reportes\n' +
    client.config.prefijos[message.guild.id] + 'expulsar    ➢ Expulsar a un usuario\n' +
    client.config.prefijos[message.guild.id] + 'banear      ➢ Banear a un usuario\n' +
    client.config.prefijos[message.guild.id] + 'mutear      ➢ Mutear a un usuario\n' +
    client.config.prefijos[message.guild.id] + 'desmutear   ➢ Desmutear a un usuario\n' +
    client.config.prefijos[message.guild.id] + 'afk         ➢ Enviar AFK a un usuario\n' +
    client.config.prefijos[message.guild.id] + 'scammers    ➢ Comprueba si hay scammers en tu servidor\n' +
    '```' +
    '\n__Cada uno de ellos se ejecuta de una forma distinta. De equivocarte, te indicaré la forma correcta__')
    .setFooter('Algunos se usan mencionando a un usuario, otros poniendo un numero, etc || Ejemplo: '+client.config.prefijos[message.guild.id]+'reportar @usuario motivo')
    .setColor(`#FF3D5E`)

  let embed2 = new Discord.MessageEmbed()
    .setTitle(':crown: **SECCIÓN PREMIUM**')
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'prefijo   ➢ Cambia el prefijo de tu servidor\n' +
    client.config.prefijos[message.guild.id] + 'tempmute  ➢ Mutear a un usuario por tiempo\n' +
    client.config.prefijos[message.guild.id] + 'tempban   ➢ Banear a un usuario por tiempo\n' +
    client.config.prefijos[message.guild.id] + 'silenciar ➢ Silenciar tu canal de voz\n' +
    client.config.prefijos[message.guild.id] + 'hablar    ➢ Desilenciar tu canal de voz\n' +
    client.config.prefijos[message.guild.id] + 'clonar    ➢ Borra y clona un canal de texto\n' +
    client.config.prefijos[message.guild.id] + 'editar    ➢ Edita un mensaje escrito por el bot\n' +
    client.config.prefijos[message.guild.id] + 'sos       ➢ Mueve a tu canal de voz a tu staff\n' +
    client.config.prefijos[message.guild.id] + 'apodos    ➢ Añade algo al apodo de todos los usuarios\n' +
    client.config.prefijos[message.guild.id] + 'restaurar ➢ Restaura todos los apodos\n' +
    client.config.prefijos[message.guild.id] + 'migracion ➢ Mueve a todos de un canal de voz a otro\n' +
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
