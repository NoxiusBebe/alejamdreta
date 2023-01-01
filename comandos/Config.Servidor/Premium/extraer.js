/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const backup = require("discord-backup");
backup.setStorageFolder(__dirname+"/../../../backups/");

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

let stop_extraer = new Set();

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_GUILD": "✅",
  "ADMINISTRATOR": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "ADMINISTRATOR": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "extraer [ID del backup]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#807C80`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#807C80`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en "apodos" en ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.config_servidor===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-config_servidor.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#807C80`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/

    if(stop_extraer.has(message.guild.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 1 día para hacerlo otra vez** ⛔`).setColor(`#807C80`)).then(m => m.delete({ timeout: 8000}))
    stop_extraer.add(message.guild.id);
    setTimeout(() => { stop_extraer.delete(message.guild.id); }, 86400000);

    let backupID = args[0];
    if(!backupID) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **Debes especificar la ID de tu backup**\n\n${estructura}`).setColor(`#807C80`))

    backup.fetch(backupID).then(async () => {
      message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Cuando cargue el backup; canales, roles, emojis... todo será reestablecido.**\n\nTen en cuenta que los usuarios perderán sus roles, y que solo se reestableceran los ultimos mensajes de cada canal\n\nReacciona al ✅ para confirmar la acción`).setColor(`#807C80`)).then(m => {
			m.react("✅")
			const filtro = (reaction, user) => {
        return ["✅"].includes(reaction.emoji.name) && user.id == message.author.id;
      };
      m.awaitReactions(filtro, {
        max: 1,
        time: 20000,
        errors: ["time"]
      }).catch(() => {
        m.edit(new Discord.MessageEmbed().setDescription(`:warning: **¡No he podido cargar el backup! Hay un problema con el archivo...`).setColor(`#807C80`))
      }).then(coleccionado => {
				const reaccion = coleccionado.first();
				if(reaccion.emoji.name === "✅"){
          message.author.send(new Discord.MessageEmbed().setDescription(`✅ **Se está cargando el backup...**`).setColor(`#807C80`))
          backup.load(backupID, message.guild).then(() => {
          backup.remove(backupID);
          }).catch((err) => {
            return message.author.send(new Discord.MessageEmbed().setDescription(`:x: **¡No he podido cargar el backup! Prueba a darme permisos de administrador...`).setColor(`#807C80`));
          });
        };
			})
			})
    });

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
