/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const tresenraya = require('tresenraya');

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "3enraya [@usuario]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FBACAC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FBACAC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  const usuario = message.mentions.users.first();
  if(!usuario) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **Esto es un juego para 2 jugadores, no para que estés tu solo mirando las fichas...**\n\n${estructura}`).setColor(`#FBACAC`))
  if(usuario.bot) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **No se de quién me hablas. No logro dar con este usuario...**\n\n${estructura}`).setColor(`#FBACAC`))
  if(message.author.id == usuario.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **¿Vas a jugar contra ti mismo? A ver, explícame cómo...**\n\n${estructura}`).setColor(`#FBACAC`))
  const partida = new tresenraya.partida({ jugadores: [message.author.id, usuario.id] });

  message.channel.send('**¡QUE COMIENCE LA BATALLA!** __' + client.users.resolve(partida.turno.jugador).tag + '__, ELIGE UN NÚMERO DEL 1 AL 9 [`' + partida.turno.ficha + '`]\n\n' + partida.tablero.string);

  partida.on('ganador', (jugador, tablero, paso) => { // cuando encuentra a algún ganador se emite el evento 'ganador'
    message.channel.send('**¡TENEMOS CAMPEÓN!** __' + client.users.resolve(jugador).tag + '__ LE HA GANADO A __' + client.users.resolve(partida.perdedor).tag + '__ EN `' + paso + ' PASOS.`\n\n' + tablero.string);
  });

  partida.on('empate', (jugadores, tablero, paso) => { // si se produce un empate se emite el evento 'empate'
    message.channel.send('**¡IMPOSIBLE!** TENEMOS UN EMPATE ENTRE __' + jugadores.map(x => client.users.resolve(x).tag).join(' y ') + '__');
  });

  const colector = message.channel.createMessageCollector(msg => msg.author.id === partida.turno.jugador && !isNaN(msg.content) && (Number(msg.content) >= 1 && Number(msg.content) <= 9) && partida.disponible(msg.content) && !partida.finalizado);
  colector.on('collect', (msg) => {
    partida.elegir(msg.content); // elegir la posición dependiendo del contenido del mensaje recolectado
    if(partida.finalizado) {
      colector.stop();
      return;
    } // si la partida ya ha finalizado (ya sea por que alguien ha ganado o ha habido un empate), para el colector y retorna nada
    message.channel.send('TURNO DE __' + client.users.resolve(partida.turno.jugador).tag + '__ [`' + partida.turno.ficha + '`]\n\n' + partida.tablero.string);
  });
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
