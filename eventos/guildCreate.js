/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, server) => {
  try{await server.members.fetch()}catch{}

  client.config.prefijos[server.id] = "!";

  let embed_bienvenida = new Discord.MessageEmbed()
    .setTitle(`:cherry_blossom: ¡ENCANTADA DE CONOCERTE!`)
    .setDescription(`Si has recibido este mensaje, es porque ahora formo parte de tu comunidad: **${server.name}**\n\n`+
    `Solo quiero que sepas que seré el mejor bot posible dentro de tu comunidad, e intentaré serte de utilidad, no solo como herramienta, sino como tu waifu rebelde favorita :kissing_closed_eyes:\n\n`+
    `El comando para ver todo lo que hago es **${client.config.prefijos[server.id]}ayuda**. Ahora solo te queda ver por ti mismo, todo lo que puedo hacer.\n\n`+
    `Cualquier duda o problema, te será atendida en mi servidor soporte por el equipo de staff: https://discord.gg/Hx8CZnURed`)
    .setColor(`#4878EC`)

  let embed_alerta = new Discord.MessageEmbed()
    .setDescription(`:warning: __**ADVERTENCIA**__ :warning:\n\n`+
    `Soy **Alejandreta**, el bot que acaba de ser ingresado en el servidor **${server.name}**.\n\n`+
    `Quiero avisarte de que en tu servidor, se encuentra mi versión antigua. Dicha versión, está ahora en posesión de otro usuario, que junto a un grupo de estafadores, robaron la cuenta de mi creador, y se adueñaron de todos sus bots (incluida mi antigua versión).\n\n`+
    `Por favor, expulsa a ese bot de tu servidor lo antes posible.\n\n`+
    `Si quieres saber más, te dejo el link del video a Youtube que mi creador publicó, alertando de lo ocurrido: https://www.youtube.com/watch?v=SILrD61I3uU`)
    .setColor('#EC4848')

  try{await server.owner.send(embed_bienvenida)}catch{}

  if(server.members.cache.has('521293375895371776')) try{await server.owner.send(embed_alerta)}catch{}

  if(server.me.hasPermission("MANAGE_GUILD")) server.fetchInvites().then(async guildInvites => { client.config.invites_servidores[server.id] = guildInvites });
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
