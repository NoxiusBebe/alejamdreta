/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

const palabras_ahorcado = require("../../../archivos/Documentos/Juegos/ahorcado.json")

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

let estado_ahorcado = {};
let vidas_ahorcado = {};

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "ahorcado`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(estado_ahorcado[message.author.id] === 1) return message.channel.send(new Discord.MessageEmbed().setDescription(`**⛔ ${message.author}, ESTÁS EN MEDIO DE UNA PARTIDA. HASTA QUE NO LA ACABES, NO PUEDES EMPEZAR OTRA**`)).then(m => m.delete({ timeout: 7000}))
    estado_ahorcado[message.author.id] = 1;
    vidas_ahorcado[message.author.id] = 5;
    let letras_usadas = [];
    let aux = 1;
    let palabra = palabras_ahorcado[Math.round(Math.random()*(palabras_ahorcado.length-1))]
    let frase = [];
    for(var i=0 ; i<palabra.length ; i++){
      if(palabra[i] === ' ') frase.push("  ")
      else frase.push("__ _____")
    }
    let dibujo6 = '```'+
    '       ➖➖➖➖➖\n'+
    '       ❕           ❕\n'+
    '       ❕           ❕\n'+
    '                   ❕\n'+
    '                   ❕\n'+
    '                   ❕\n'+
    '                   ❕\n'+
    '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜'+
    '```';
    let dibujo5 = '```'+
    '       ➖➖➖➖➖\n'+
    '       ❕           ❕\n'+
    '       ❕           ❕\n'+
    '       O           ❕\n'+
    '                   ❕\n'+
    '                   ❕\n'+
    '                   ❕\n'+
    '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜'+
    '```';
    let dibujo4 = '```'+
    '       ➖➖➖➖➖\n'+
    '       ❕           ❕\n'+
    '       ❕           ❕\n'+
    '       O           ❕\n'+
    '       ┃           ❕\n'+
    '                   ❕\n'+
    '                   ❕\n'+
    '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜'+
    '```';
    let dibujo3 = '```'+
    '       ➖➖➖➖➖\n'+
    '       ❕           ❕\n'+
    '       ❕           ❕\n'+
    '       O           ❕\n'+
    '      ╱┃           ❕\n'+
    '                   ❕\n'+
    '                   ❕\n'+
    '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜'+
    '```';
    let dibujo2 = '```'+
    '       ➖➖➖➖➖\n'+
    '       ❕           ❕\n'+
    '       ❕           ❕\n'+
    '       Ο           ❕\n'+
    '      ╱┃╲          ❕\n'+
    '                   ❕\n'+
    '                   ❕\n'+
    '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜'+
    '```';
    let dibujo1 = '```'+
    '       ➖➖➖➖➖\n'+
    '       ❕           ❕\n'+
    '       ❕           ❕\n'+
    '       O           ❕\n'+
    '      ╱┃╲          ❕\n'+
    '        ╲          ❕\n'+
    '                   ❕\n'+
    '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜'+
    '```';
    let dibujo0 = '```'+
    '       ➖➖➖➖➖\n'+
    '       ❕           ❕\n'+
    '       ❕           ❕\n'+
    '       O           ❕\n'+
    '      ╱┃╲          ❕\n'+
    '      ╱ ╲          ❕\n'+
    '                   ❕\n'+
    '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜'+
    '```';
    let embed = new Discord.MessageEmbed()
      .setTitle(`:knot: EL AHORCADO`)
      .setThumbnail(message.member.user.avatarURL())
      .setDescription(`Partida de ${message.author} || Vidas: ${vidas_ahorcado[message.author.id]}\n\n`+
        `${dibujo6}`+
        `\n\n**Palabra:** ${frase.join(" ")}\n\n**Usadas:** ${letras_usadas.join(", ")}`)
      .setColor('#B45F04')
      .setFooter("Todas las palabras son en minúsculas")
    message.channel.send(embed)
    let letra = 0;
    let caligrafia;
    let completo = 0;

    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.channel.id === message.channel.id, {time : 600000});
    collector.on("collect", async m => {
      letras_usadas.push(m.content)
      letra = 0;
      completo = 0;
      for(var i=0 ; i<palabra.length ; i++){
        completo = 0;
        if(palabra[i]===m.content){
          letra = 1;
          frase[i] = m.content
        }
        if(i===palabra.length-1 && letra===0 && palabra===m.content){
          frase = [];
          frase.push(m.content)
          if(vidas_ahorcado[message.author.id]===5) caligrafia = dibujo6;
          else if(vidas_ahorcado[message.author.id]===4) caligrafia = dibujo5;
          else if(vidas_ahorcado[message.author.id]===3) caligrafia = dibujo4;
          else if(vidas_ahorcado[message.author.id]===2) caligrafia = dibujo3;
          else if(vidas_ahorcado[message.author.id]===1) caligrafia = dibujo2;
          else if(vidas_ahorcado[message.author.id]===0) caligrafia = dibujo1;
          else caligrafia = dibujo0;
          embed = new Discord.MessageEmbed()
            .setTitle(`:knot: EL AHORCADO: VICTORIA :confetti_ball:`)
            .setThumbnail(message.member.user.avatarURL())
            .setDescription(`Partida de ${message.author} || Vidas: ${vidas_ahorcado[message.author.id]}\n\n`+
              `${caligrafia}`+
              `\n\n**Palabra:** ${frase.join(" ")}\n\n**Usadas:** ${letras_usadas.join(", ")}`)
            .setColor('#B45F04')
            .setFooter("Todas las palabras son en minúsculas")
          message.channel.send(embed)
          estado_ahorcado[message.author.id] = 0;
          aux = 0;
          collector.stop();
          aux = 0;
          return;
        }
        for(var j=0 ; j<frase.length ; j++){
          if(frase[j]==='__ _____') completo = 1;
        }
        if(completo===0){
          frase = [];
          frase.push(palabra)
          if(vidas_ahorcado[message.author.id]===5) caligrafia = dibujo6;
          else if(vidas_ahorcado[message.author.id]===4) caligrafia = dibujo5;
          else if(vidas_ahorcado[message.author.id]===3) caligrafia = dibujo4;
          else if(vidas_ahorcado[message.author.id]===2) caligrafia = dibujo3;
          else if(vidas_ahorcado[message.author.id]===1) caligrafia = dibujo2;
          else if(vidas_ahorcado[message.author.id]===0) caligrafia = dibujo1;
          else caligrafia = dibujo0;
          embed = new Discord.MessageEmbed()
            .setTitle(`:knot: EL AHORCADO: VICTORIA :confetti_ball:`)
            .setThumbnail(message.member.user.avatarURL())
            .setDescription(`Partida de ${message.author} || Vidas: ${vidas_ahorcado[message.author.id]}\n\n`+
              `${caligrafia}`+
              `\n\n**Palabra:** ${frase.join(" ")}\n\n**Usadas:** ${letras_usadas.join(", ")}`)
            .setColor('#B45F04')
            .setFooter("Todas las palabras son en minúsculas")
          message.channel.send(embed)
          estado_ahorcado[message.author.id] = 0;
          aux = 0;
          collector.stop();
          aux = 0;
          return;
        }
      }
      if(letra===1) vidas_ahorcado[message.author.id] = vidas_ahorcado[message.author.id]+1;
      vidas_ahorcado[message.author.id] = vidas_ahorcado[message.author.id]-1;
      if(vidas_ahorcado[message.author.id]===5) caligrafia = dibujo6;
      else if(vidas_ahorcado[message.author.id]===4) caligrafia = dibujo5;
      else if(vidas_ahorcado[message.author.id]===3) caligrafia = dibujo4;
      else if(vidas_ahorcado[message.author.id]===2) caligrafia = dibujo3;
      else if(vidas_ahorcado[message.author.id]===1) caligrafia = dibujo2;
      else if(vidas_ahorcado[message.author.id]===0) caligrafia = dibujo1;
      else caligrafia = dibujo0;
      if(vidas_ahorcado[message.author.id]<0){
        embed = new Discord.MessageEmbed()
          .setTitle(`:knot: EL AHORCADO: DERROTA :slight_frown:`)
          .setThumbnail(message.member.user.avatarURL())
          .setDescription(`Partida de ${message.author} || Vidas: :skull:\n\n`+
            `${caligrafia}`+
            `\n\n**Palabra:** ${palabra}\n\n**Usadas:** ${letras_usadas.join(", ")}`)
          .setColor('#B45F04')
          .setFooter("Todas las palabras son en minúsculas")
        message.channel.send(embed)
        estado_ahorcado[message.author.id] = 0;
        aux = 0;
        collector.stop();
        aux = 0;
        return;
      }
      else{
        embed = new Discord.MessageEmbed()
          .setTitle(`:knot: EL AHORCADO`)
          .setThumbnail(message.member.user.avatarURL())
          .setDescription(`Partida de ${message.author} || Vidas: ${vidas_ahorcado[message.author.id]}\n\n`+
            `${caligrafia}`+
            `\n\n**Palabra:** ${frase.join(" ")}\n\n**Usadas:** ${letras_usadas.join(", ")}`)
          .setColor('#B45F04')
          .setFooter("Todas las palabras son en minúsculas")
        message.channel.send(embed)
      }
    });
    collector.on("end", async collected => {
      if(collected.size === 0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **YA QUE NO RESPONDES ${message.author}, VOY A SUPONER QUE ABANDONASTE LA PARTIDA. FIN DEL JUEGO.**`))
      if(aux === 1){
        estado_ahorcado[message.author.id] = 0;
        return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **HA PASADO DEMASIADO TIEMPO ${message.author}, VOY A TENER QUE CANCELAR LA PARTIDA. FIN DEL JUEGO**`))
      }
      return collector.stop();
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
