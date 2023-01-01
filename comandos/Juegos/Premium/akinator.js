/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

const { Aki } = require('aki-api');
const region = 'es';
const aki = new Aki(region);
const mech_aki = require('mech-aki');
const akinator = new mech_aki('es');

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"

}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "ADD_REACTIONS": "✅",
  "MANAGE_MESSAGES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "akinator`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    const msg = await message.channel.send(new Discord.MessageEmbed().setAuthor(`Akinator está saliendo de su lampara...`, 'https://cdn.discordapp.com/attachments/523268901719769088/783533812248215612/unname333d.gif'))

    let pregunta = await akinator.empezar();
    let embed = new Discord.MessageEmbed()
      .setTitle(`:genie: TU ADIVINO AKINATOR HA LLEGADO`)
      .setThumbnail(message.author.avatarURL())
      .setColor("#2E64FE")
      .setDescription(`**${pregunta.pregunta}**`)
      .addField("Si", "👍", true)
      .addField("No", "👎", true)
      .addField("No lo se", "💭", true)
      .addField("Puede que si", "🤞", true)
      .addField("Puede que no", "👋", true)
      .addField("Atrás", "⏮️", true);
    var respuestas = new Map([
      ["👍", 0],
      ["👎", 1],
      ["💭", 2],
      ["🤞", 3],
      ["👋", 4],
      ['⏮️', -9],
    ]);
    var respuestasxd = ["👍", "👎", "💭", "🤞", "👋", "⏮️"];
    let intentos = 0;
    if(msg) msg.edit(embed);
    for(let index = 0; index < respuestasxd.length; index++) await msg.react(respuestasxd[index]);	while (akinator.progreso < 90) {
      const respuesta = await new Promise((resolve, reject) => {
        const collector = msg.createReactionCollector((reaction, user) => !user.bot && user.id === message.author.id &&
              reaction.message.channel.id === msg.channel.id, { time: 120000 });
        collector.on('collect', r => {
          resolve(r.emoji.name);
          r.users.remove(message.author);
          intentos++;
          collector.stop();
        });
        collector.on('end', () => resolve(null));
      });
      if (!respuesta) return msg.delete();
      const respuesta_num = respuestas.get(respuesta);
      pregunta = respuesta_num != -9
        ? await akinator.siguiente(respuesta_num)
        : await akinator.atras();
        embed = new Discord.MessageEmbed()
          .setTitle(`:genie: TU ADIVINO AKINATOR HA LLEGADO`)
          .setColor("#2E64FE")
          .setThumbnail(message.author.avatarURL())
          .setDescription(`**${pregunta.pregunta}**`)
          .addField("Si", "👍", true)
          .addField("No", "👎", true)
          .addField("No lo se", "💭", true)
          .addField("Puede que si", "🤞", true)
          .addField("Puede que no", "👋", true)
          .addField("Atrás", "⏮️", true);
        if(msg) await msg.edit(embed);
      }
      const personajes = await akinator.respuestas();
      embed = new Discord.MessageEmbed()
        .setTitle(`:genie: TU ADIVINO AKINATOR HA LEIDO TUS PENSAMIENTOS...`)
        .setColor("#2E64FE")
        .setThumbnail(message.author.avatarURL())
        .setDescription(`👤 Tu personaje es: **${personajes[0].nombre}**\n:arrows_counterclockwise: Numero de intentos: `+'`'+intentos+'`'+`\n\n${personajes[0].descripcion}`)
        .setImage(personajes[0].foto);
      msg.delete();
      return message.channel.send(embed);
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
