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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "config.canales`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`:file_folder: ASIGNACIÓN DE CANALES`)
    .setDescription('En esta sección, podrás definir canales de tu servidor para tareas concretas, como por ejemplo saludar a tus nuevos miembros, o bien despedirles como se merecen cuando se van de tu servidor.\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'ofertas      ➢ Ofertas de Amazon automaticas\n' +
    client.config.prefijos[message.guild.id] + 'bienvenida   ➢ Asignar canal para bienvenidas\n' +
    client.config.prefijos[message.guild.id] + 'despedida    ➢ Asignar canal para despedidas\n' +
    client.config.prefijos[message.guild.id] + 'registro     ➢ Asignar canal como registro de admins\n' +
    client.config.prefijos[message.guild.id] + 'verificacion ➢ Asignar canal de verificacion\n' +
    client.config.prefijos[message.guild.id] + 'sanciones    ➢ Asignar canal de sanciones\n' +
    client.config.prefijos[message.guild.id] + 'confesiones  ➢ Asignar canal de confesiones\n' +
    client.config.prefijos[message.guild.id] + 'parches      ➢ Canal de noticias de Alejandreta\n' +
    client.config.prefijos[message.guild.id] + 'ticket       ➢ Asignar canal para ticket de consultas\n' +
    client.config.prefijos[message.guild.id] + 'nsfw         ➢ Asignar canal NSFW\n' +
    '```' +
    '\n__Estos comandos se deben teclear en el mismo canal que quieres asignar para esa funcion.__')
    .setFooter('Si cada comando lo acompañas de un OFF, ese canal dejará de servir para la funcion que le has asignado || Ejemplo: '+client.config.prefijos[message.guild.id]+'logs OFF')
    .setColor(`#D6FBAC`)

  let embed2 = new Discord.MessageEmbed()
    .setTitle(`:crown: SECCIÓN PREMIUM`)
    .setDescription('Estos comandos solo pueden ser usados en aquellos servidores con suscripción __Premium__\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'autocanales ➢ Crear canales configurados automaticamente\n' +
    client.config.prefijos[message.guild.id] + 'periodico   ➢ Asignar canal para las noticias mundiales\n' +
    client.config.prefijos[message.guild.id] + 'mod.ticket  ➢ Sistema de tickets personalizado\n' +
    client.config.prefijos[message.guild.id] + 'sugerencias ➢ Asignar canal para sugerencias\n' +
    client.config.prefijos[message.guild.id] + 'abrir       ➢ Habilitar la escritura en un canal\n' +
    client.config.prefijos[message.guild.id] + 'cerrar      ➢ Bloquear la escritura en un canal\n' +
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
