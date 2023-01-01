/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.armadura [opción: 'no' o un tipo de armadura]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};

  let conv_permisos = require(`../../../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)
  

  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#9262FF`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#9262FF`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let seleccion = args.join(" ")
  db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 comprando armadura de DH`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
    let pago;
    let tipo;
    if(filas.prestigio<2 && (seleccion==='plata' || seleccion==='Plata' || seleccion==='oro' || seleccion==='Oro' || seleccion==='platino' || seleccion==='Platino')) return message.channel.send(new Discord.MessageEmbed().setDescription(`:cd: **NECESITAS ASCENDER A PRESTIGIO 2 PARA COMPRAR ESTA ARMADURA**`)).then(m => m.delete({ timeout: 8000}))
    if(filas.prestigio<3 && (seleccion==='diamante' || seleccion==='Diamante' || seleccion==='divina' || seleccion==='Divina')) return message.channel.send(new Discord.MessageEmbed().setDescription(`:dvd: **NECESITAS ASCENDER A PRESTIGIO 3 PARA COMPRAR ESTA ARMADURA**`)).then(m => m.delete({ timeout: 8000}))

    if(seleccion==='no' || seleccion==='NO' || seleccion==='No') pago = 0, tipo = ":x:";
    else if((seleccion==='madera' || seleccion==='Madera') && filas.coins<100) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **No tienes suficiente dinero**`).setColor(`#9262FF`))
    else if((seleccion==='madera' || seleccion==='Madera') && filas.coins>=100) pago = 100, tipo = "Madera";
    else if((seleccion==='acero' || seleccion==='Acero') && filas.coins<1000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **No tienes suficiente dinero**`).setColor(`#9262FF`))
    else if((seleccion==='acero' || seleccion==='Acero') && filas.coins>=1000) pago = 1000, tipo = "Acero";
    else if((seleccion==='bronce' || seleccion==='Bronce') && filas.coins<5000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **No tienes suficiente dinero**`).setColor(`#9262FF`))
    else if((seleccion==='bronce' || seleccion==='Bronce') && filas.coins>=5000) pago = 5000, tipo = "Bronce";
    else if((seleccion==='plata' || seleccion==='Plata') && filas.coins<20000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **No tienes suficiente dinero**`).setColor(`#9262FF`))
    else if((seleccion==='plata' || seleccion==='Plata') && filas.coins>=20000) pago = 20000, tipo = "Plata";
    else if((seleccion==='oro' || seleccion==='Oro') && filas.coins<100000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **No tienes suficiente dinero**`).setColor(`#9262FF`))
    else if((seleccion==='oro' || seleccion==='Oro') && filas.coins>=100000) pago = 100000, tipo = "Oro";
    else if((seleccion==='platino' || seleccion==='Platino') && filas.coins<1000000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **No tienes suficiente dinero**`).setColor(`#9262FF`))
    else if((seleccion==='platino' || seleccion==='Platino') && filas.coins>=1000000) pago = 1000000, tipo = "Platino";
    else if((seleccion==='diamante' || seleccion==='Diamante') && filas.coins<20000000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **No tienes suficiente dinero**`).setColor(`#9262FF`))
    else if((seleccion==='diamante' || seleccion==='Diamante') && filas.coins>=20000000) pago = 20000000, tipo = "Diamante";
    else if((seleccion==='divina' || seleccion==='Divina') && filas.coins<50000000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **No tienes suficiente dinero**`).setColor(`#9262FF`))
    else if((seleccion==='divina' || seleccion==='Divina') && filas.coins>=50000000) pago = 50000000, tipo = "Divina";
    else return message.channel.send(new Discord.MessageEmbed().setDescription(`:confused: **No entiendo tu selección**\n\n${estructura}`).setColor(`#9262FF`))
    db_discordhunter.run(`UPDATE usuarios SET coins = ${filas.coins-pago}, escudo = '${tipo}' WHERE id = '${message.author.id}'`, function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 comprando armadura de DH`)
      if(tipo===":x:") return message.channel.send(new Discord.MessageEmbed().setDescription(`:shield: **${message.author}, te has desprendido de tu armadura**`))
      else return message.channel.send(new Discord.MessageEmbed().setDescription(`:shield: **${message.author}, tu nueva armadura está lista:** ${tipo}`))
    })
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
