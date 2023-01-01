/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_cartera = new sqlite3.Database("./memoria/db_cartera.sqlite");
const db_coleccion = new sqlite3.Database("./memoria/db_coleccion.sqlite");

let lujos = require("../../../archivos/Documentos/Casino/lujos.json")

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "articulo [número del artículo]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#95F5FC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#95F5FC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  if(!args.join(" ")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **Si no se qué artículo quieres, ¿cómo voy a vendértelo?**\n\n${estructura}`).setColor(`#95F5FC`))
  if(isNaN(args.join(" "))) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **El número del artículo va del 1 al 18**\n\n${estructura}`).setColor(`#95F5FC`))
  let articulo = parseInt(args.join(" "));
  if(articulo<1 || articulo>18) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **El número del artículo va del 1 al 18**\n\n${estructura}`).setColor(`#95F5FC`))

  db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "articulo" => ${message.content}`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:money_with_wings: **Siento decirte, que estás más pobre que mi creador. Necesitas 250.000 monedas**`).setColor(`#95F5FC`))
    if(filas.monedas<250000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:money_with_wings: **Siento decirte, que estás más pobre que mi creador. Necesitas 250.000 monedas**`).setColor(`#95F5FC`))

    db_coleccion.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "articulo" => ${message.content}`)

      let sentencia;
      let nombre;
      for(var i in lujos) if(lujos[i]===lujos[articulo-1]) nombre = i;

      if(!filas2) sentencia = `INSERT INTO usuarios(id, P${articulo}, N${articulo}) VALUES('${message.author.id}', '${lujos[articulo-1]}', '${nombre}')`;
      else if(!filas2[`N${articulo}`]) sentencia = `UPDATE usuarios SET N${articulo} = '${nombre}', P${articulo} = '${lujos[articulo-1]}' WHERE id = ${message.author.id}`;
      else return message.channel.send(new Discord.MessageEmbed().setDescription(`:smirk: **Ya tenías este artículo. Qué quieres, ¿fardar de billetes o qué?**`).setColor(`#95F5FC`)).then(m => m.delete({ timeout: 10000}))

      db_coleccion.run(sentencia, async function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "articulo" => ${message.content}`)
        db_cartera.run(`UPDATE usuarios SET monedas = ${filas.monedas-250000} WHERE id = ${message.author.id}`, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #4 comando "articulo" => ${message.content}`)
          return message.channel.send(new Discord.MessageEmbed().setDescription(`:trident: __**Acabo de poner este lujo en tu colección**__\n\nDisfrútalo, que son escasos.`).setColor(`#95F5FC`)).then(m => m.delete({ timeout: 10000}))
        })
      })
    });
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
