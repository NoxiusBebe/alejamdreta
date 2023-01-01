/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_listas = new sqlite3.Database("./memoria/db_listas.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "-lista [nº de la lista: 1 al 10]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#A9FF3D`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#A9FF3D`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let numero = args.join(" ")

  if(!numero || isNaN(numero) || numero<0 || numero>10) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes concretar el número de la lista (entre 1 y 10)**\n\n${estructura}`).setColor(`#A9FF3D`))
  numero = parseInt(numero);

  db_listas.all(`SELECT * FROM '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 - lista que es ${numero} en ${message.guild.id}`)
    if(!filas[numero-1]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **Esta lista no existe. ¿Gafas o lentillas?**\n\n${estructura}`).setColor(`#A9FF3D`))
    let integrantes = [];
    for(var i=0 ; i<=2000; i++) if(filas[numero-1][`user_${i}`]) integrantes.push(filas[numero-1][`user_${i}`])
    if(!integrantes.some(p => p===`${message.author.id}`)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **No puedo borrarte de una lista en la que no estás; aunque si quieres te borro de la vida, como veas...**\n\n${estructura}`).setColor(`#A9FF3D`))
    for(var i=0 ; i<=2000 ; i++){
      if(filas[numero-1][`user_${i}`]===`${message.author.id}`){
        db_listas.run(`UPDATE '${message.guild.id}' SET user_${i} = NULL, participantes = ${filas[numero-1].participantes-1} WHERE titulo = '${filas[numero-1].titulo}'`, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 - lista que es ${numero} en ${message.guild.id}`)
          message.channel.send(new Discord.MessageEmbed().setDescription(`:pencil: **Te borré de la lista ${numero}**\n\n**Título:** ${filas[numero-1].titulo}\n**Participantes:** ${filas[numero-1].participantes-1}`).setColor(`#A9FF3D`))
        })
        break;
      }
    }
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
