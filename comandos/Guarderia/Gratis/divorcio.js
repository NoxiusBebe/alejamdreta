/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_matrimonios = new sqlite3.Database("./memoria/db_matrimonios.sqlite");

let divorciarse = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "divorcio`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  if(divorciarse.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 1 día para pedir el divorcio de nuevo** ⛔`).setColor(`#FF83F8`)).then(m => m.delete({ timeout: 8000}))
  divorciarse.add(message.author.id);
  setTimeout(() => { divorciarse.delete(message.author.id); }, 86400000);

  db_matrimonios.get(`SELECT * FROM parejas WHERE pareja1 = '${message.author.id}'`, (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "divorcio" => ${message.content}`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(':joy: **Siento ser yo la que te lo diga, pero para divorciarte, primero necesitas tener a alguien**').setColor(`#FF83F8`))
    else{
      message.channel.send(new Discord.MessageEmbed().setDescription(`:bookmark_tabs: **<@${filas.pareja2}>, tu actual pareja ${message.author} te acaba de pedir el divorcio**\n\nRESPONDE: `+'`Si` o `No`').setColor(`#FF83F8`))
      const collector = message.channel.createMessageCollector(m => m.author.id === filas.pareja2 && m.channel.id === message.channel.id, {time : 50000});
      collector.on("collect", m => {
        if(m.content.toLowerCase()==="si" || m.content.toLowerCase()==="SI" || m.content.toLowerCase()==="Si" || m.content.toLowerCase()==="sI"){
          let Canalvoz = message.guild.member(message.author.id).voice.channel;
          let Canalvoz2 = message.guild.member(filas.pareja2).voice.channel;
          if(Canalvoz){
            Canalvoz.join().then(async connection => {
            const dispatcher = await connection.play(`./archivos/Pistas/Matrimonio/divorcio.mp3`, { //
              volume: 2
            });
          }).catch(err => console.log(`FALLO CON AUDIO DE DIVORCIO`))
            setTimeout(function() {
              Canalvoz.leave();
            }, 20000);
          }
          else if(Canalvoz2){
            Canalvoz2.join().then(async connection => {
            const dispatcher = await connection.play(`./archivos/Pistas/Matrimonio/divorcio.mp3`, { //
              volume: 2
            });
          }).catch(err => console.log(`FALLO CON AUDIO DE DIVORCIO`))
            setTimeout(function() {
              Canalvoz2.leave();
            }, 20000);
          }
          m.channel.send(new Discord.MessageEmbed().setDescription(`:confetti_ball: **FELIZ DIVORCIO A AMBOS** :confetti_ball:`).setColor(`#FF83F8`));
          db_matrimonios.run(`DELETE FROM parejas WHERE pareja1 = '${filas.pareja2}'`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "divorcio" => ${message.content}`)
          })
          db_matrimonios.run(`DELETE FROM parejas WHERE pareja1 = '${message.author.id}'`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "divorcio" => ${message.content}`)
          })
          collector.stop();
        }
        else if(m.content.toLowerCase() === "no" || m.content.toLowerCase() === "NO" || m.content.toLowerCase() === "No" || m.content.toLowerCase()==="nO"){
          m.channel.send(new Discord.MessageEmbed().setDescription(`:heart: **Vaya ${message.author}, parece que <@${filas.pareja2}> te quiere demasiado como para dejarte escapar**`).setColor(`#FF83F8`))
          collector.stop();
        }
      });
      collector.on("end", collected => {
        if(collected.size === 0){
          db_matrimonios.run(`DELETE FROM parejas WHERE pareja1 = '${filas.pareja2}'`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #4 comando "divorcio" => ${message.content}`)
          })
          db_matrimonios.run(`DELETE FROM parejas WHERE pareja1 = '${message.author.id}'`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #5 comando "divorcio" => ${message.content}`)
          })
          let Canalvoz = message.guild.member(message.author.id).voice.channel;
          if(Canalvoz){
            Canalvoz.join().then(async connection => {
            const dispatcher = await connection.play(`./archivos/Pistas/Matrimonio/divorcio.mp3`, { //
              volume: 2
            });
          }).catch(err => console.log(`FALLO CON AUDIO DE DIVORCIO`))
            setTimeout(function() {
              Canalvoz.leave();
            }, 20000);
          }
          return message.channel.send(new Discord.MessageEmbed().setDescription(`:bookmark_tabs: **Relájate ${message.author}, como no responde, hagamos como si hubiese dicho que si, y listo** :ok_hand:**`).setColor(`#FF83F8`))
        }
      });
    }
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
