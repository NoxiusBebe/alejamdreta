/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_gourmet = new sqlite3.Database("./memoria/db_gourmet.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"

}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "gourmet`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.juegos===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-juegos.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#FBACAC`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    db_gourmet.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 al sacar pizzas de lujo`)
      if(!filas2) return message.channel.send(new Discord.MessageEmbed().setAuthor(`NINGÚN PIZZERO TE HA REGALADO NINGUNA PIZZA ESPECIAL AÚN`, 'https://pixelnest.io/presskit.html/example/images/pizza-02.gif'))
      let pizza_1;
      let pizza_2;
      let pizza_3;
      let pizza_4;
      let pizza_5;
      let pizza_6;

      if(filas2.pizza_1) pizza_1 = 'Focaccia';
      else pizza_1 = ':grey_question: :grey_question: :grey_question:';
      if(filas2.pizza_2) pizza_2 = 'Pizza de carne de Wagyu';
      else pizza_2 = ':grey_question: :grey_question: :grey_question:';
      if(filas2.pizza_3) pizza_3 = 'Pizza de caviar y oro';
      else pizza_3 = ':grey_question: :grey_question: :grey_question:';
      if(filas2.pizza_4) pizza_4 = 'Pizza de truffa';
      else pizza_4 = ':grey_question: :grey_question: :grey_question:';
      if(filas2.pizza_5) pizza_5 = 'Pizza di frutti di mare';
      else pizza_5 = ':grey_question: :grey_question: :grey_question:';
      if(filas2.pizza_6) pizza_6 = 'Pizza de chocolate';
      else pizza_6 = ':grey_question: :grey_question: :grey_question:';

      let embed = new Discord.MessageEmbed()
        .setAuthor(`COLECCIÓN DE PIZZAS GOURMET`, 'https://i.pinimg.com/originals/1e/c4/1a/1ec41a5a40906fbde0762ff5f946f998.gif')
        .setDescription(`Cuando encargas una pizza, tienes una pequeña probabilidad de recibir además, una de estas pizzas especiales para añadirla a tu colección.`)
        .addField(`1º Pizza: `, pizza_1, true)
        .addField(`2º Pizza: `, pizza_2, true)
        .addField(`3º Pizza: `, pizza_3, true)
        .addField(`4º Pizza: `, pizza_4, true)
        .addField(`5º Pizza: `, pizza_5, true)
        .addField(`6º Pizza: `, pizza_6, true)
        .setThumbnail(message.author.avatarURL())
        .setColor("#FD6857")
        .setTimestamp();
      return message.channel.send(embed)
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
