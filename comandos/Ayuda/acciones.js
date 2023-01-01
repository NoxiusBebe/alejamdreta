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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "acciones`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    .setTitle(`:kissing_closed_eyes: ¿QUÉ SIENTES AHORA MISMO?`)
    .setDescription('¿Ganas de reir? ¿Ganas de llorar? ¿Quieres abrazar a alguien? Creo que puedo ayudarte...\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'abrazar    ➢ Dale a alguien un fuerte abrazo\n' +
    client.config.prefijos[message.guild.id] + 'aburrir    ➢ Una piedra tiene mas gracia\n' +
    client.config.prefijos[message.guild.id] + 'acampar    ➢ Una buena comida en el bosque\n' +
    client.config.prefijos[message.guild.id] + 'acariciar  ➢ ¿Una caricia cariñosa?\n' +
    client.config.prefijos[message.guild.id] + 'acurrucar  ➢ Necesito calor humano\n' +
    client.config.prefijos[message.guild.id] + 'avisar     ➢ ¿Alguien la está liando? Díselo.\n' +
    client.config.prefijos[message.guild.id] + 'bailar     ➢ ¡A mover el esqueleto!\n' +
    client.config.prefijos[message.guild.id] + 'besar      ➢ Love is in the air...\n' +
    client.config.prefijos[message.guild.id] + 'bofetada   ➢ Alguien se la ha ganado pero bién\n' +
    client.config.prefijos[message.guild.id] + 'cocinar    ➢ Te hago lo que quieras\n' +
    client.config.prefijos[message.guild.id] + 'comer      ➢ Tengo un antojo de comer...\n' +
    client.config.prefijos[message.guild.id] + 'conducir   ➢ 2 fast 2 furius\n' +
    client.config.prefijos[message.guild.id] + 'cosquillas ➢ Cuuuchi cuchi cuchi cuuuuuuuuuu\n' +
    client.config.prefijos[message.guild.id] + 'dibujar    ➢ Te pinto un Picasso\n' +
    client.config.prefijos[message.guild.id] + 'disparar   ➢ Un tiro en el pecho\n' +
    client.config.prefijos[message.guild.id] + 'enfadar    ➢ Una rabieta de las buenas\n' +
    client.config.prefijos[message.guild.id] + 'espiar     ➢ Si me ves, haz como si nada\n' +
    client.config.prefijos[message.guild.id] + 'golpear    ➢ Puñetazo merecido\n' +
    client.config.prefijos[message.guild.id] + 'gritar     ➢ AAAAAAHHHHHHH!!!!!!\n' +
    client.config.prefijos[message.guild.id] + 'jugar      ➢ Quiero jugar a un juego...\n' +
    client.config.prefijos[message.guild.id] + 'llorar     ➢ BUAAAAAAAAA!!!!\n' +
    client.config.prefijos[message.guild.id] + 'matar      ➢ Te baneo de la vida\n' +
    client.config.prefijos[message.guild.id] + 'observar   ➢ Igualito a Sherlock Holmes\n' +
    client.config.prefijos[message.guild.id] + 'palmada    ➢ Bien hecho, palmadita\n' +
    client.config.prefijos[message.guild.id] + 'presumir   ➢ Osea, porque yo lo valgo\n' +
    client.config.prefijos[message.guild.id] + 'reir       ➢ JEJEJEJEJEJE\n' +
    client.config.prefijos[message.guild.id] + 'sonrojar   ➢ Me pongo colorado\n' +
    '```' +
    '\nY recuerda, si no sabes como expresarte, hay una cosa que se llama psicólogo. No quería ser yo quién lo dijera, pero en fin, para eso están.')
    .setFooter('Cuando uses algún comando de estos, recuerda mencionar a alguien')
    .setColor(`#A94D1E`)

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
