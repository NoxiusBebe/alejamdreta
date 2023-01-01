/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const GhostPing = require('discord.js-ghost-ping')

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, oldMessage, newMessage) => {
  if(!oldMessage.guild.me.hasPermission("SEND_MESSAGES")) return;
  if(oldMessage.author.bot || newMessage.author.bot) return;
  if(!oldMessage || !newMessage) return;

  db_canales.get(`SELECT * FROM servidores WHERE id = ${newMessage.guild.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ERROR #1 en la funcion de actualizaciones de mensajes`)
    if(!filas) return;
    if(filas.logs){
      let canal = await client.channels.resolve(filas.logs)
      let embed = new Discord.MessageEmbed()
        .setTitle(":pencil: **HAN EDITADO UN MENSAJE**")
        .setDescription(`**Mensaje antiguo**: ${oldMessage.content}\n**Mensaje nuevo**: ${newMessage.content}`)
        .addField(`:busts_in_silhouette: Usuario: `, newMessage.member, true)
        .addField(`:hash: Tag: `, newMessage.member.user.username+'#'+newMessage.member.user.discriminator, true)
        .addField(`:computer: Canal: `, `<#${newMessage.channel.id}>`, true)
        .setThumbnail(newMessage.member.user.displayAvatarURL())
        .setColor("#FAAA5A")
        .setTimestamp();
      try{canal.send(embed);}catch(err){};
      GhostPing.detector('messageUpdate', oldMessage, newMessage, {send_channel: filas.logs})
    }
 });
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
