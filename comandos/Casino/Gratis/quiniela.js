/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_cartera = new sqlite3.Database("./memoria/db_cartera.sqlite");

let direccion = "./archivos/Imagenes/Casino";
let equipos = require("../../../archivos/Documentos/Casino/equipos.json")

let ludopatia_futbol = new Set();

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "quiniela [elegir: 1, X, 2]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#95F5FC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#95F5FC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  if(ludopatia_futbol.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 3 minutos** ⛔`).setColor(`#95F5FC`)).then(m => m.delete({ timeout: 6000}))

  var tier_equipo_1 = Math.round(Math.random()*(2));
  var tier_equipo_2 = Math.round(Math.random()*(2));

  var equipo_1 = equipos[tier_equipo_1+1][Math.round(Math.random()*(equipos[tier_equipo_1+1].length-1))];
  var equipo_2;

  do{equipo_2 = equipos[tier_equipo_2+1][Math.round(Math.random()*(equipos[tier_equipo_2+1].length-1))]}while(equipo_1===equipo_2)

  var ganancias_1;
  var ganancias_2;

  if(tier_equipo_1===2 && tier_equipo_2===2) ganancias_1 = 1, ganancias_2 = 1;
  if(tier_equipo_1===2 && tier_equipo_2===1) ganancias_1 = 3, ganancias_2 = 1;
  if(tier_equipo_1===2 && tier_equipo_2===0) ganancias_1 = 5, ganancias_2 = 1;

  if(tier_equipo_1===1 && tier_equipo_2===2) ganancias_1 = 2, ganancias_2 = 6;
  if(tier_equipo_1===1 && tier_equipo_2===1) ganancias_1 = 2, ganancias_2 = 2;
  if(tier_equipo_1===1 && tier_equipo_2===0) ganancias_1 = 6, ganancias_2 = 2;

  if(tier_equipo_1===0 && tier_equipo_2===2) ganancias_1 = 3, ganancias_2 = 15;
  if(tier_equipo_1===0 && tier_equipo_2===1) ganancias_1 = 3, ganancias_2 = 9;
  if(tier_equipo_1===0 && tier_equipo_2===0) ganancias_1 = 3, ganancias_2 = 3;

  var ganador = Math.round(Math.random()*2);
  let nombre_ganador;

  if(ganador===0) ganador = '1', nombre_ganador = equipo_1;
  else if(ganador===1) ganador = 'X', nombre_ganador = 'Nadie. Empeataron ambos equipos.';
  else ganador = '2', nombre_ganador = equipo_2;

  let frase_1 = [];
  let frase_2 = [];

  let respuesta = 0;

  for(var i=0 ; i<25 ; i++){
    if(equipo_1[i]) frase_1[i] = equipo_1[i]
    else frase_1[i] = ' ';
  }
  for(var i=24 ; i>=0 ; i--){
    if(equipo_2[equipo_2.length-1-24+i]) frase_2[i] = equipo_2[equipo_2.length-1-24+i]
    else frase_2[i] = ' ';
  }

  message.channel.send(new Discord.MessageEmbed().setDescription(`:trophy: **EL PARTIDAZO HA LLEGADO HASTA DISCORD. ¿POR QUIÉN APUESTAS?** :trophy:\n`+
                                                                 '```js\n'+
                                                                 `${frase_1.join("")}  VS       ${frase_2.join("")}\n`+
                                                                 `1: x${ganancias_1}                      X: x${(ganancias_1+ganancias_2)/2}                        2: x${ganancias_2}\n`+
                                                                 '```\n').setColor(`#95F5FC`))
  const collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.channel.id === message.channel.id, {time : 50000});
  collector.on("collect", m => {
    if(m.content==="1" || m.content==="X" || m.content==="2"){
      respuesta = 1;
      let multiplicador;
      if(m.content.toLowerCase()==="1") multiplicador = ganancias_1;
      else if(m.content.toLowerCase()==="2") multiplicador = ganancias_2;
      else multiplicador = (ganancias_1+ganancias_2)/2;

      ludopatia_futbol.add(message.author.id);
      setTimeout(() => { ludopatia_futbol.delete(message.author.id); }, 180000);

      message.channel.send(new Discord.MessageEmbed().setAuthor(`SE ESTÁ DISPUTANDO EL PARTIDO...`, `https://cdn.discordapp.com/attachments/823263020246761523/850821926536347648/futbol.gif`).setColor(`#95F5FC`))
      setTimeout(() => {
        if(m.content===ganador){
          let embed = new Discord.MessageEmbed()
            .setDescription(`:soccer: **EL GANADOR FUE:** ${nombre_ganador}\n\n\n:confetti_ball: ¡ENHORABUENA! HAS GANADO **${50*multiplicador}** MONEDAS`)
            .setColor('#26BE26')
            .setThumbnail(message.member.user.avatarURL())
            .setTimestamp();
          message.channel.send(embed)

          db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "quiniela" => ${message.content}`)
            let sentencia;
            if(!filas) sentencia = `INSERT INTO usuarios(id, monedas) VALUES('${message.author.id}', ${50*multiplicador})`;
            else sentencia = `UPDATE usuarios SET monedas = ${filas.monedas+(50*multiplicador)} WHERE id = ${message.author.id}`;
            db_cartera.run(sentencia, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "quiniela" => ${message.content}`)
            })
          })
        }
        else{
          let embed = new Discord.MessageEmbed()
            .setDescription(`:soccer: **EL GANADOR FUE:** ${nombre_ganador}\n\n\n:frowning2: Vaya, no hubo suerte....`)
            .setColor('#26BE26')
            .setThumbnail(message.member.user.avatarURL())
            .setTimestamp();
          message.channel.send(embed)
        }
      }, 3000);
      collector.stop();
    }
    else message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **Creo que no tienes muy claro cómo apostar**\n\n${estructura}`).setColor(`#95F5FC`))
  })
  collector.on("end", collected => {
    if (collected.size===0 || respuesta===0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:bellhop: **El partido terminó sin que apostaras por nadie.**\n\n${estructura}`))
  });
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
