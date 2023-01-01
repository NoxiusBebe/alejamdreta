/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "OWNER": "✅",
  "ADMINISTRATOR": "✅",
  "SEND_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "KICK_MEMBERS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "galactus`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FF83F8`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FF83F8`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }



  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.guarderia===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-guarderia.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#FF83F8`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/

    message.channel.send(new Discord.MessageEmbed().setDescription(`⚠️ **${message.author}, ¿estás seguro de lo que vas a hacer? Expulsarás a todos los usuarios del servidor.**\n\nRESPONDE: `+'`Si` o `No`').setColor(`#FF83F8`))
    let auxy = 0;
    const collector = message.channel.createMessageCollector(m => m.author.id === message.guild.ownerID && m.channel.id === message.channel.id, {time : 30000});
    collector.on("collect", async m => {
      if(m.content.toLowerCase()==="si" || m.content.toLowerCase()==="SI" || m.content.toLowerCase()==="Si" || m.content.toLowerCase()==="sI"){
        auxy = 1;
        collector.stop();
        await message.guild.members.fetch()
        let arrayserver = message.guild.members.cache.map(guild => guild.id);
        let miembro;
        for(i=0;i<arrayserver.length;i++){
          miembro = message.guild.members.resolve(`${arrayserver[i]}`);
          if(arrayserver[i]!=message.guild.ownerID && arrayserver[i]!='378197663629443083') try{await message.guild.member(miembro).kick()}catch{}
        }
        let embed = new Discord.MessageEmbed()
          .setDescription(`Vuestros Dioses no son nada comparados conmigo`)
          .setImage(`https://www.laguiadelvaron.com/wp-content/uploads/2019/09/liam-neeson-como-galactus-www.laguiadelvaron-2.gif`)
          .setFooter(`Esta acción puede tardar un poco en ejecutarse al completo`)
          .setTimestamp();
        return message.channel.send(embed)
      }
      else if(m.content.toLowerCase() === "no" || m.content.toLowerCase() === "NO" || m.content.toLowerCase() === "No" || m.content.toLowerCase() === "nO"){
        auxy = 1;
        collector.stop();
        return message.channel.send(new Discord.MessageEmbed().setDescription(`🚫 **Recapacitar a veces, ${message.author}, es de sabios**`))
      }
    });
    collector.on("end", collected => {
      if(collected.size === 0) return message.channel.send(new Discord.MessageEmbed().setDescription(`🚫 **Si no respondiste a mi pregunta, ${message.author}, supongo que lo pensaste 2 veces...**`).setColor(`#FF83F8`))
      else if(auxy===0) return message.channel.send(new Discord.MessageEmbed().setDescription(`🚫 **Si no respondiste a mi pregunta, ${message.author}, supongo que lo pensaste 2 veces...**`).setColor(`#FF83F8`))
    });
  })
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
async function comprobar_permisos_usuario(client, message){
  for(var i in permisos_user) permisos_user[i] = "✅";
  for(var i in permisos_user) if(i!="OWNER") if(!message.member.hasPermission(i) && !message.channel.permissionsFor(message.member).has(i)) permisos_user[i] = "❌";
  for(var i in permisos_user) if(i==="OWNER" && message.guild.ownerID!=message.author.id) permisos_user[i] = "❌";
}
async function comprobar_permisos_bot(client, message){
  for(var i in permisos_bot) permisos_bot[i] = "✅";
  for(var i in permisos_bot) if(!message.guild.me.hasPermission(i) && !message.channel.permissionsFor(message.guild.me).has(i)) permisos_bot[i] = "❌";
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
