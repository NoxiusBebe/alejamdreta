/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageMenuOption, MessageMenu } = require("discord-buttons")

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

  let conv_permisos = require(`../../../permissions.js`)
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
    .setTitle(`:notebook_with_decorative_cover: **SECCIÓN DE COMANDOS** :dividers:`)
    .setDescription('Dispongo de muchísimos comandos relacionados con muchos ámbitos diferentes. Todos ellos están agrupados en categorias en función de su utilidad y temática.\n\n' +
    '```' +
    client.config.prefijos[message.guild.id] + 'acciones        ➢ ¿Qué sientes ahora mismo?\n' +
    client.config.prefijos[message.guild.id] + 'administrador   ➢ Comandos para uso del STAFF\n' +
    client.config.prefijos[message.guild.id] + 'audio           ➢ Haz la gracia con grandes sonidos\n' +
    client.config.prefijos[message.guild.id] + 'casino          ➢ Las Vegas no es nada comparado con esto\n' +
    client.config.prefijos[message.guild.id] + 'config.canales  ➢ Asignación de canales\n' +
    client.config.prefijos[message.guild.id] + 'config.roles    ➢ Administra los roles correctamente\n' +
    client.config.prefijos[message.guild.id] + 'config.servidor ➢ Ajustes del servidor\n' +
    client.config.prefijos[message.guild.id] + 'estadisticas    ➢ ¡Que se vean esas estadísticas!\n' +
    client.config.prefijos[message.guild.id] + 'dh.ayuda        ➢ El universo de Discord Hunter\n' +
    client.config.prefijos[message.guild.id] + 'guarderia       ➢ Comandos para hacer tonterias\n' +
    client.config.prefijos[message.guild.id] + 'informacion     ➢ Toda la información a tu alcance\n' +
    client.config.prefijos[message.guild.id] + 'juegos          ➢ Juega a estos minijuegos y disfruta\n' +
    client.config.prefijos[message.guild.id] + 'listas          ➢ Listas, eventos y sorteos\n' +
    client.config.prefijos[message.guild.id] + 'memes           ➢ ¿Qué memes te hacen reir?\n' +
    client.config.prefijos[message.guild.id] + 'niveles         ➢ Sistema de niveles\n' +
    client.config.prefijos[message.guild.id] + 'pokemon         ➢ ¡Hazte con todos!\n' +
    client.config.prefijos[message.guild.id] + 'social          ➢ Redes sociales y grupos\n' +
    client.config.prefijos[message.guild.id] + 'tematicos       ➢ Cada temporada tiene su propio evento\n' +
    client.config.prefijos[message.guild.id] + 'utilidad        ➢ Utilidades variadas\n' +
    client.config.prefijos[message.guild.id] + 'premium         👑 Alejandreta Premium\n' +
    '```')
    .setColor('#5186FF')
    .setFooter("Bot creado por ExpErgio#1253")
    .setTimestamp();

  let menu = new MessageMenu()
    .setID("menu-ayuda")
    .setPlaceholder(`📔 ¿Qué categoría quieres ver? 🗂️`)
    .addOption(new MessageMenuOption().setValue("acciones").setLabel("Acciones").setDescription(`¿Qué sientes ahora mismo?`).setEmoji("😚"))
    .addOption(new MessageMenuOption().setValue("administrador").setLabel("Administrador").setDescription(`Comandos para uso del STAFF`).setEmoji("👮"))
    .addOption(new MessageMenuOption().setValue("audio").setLabel("Audio").setDescription(`Haz la gracia con grandes sonidos`).setEmoji("🎧"))
    .addOption(new MessageMenuOption().setValue("casino").setLabel("Casino").setDescription(`Las Vegas no es nada comparado con esto`).setEmoji("🤑"))
    .addOption(new MessageMenuOption().setValue("config.canales").setLabel("Configurar canales").setDescription(`Asignación de canales`).setEmoji("📁"))
    .addOption(new MessageMenuOption().setValue("config.roles").setLabel("Configurar Roles").setDescription(`Administra los roles correctamente`).setEmoji("🏷️"))
    .addOption(new MessageMenuOption().setValue("config.servidor").setLabel("Configurar Servidor").setDescription(`Ajustes del servidor`).setEmoji("⚙️"))
    .addOption(new MessageMenuOption().setValue("dh.ayuda").setLabel("Discord Hunter").setDescription(`El universo de Discord Hunter`).setEmoji("🌋"))
    .addOption(new MessageMenuOption().setValue("estadisticas").setLabel("Estadisticas").setDescription(`¡Que se vean esas estadísticas!`).setEmoji("🗓️"))
    .addOption(new MessageMenuOption().setValue("guarderia").setLabel("Guardería").setDescription(`Comandos para hacer tonterias`).setEmoji("👶"))
    .addOption(new MessageMenuOption().setValue("informacion").setLabel("Información").setDescription(`Toda la información a tu alcance`).setEmoji("🔖"))
    .addOption(new MessageMenuOption().setValue("juegos").setLabel("Juegos").setDescription(`Juega a estos minijuegos y disfruta`).setEmoji("🥳"))
    .addOption(new MessageMenuOption().setValue("listas").setLabel("Listas").setDescription(`Listas, eventos y sorteos`).setEmoji("🗒️"))
    .addOption(new MessageMenuOption().setValue("memes").setLabel("Memes").setDescription(`¿Qué memes te hacen reir?`).setEmoji("🖼️"))
    .addOption(new MessageMenuOption().setValue("niveles").setLabel("Niveles").setDescription(`Sistema de niveles`).setEmoji("🆙"))
    .addOption(new MessageMenuOption().setValue("pokemon").setLabel("Pokemon").setDescription(`¡Hazte con todos!`).setEmoji("🐶"))
    .addOption(new MessageMenuOption().setValue("social").setLabel("Social").setDescription(`Redes sociales y grupos`).setEmoji("📡"))
    .addOption(new MessageMenuOption().setValue("tematicos").setLabel("Tematicos").setDescription(`Cada temporada tiene su propio evento`).setEmoji("🎏"))
    .addOption(new MessageMenuOption().setValue("utilidad").setLabel("Utilidad").setDescription(`Utilidades variadas`).setEmoji("🔧"))
    .addOption(new MessageMenuOption().setValue("premium").setLabel("Premium").setDescription(`Alejandreta Premium`).setEmoji("👑"))
    .setMaxValues(1)
    .setMinValues(1);

  let msg = await message.channel.send(embed, menu.toJSON())

  const filter = (menu) => menu.clicker.id === message.author.id;
  const collector = msg.createMenuCollector(filter, {time: 600000})

  collector.on('collect', async (menu) => {
    let comando_ayuda = require(`../../../comandos/Ayuda/${menu.values[0]}.js`)
    menu.reply.defer()
    comando_ayuda(client, message, args)
  })
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
