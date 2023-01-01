/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message) => {
  if(message.channel.type === "dm") return;

  // --------------------------------------------------------------------------------------------------

  let embed_usuario_bloqueado = new Discord.MessageEmbed().setTitle("⛔ __**Estás bloqueado**__ 🔒").setDescription(`Te informo de que estás presente en la lista negra de usuarios, y por lo tanto, no puedes usar mis comandos.\n\nMotivo: `+"`"+client.config.usuarios_bloqueados[message.author.id]+"`").setColor("#380000")
  let embed_servidor_bloqueado = new Discord.MessageEmbed().setTitle("🔒 __**Servidor bloqueado**__ ⛔").setDescription(`Te informo de que este servidor está presente en la lista negra de servidores, y por lo tanto, no se pueden usar mis comandos aquí.\n\nMotivo: `+"`"+client.config.servidores_bloqueados[message.guild.id]+"`").setColor("#380000")

  if(!message.content.startsWith(client.config.prefijos[message.guild.id])) return;

  if(!client.config.prefijos[message.guild.id]) client.config.prefijos[message.guild.id] = client.config.prefijo;

  const args = message.content.slice(client.config.prefijos[message.guild.id].length).trim().split(/ +/g);
  const command = args.shift().toLowerCase()

  let cmd = client.comandos.get(command);
  if(!cmd) return;
  if(!message.guild.me.hasPermission("SEND_MESSAGES") && !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

  if(client.config.usuarios_bloqueados[message.author.id] != null) return message.channel.send(embed_usuario_bloqueado);
  if(client.config.servidores_bloqueados[message.guild.id] != null) return message.channel.send(embed_servidor_bloqueado);

  console.log(message.content + " --- " + message.author.id)

  cmd(client, message, args);
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
