/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MANAGE_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "MANAGE_MESSAGES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "limpiar [número de mensajes]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FF3D5E`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FF3D5E`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  if(!args[0]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¿Cuántos mensajes quieres que elimine?**\n\n${estructura}`).setColor(`#FF3D5E`))
  if(isNaN(args[0])) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¡La cantidad de mensajes tan solo puede ser un número!**\n\n${estructura}`).setColor(`#FF3D5E`))
  var number = parseInt(args[0]);

  if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

  message.channel.send(":arrows_counterclockwise: ** *Así limpiaaaaba así así; así limpiaaaaba así así ...* ** :microphone: ")
  let repeticion = setInterval(async function() {
    if(number>90){
      message.channel.bulkDelete(90).catch(error => {
        clearInterval(repeticion)
        return message.channel.send(`:triumph: Parece que hay un problema con algunos mensajes. Los mensajes que tienen mas de 14 días de antigüedad no puedo borrarlos. Échale la culpa a quien creó Discord.`).then(m => m.delete({ timeout: 20000}))
      })
      number = number - 90
    }
    else{
      clearInterval(repeticion)
      message.channel.bulkDelete(number+1).then( () => {
        number = -5;
        var precio = Math.round(Math.random()*100-20)+20
        message.channel.send(new Discord.MessageEmbed().setDescription(`:sunglasses: **Terminé de hacer limpieza. Son ${precio} euros. Gracias** :broom:`).setColor(`#FF3D5E`)).then(m => m.delete({ timeout: 10000}))
        clearInterval(repeticion)
        db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "limpiar" => ${message.content}`)
          if(filas && filas.logs){
            let canal = await client.channels.resolve(filas.logs)
            let embed = new Discord.MessageEmbed()
              .setTitle(":broom: **LIMPIEZA DE MENSAJES**")
              .setDescription("**Mensajes eliminados:** `"+args[0]+"`")
              .setThumbnail(message.member.user.displayAvatarURL())
              .setColor("#74DC82")
              .addField(`:busts_in_silhouette: Autor: `, message.author, true)
              .addField(`:hash: Tag: `, message.author.tag, true)
              .addField(`:computer: Canal: `, `<#${message.channel.id}>`, true)
              .setTimestamp();
            try{return canal.send(embed);}catch(err){};
          }
        })
      }).catch(error => {
        clearInterval(repeticion)
        return message.channel.send(`:triumph: Parece que hay un problema con algunos mensajes. Los mensajes que tienen mas de 14 días de antigüedad no puedo borrarlos. Échale la culpa a quien creó Discord.`).then(m => m.delete({ timeout: 20000}))
      })
    }
  }, 4000)
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
