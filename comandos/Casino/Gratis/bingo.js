/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_cartera = new sqlite3.Database("./memoria/db_cartera.sqlite");

let direccion = "../../../archivos/Imagenes/Casino";

let ludopatia_bingo = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "bingo`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  if(ludopatia_bingo.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 2 minutos** ⛔`).setColor(`#95F5FC`)).then(m => m.delete({ timeout: 6000}))
  ludopatia_bingo.add(message.author.id);
  setTimeout(() => { ludopatia_bingo.delete(message.author.id); }, 120000);

  let fila_1 = ["-", "-", "-", "-", "-", "-", "-", "-", "-"]
  let fila_2 = ["-", "-", "-", "-", "-", "-", "-", "-", "-"]
  let fila_3 = ["-", "-", "-", "-", "-", "-", "-", "-", "-"]

  let numero;

  for(var i=0 ; i<4 ; i++){
    do{numero = Math.round(Math.random()*8)}while(fila_1[numero]==='🌐')
    fila_1[numero]='🌐';
    do{numero = Math.round(Math.random()*8)}while(fila_2[numero]==='🌐')
    fila_2[numero]='🌐';
    do{numero = Math.round(Math.random()*8)}while(fila_3[numero]==='🌐')
    fila_3[numero]='🌐';
  }

  let maximo;
  let minimo;
  for(var i=0 ; i<9 ; i++){
    maximo = ((i+1)*10)-1;
    minimo = (i*10)

    numero = Math.round(Math.random()*((maximo-6)-minimo))+minimo
    if(fila_1[i]==="-") fila_1[i] = numero;
    numero = Math.round(Math.random()*((maximo-3)-(minimo+3)))+(minimo+3)
    if(fila_2[i]==="-") fila_2[i] = numero;
    numero = Math.round(Math.random()*(maximo-(minimo+6)))+(minimo+6)
    if(fila_3[i]==="-") fila_3[i] = numero;
  }

  let suerte = Math.round(Math.random()*100)
  let embed = new Discord.MessageEmbed()
    .setAuthor("JUGUEMOS AL BINGO", `https://cdn.discordapp.com/attachments/823263020246761523/850819620251107348/bingo.gif`)
    .setDescription('__CARTÓN__\n```\n'+
    `-----------------------------------------------\n`+
    `| ${fila_1.join(" - ")} |\n`+
    `-----------------------------------------------\n`+
    `| ${fila_2.join(" - ")} |\n`+
    `-----------------------------------------------\n`+
    `| ${fila_3.join(" - ")} |\n`+
    `-----------------------------------------------\n`+
    '```')
    .setColor(`#95F5FC`)
    .setThumbnail(message.author.avatarURL())
  let mensaje = await message.channel.send(embed)
  setTimeout(async function() {
    maximo = 0
    do{
      numero = Math.round(Math.random()*8)
      if(fila_1[numero]!='🌐'){
        maximo = 1;
        fila_1[numero]='❌';
      }
    }while(maximo===0)
    embed = new Discord.MessageEmbed()
      .setAuthor("JUGUEMOS AL BINGO .", `https://cdn.discordapp.com/attachments/823263020246761523/850819620251107348/bingo.gif`)
      .setDescription('__CARTÓN__\n```\n'+
      `-----------------------------------------------\n`+
      `| ${fila_1.join(" - ")} |\n`+
      `-----------------------------------------------\n`+
      `| ${fila_2.join(" - ")} |\n`+
      `-----------------------------------------------\n`+
      `| ${fila_3.join(" - ")} |\n`+
      `-----------------------------------------------\n`+
      '```')
      .setColor(`#95F5FC`)
      .setThumbnail(message.author.avatarURL())
    mensaje.edit(embed)
  }, 3000);

  setTimeout(async function() {
    maximo = 0
    do{
      numero = Math.round(Math.random()*8)
      if(fila_2[numero]!='🌐'){
        maximo = 1;
        fila_2[numero]='❌';
      }
    }while(maximo===0)
    embed = new Discord.MessageEmbed()
      .setAuthor("JUGUEMOS AL BINGO . .", `https://cdn.discordapp.com/attachments/823263020246761523/850819620251107348/bingo.gif`)
      .setDescription('__CARTÓN__\n```\n'+
      `-----------------------------------------------\n`+
      `| ${fila_1.join(" - ")} |\n`+
      `-----------------------------------------------\n`+
      `| ${fila_2.join(" - ")} |\n`+
      `-----------------------------------------------\n`+
      `| ${fila_3.join(" - ")} |\n`+
      `-----------------------------------------------\n`+
      '```')
      .setColor(`#95F5FC`)
      .setThumbnail(message.author.avatarURL())
    mensaje.edit(embed)
  }, 6000);

  setTimeout(async function() {
    maximo = 0
    do{
      numero = Math.round(Math.random()*8)
      if(fila_3[numero]!='🌐'){
        maximo = 1;
        fila_3[numero]='❌';
      }
    }while(maximo===0)
    embed = new Discord.MessageEmbed()
      .setAuthor("JUGUEMOS AL BINGO . . .", `https://cdn.discordapp.com/attachments/823263020246761523/850819620251107348/bingo.gif`)
      .setDescription('__CARTÓN__\n```\n'+
      `-----------------------------------------------\n`+
      `| ${fila_1.join(" - ")} |\n`+
      `-----------------------------------------------\n`+
      `| ${fila_2.join(" - ")} |\n`+
      `-----------------------------------------------\n`+
      `| ${fila_3.join(" - ")} |\n`+
      `-----------------------------------------------\n`+
      '```')
      .setColor(`#95F5FC`)
      .setThumbnail(message.author.avatarURL())
    mensaje.edit(embed)
  }, 9000);

  setTimeout(async function() {
    if(suerte<95){
      embed = new Discord.MessageEmbed()
        .setAuthor("JUGUEMOS AL BINGO: PERDISTE", `https://cdn.discordapp.com/attachments/823263020246761523/850819620251107348/bingo.gif`)
        .setImage(`https://cdn.discordapp.com/attachments/823263020246761523/850820506964721684/bingo-perder.gif`)
        .setColor(`#95F5FC`)
        .setThumbnail(message.author.avatarURL())
      mensaje.edit(embed)
    }
    else{
      embed = new Discord.MessageEmbed()
        .setAuthor("JUGUEMOS AL BINGO: GANASTE", `https://cdn.discordapp.com/attachments/823263020246761523/850819620251107348/bingo.gif`)
        .setDescription(`:moneybag: **MONEDAS:** 1000`)
        .setImage(`https://cdn.discordapp.com/attachments/823263020246761523/850820506797342740/bingo-ganar.gif`)
        .setColor(`#95F5FC`)
        .setThumbnail(message.author.avatarURL())
      mensaje.edit(embed)
      db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "bingo" => ${message.content}`)
        let sentencia;
        if(!filas) sentencia = `INSERT INTO usuarios(id, monedas) VALUES('${message.author.id}', 1000)`;
        else sentencia = `UPDATE usuarios SET monedas = ${filas.monedas+1000} WHERE id = ${message.author.id}`;

        db_cartera.run(sentencia, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "bingo" => ${message.content}`)
        })
      })
    }
  }, 12000);
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
