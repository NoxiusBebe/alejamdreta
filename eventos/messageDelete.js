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
module.exports = async (client, message) => {
  if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
  if(message.author.id === client.config.id) return;
  if(message.content.startsWith(`${client.config.prefijos[message.guild.id]}confesar`)) return;

  db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ERROR #1 en la funcion de mensajes eliminados`)
    if(!filas) return;
    if(filas.logs){
      let canal = await client.channels.resolve(filas.logs)
      let embed = new Discord.MessageEmbed()
        .setTitle(":scissors: **HAN ELIMINADO UN MENSAJE**")
        .setDescription(`**Mensaje eliminado**: ${message}`)
        .addField(`:busts_in_silhouette: Autor: `, message.author, true)
        .addField(`:hash: Tag: `, message.author.tag, true)
        .addField(`:computer: Canal: `, `<#${message.channel.id}>`, true)
        .setThumbnail(message.author.avatarURL())
        .setColor("#FAF883")
        .setTimestamp();
      try{canal.send(embed);}catch(err){};
      GhostPing.detector("messageDelete", message, {send_channel: filas.logs})
    }
  });
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
