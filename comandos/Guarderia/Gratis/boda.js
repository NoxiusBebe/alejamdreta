/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_matrimonios = new sqlite3.Database("./memoria/db_matrimonios.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "boda [@usuario]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let usuario = message.mentions.users.first() || client.users.resolve(args[0]);
  if(!usuario) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **¿Con quién quieres casarte?**\n\n${estructura}`).setColor(`#FF83F8`))
  if(message.mentions.users.first().bot) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **No puedes casarte con un bot, eso es botfilia**\n\n${estructura}`).setColor(`#FF83F8`))
  if(message.author.id === usuario.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **Se que estar solo es un palo, pero casarte contigo mismo, no hace que des menos vergüenza ( consejito de colegas :) )**\n\n${estructura}`).setColor(`#FF83F8`))
  db_matrimonios.get(`SELECT * FROM parejas WHERE pareja1 = '${message.author.id}'`, (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "boda" => ${message.content}`)
    if(filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: ${message.author}, ¿olvidas que ya te casaste con <@${filas.pareja2}>? A ver si nos dejamos el poliamor para las telenovelas turcas :unamused:`).setColor(`#FF83F8`))
    else{
      message.channel.send(new Discord.MessageEmbed().setDescription(`:ring: **${usuario}, ¿aceptas ser la legítima pareja de ${message.author}?**\n\nRESPONDE: `+'`Si` o `No`').setColor(`#FF83F8`))
      const collector = message.channel.createMessageCollector(m => m.author.id === usuario.id && m.channel.id === message.channel.id, {time : 50000});
      collector.on("collect", m => {
        if(m.content.toLowerCase()==="si" || m.content.toLowerCase()==="SI" || m.content.toLowerCase()==="Si"){
          let Canalvoz = message.guild.member(message.author.id).voice.channel;
          let Canalvoz2 = message.guild.member(usuario.id).voice.channel;
          if(Canalvoz){
            Canalvoz.join().then(async connection => {
            const dispatcher = await connection.play(`./archivos/Pistas/Matrimonio/boda.mp3`, { //
              volume: 2
            });
          }).catch(err => console.log(`FALLO CON AUDIO DE BODA`))
            setTimeout(function() {
              Canalvoz.leave();
            }, 31000);
          }
          else if(Canalvoz2){
            Canalvoz2.join().then(async connection => {
            const dispatcher = await connection.play(`./archivos/Pistas/Matrimonio/boda.mp3`, { //
              volume: 2
            });
          }).catch(err => console.log(`FALLO CON AUDIO DE BODA`))
            setTimeout(function() {
              Canalvoz2.leave();
            }, 31000);
          }
          db_matrimonios.get(`SELECT * FROM parejas WHERE pareja1 = '${usuario.id}'`, (err, filas2) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "boda" => ${message.content}`)
            if(filas2){
              collector.stop();
              return m.channel.send(new Discord.MessageEmbed().setDescription(`:eyes: **${usuario}, ya tienes pareja.**\n\n¿No sería injusto para ${message.author} que andaras en secreto con alguien más?`).setColor(`#FF83F8`))
            }
            else{
              m.channel.send(new Discord.MessageEmbed().setDescription(`:confetti_ball: **¡YA TENEMOS UNA NUEVA PAREJA A LA QUE FELICITAR** :confetti_ball:`).setColor(`#FF83F8`));
              db_matrimonios.run(`INSERT INTO parejas(pareja1, pareja2) VALUES('${message.author.id}', '${usuario.id}')`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "boda" => ${message.content}`)
              })
              db_matrimonios.run(`INSERT INTO parejas(pareja1, pareja2) VALUES('${usuario.id}', '${message.author.id}')`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #4 comando "boda" => ${message.content}`)
              })
              collector.stop();
            }
          });
        }
        else if(m.content.toLowerCase() === "no" || m.content.toLowerCase() === "NO" || m.content.toLowerCase() === "No"){
          m.channel.send(new Discord.MessageEmbed().setDescription(`:no_mouth: **${message.author}, se ve que ${usuario} no te queria tanto como tu crees**`).setColor(`#FF83F8`))
          collector.stop();
        }
      });
      collector.on("end", collected => {
        if (collected.size === 0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:flushed: **Lo siento ${message.author}, pero sin un "si", aquí ni hay boda ni nada...**`))
      });
    }
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
