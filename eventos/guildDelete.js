/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, server) => {

  let embed_nuevo_server = new Discord.MessageEmbed()
    .setTitle(`:outbox_tray: ${server.name} :outbox_tray:`)
    .setDescription(`**Miembros:** ${server.memberCount}\n`+
    `**Dueño:** <@${server.ownerID}>\n`+
    `**Nº de Shard:** ${server.shardID}\n`+
    `**Region:** ${server.region}\n`+
    `**ID del servidor:** ${server.id}`)
    .setThumbnail(server.icon)
    .setColor(`#E93636`)
    .setTimestamp();

  // try{client.shard.broadcastEval(`this.channels.cache.get('864540821894070333').send({ embed: ${JSON.stringify(embed_nuevo_server)} });`);}catch{};

}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
