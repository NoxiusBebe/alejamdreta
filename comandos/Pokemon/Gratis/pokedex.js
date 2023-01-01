/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_pokemon = new sqlite3.Database("./memoria/db_pokemon.sqlite");

const pokemon_lleno = require("../../../archivos/Documentos/Pokemon/pokemon.json")

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "pokedex`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  db_pokemon.all(`SELECT * FROM '${message.author.id}'`, async (err, filas) => {
    if(!filas || filas.length<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`**AUN NO HAS CAPTURADO NINGÚN POKEMON**\n\nTu Pokedex está vacía`).setThumbnail(`https://webstockreview.net/images/pokeball-clipart-open-drawing-2.png`).setColor(`#FF3737`))
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 mostrando pokedex`)
    db_pokemon.run(`UPDATE '${message.author.id}' SET pagina = 1`, async function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 mostrando pokedex`)
      let pokemon = [];
      for(var i=1 ; i<25 ; i++){
        if(filas.length===0) pokemon.push(`:x: - - -`)
        for(var j=0 ; j<filas.length ; j++){
          if(filas[j].numero === i){
            pokemon.push(`:white_check_mark: ` + filas[j].pokemon)
            break;
          }
          if(j===filas.length-1) pokemon.push(`:x: - - -`)
        }
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`:red_circle: TU POKEDEX (${filas.length}/${pokemon_lleno.length}) :yellow_circle:`)
        .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/780106754141978644/Pokedex_Gif_Transparente.gif`)
        .addField(`Nº1`, pokemon[0], true)
        .addField(`Nº2`, pokemon[1], true)
        .addField(`Nº3`, pokemon[2], true)
        .addField(`Nº4`, pokemon[3], true)
        .addField(`Nº5`, pokemon[4], true)
        .addField(`Nº6`, pokemon[5], true)
        .addField(`Nº7`, pokemon[6], true)
        .addField(`Nº8`, pokemon[7], true)
        .addField(`Nº9`, pokemon[8], true)
        .addField(`Nº10`, pokemon[9], true)
        .addField(`Nº11`, pokemon[10], true)
        .addField(`Nº12`, pokemon[11], true)
        .addField(`Nº13`, pokemon[12], true)
        .addField(`Nº14`, pokemon[13], true)
        .addField(`Nº15`, pokemon[14], true)
        .addField(`Nº16`, pokemon[15], true)
        .addField(`Nº17`, pokemon[16], true)
        .addField(`Nº18`, pokemon[17], true)
        .addField(`Nº19`, pokemon[18], true)
        .addField(`Nº20`, pokemon[19], true)
        .addField(`Nº21`, pokemon[20], true)
        .addField(`Nº22`, pokemon[21], true)
        .addField(`Nº23`, pokemon[22], true)
        .addField(`Nº24`, pokemon[23], true)
        .setColor(`#FF3737`)
        .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág 1/38`)
      let mensaje = await message.channel.send(embed).then(m => {
        m.react("⏮️");
        setTimeout(function() {
          m.react("⏪");
        }, 400);
        setTimeout(function() {
          m.react("⏩");
        }, 800);
        setTimeout(function() {
          m.react("⏭️");
        }, 1200);
        db_pokemon.run(`UPDATE '${message.author.id}' SET mensaje = ${m.id}`, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #4 mostrando pokedex`)
        });
      });
    });
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
