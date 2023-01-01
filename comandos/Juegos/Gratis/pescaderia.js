/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_pescaderia = new sqlite3.Database("./memoria/db_pescaderia.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "pescaderia`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  db_pescaderia.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 pescando un pez`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:fishing_pole_and_fish: **¡Aún no has pescado nada!**\n\n**Para pescar:** \n*`+ client.config.prefijos[message.guild.id] +'pescar*').setColor(`#FBACAC`))
    let especie1, especie2, especie3, especie4, especie5, especie6, especie7, especie8, especie9, especie10, especie11, especie12, especie13;

    let lleno = 0;

    if(filas.Especie1!=null) especie1 = filas.Especie1;
    else especie1 = ':question::question::question:', lleno = 1;
    if(filas.Especie2!=null) especie2 = filas.Especie2;
    else especie2 = ':question::question::question:', lleno = 1;
    if(filas.Especie3!=null) especie3 = filas.Especie3;
    else especie3 = ':question::question::question:', lleno = 1;
    if(filas.Especie4!=null) especie4 = filas.Especie4;
    else especie4 = ':question::question::question:', lleno = 1;
    if(filas.Especie5!=null) especie5 = filas.Especie5;
    else especie5 = ':question::question::question:', lleno = 1;
    if(filas.Especie6!=null) especie6 = filas.Especie6;
    else especie6 = ':question::question::question:', lleno = 1;
    if(filas.Especie7!=null) especie7 = filas.Especie7;
    else especie7 = ':question::question::question:', lleno = 1;
    if(filas.Especie8!=null) especie8 = filas.Especie8;
    else especie8 = ':question::question::question:', lleno = 1;
    if(filas.Especie9!=null) especie9 = filas.Especie9;
    else especie9 = ':question::question::question:', lleno = 1;
    if(filas.Especie10!=null) especie10 = filas.Especie10;
    else especie10 = ':question::question::question:', lleno = 1;
    if(filas.Especie11!=null) especie11 = filas.Especie11;
    else especie11 = ':question::question::question:', lleno = 1;
    if(filas.Especie12!=null) especie12 = filas.Especie12;
    else especie12 = ':question::question::question:', lleno = 1;
    if(filas.Especie13!=null) especie13 = filas.Especie13;
    else especie13 = ':question::question::question:', lleno = 1;

    let embed = new Discord.MessageEmbed()
      .setTitle(`:fishing_pole_and_fish: LA PESCADERÍA DE:  **${message.author.tag}**`)
      .setThumbnail(message.author.avatarURL())
      .addField(`**Especie 1: **`, especie1, true)
      .addField(`**Especie 2: **`, especie2, true)
      .addField(`**Especie 3: **`, especie3, true)
      .addField(`**Especie 4: **`, especie4, true)
      .addField(`**Especie 5: **`, especie5, true)
      .addField(`**Especie 6: **`, especie6, true)
      .addField(`**Especie 7: **`, especie7, true)
      .addField(`**Especie 8: **`, especie8, true)
      .addField(`**Especie 9: **`, especie9, true)
      .addField(`**Especie 10: **`, especie10, true)
      .addField(`**Especie 11: **`, especie11, true)
      .addField(`**Especie 12: **`, especie12, true)
      .addField(`**Especie 13: **`, especie13, true)
      .setColor('#1F35CA')
      .setTimestamp();
    await message.channel.send(embed).then(m => {
      if(lleno===0){
        m.channel.send(new Discord.MessageEmbed().setDescription(`**HAS LLENADO TU ACUARIO, ¡ENHORABUENA!**`))
      }
    })
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
