/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_pokemon = new sqlite3.Database("./memoria/db_pokemon.sqlite");

const pokemon_lleno = require("../../../archivos/Documentos/Pokemon/pokemon.json")

let espera_pokemon = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "capturar`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FF3737`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FF3737`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  if(espera_pokemon.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 5 segundos** ⛔`).setColor(`#FF3737`)).then(m => m.delete({ timeout: 4000}))
  espera_pokemon.add(message.author.id);
  setTimeout(() => {espera_pokemon.delete(message.author.id);}, 5000);

  db_pokemon.run(`CREATE TABLE IF NOT EXISTS '${message.author.id}' (numero INTEGER, pokemon TEXT, imagen TEXT, mensaje TEXT, pagina INTEGER)`, async function(err) {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 capturando pokemon`)
    let suerte = Math.round(Math.random()*6);
    if(suerte>=0 && suerte<4){
      message.channel.send(new Discord.MessageEmbed()
        .setDescription(`:hot_face: ${message.author}: lo intentaste, pero en eso se quedó, en un intento...`)
        .attachFiles([new MessageAttachment(`./archivos/Imagenes/Pokemon/${suerte}.gif`, `suerte.gif`)])
        .setImage(`attachment://suerte.gif`)
        .setColor(`#FF3737`))
    }
    else{
      let captura = Math.floor(Math.random()*(pokemon_lleno.length));
      let nombre = pokemon_lleno[captura];
      if(captura>=0 && captura<=8) imagen = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${captura+1}.png`;
      if(captura>=9 && captura<=98) imagen = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${captura+1}.png`;
      if(captura>=99) imagen = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${captura+1}.png`;
      db_pokemon.get(`SELECT * FROM '${message.author.id}' WHERE numero = ${captura+1}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 capturando pokemon`)
        if(!filas){
          db_pokemon.run(`INSERT INTO '${message.author.id}'(numero, pokemon, imagen) VALUES(${captura+1}, '${nombre}', '${imagen}')`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 capturando pokemon`)
            let embed = new Discord.MessageEmbed()
              .setDescription(`:scream: **¡QUÉ SUERTE! HAS CAPTURADO UN POKEMON NUEVO**\n\nPokemon: ${nombre}`)
              .setColor(`#FF3737`)
              .setThumbnail(message.member.user.avatarURL())
              .setImage(imagen)
              .setTimestamp();
            return message.channel.send(embed)
          })
        }
        else{
          let embed = new Discord.MessageEmbed()
            .setDescription(`:pensive: **¡LÁSTIMA! HAS VUELTO A CAPTURAR UN POKEMON REPETIDO**\n\nPokemon: ${nombre}`)
            .setColor(`#FF3737`)
            .setThumbnail(message.member.user.avatarURL())
            .setImage(imagen)
            .setTimestamp();
          return message.channel.send(embed)
        }
      })
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
