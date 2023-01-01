/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_listas = new sqlite3.Database("./memoria/db_listas.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "ver.lista [nº de la lista: 1 al 10]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#A9FF3D`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#A9FF3D`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  let numero = args.join(" ")

  if(!numero || isNaN(numero) || numero<0 || numero>10) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes concretar el número de la lista (entre 1 y 10)**\n\n${estructura}`).setColor(`#A9FF3D`))
  numero = parseInt(numero);

  db_listas.all(`SELECT * FROM '${message.guild.id}'`, async (err, filas) => {
    if(!filas || !filas[numero-1]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:question: **Este número no corresponde con ninguna lista**\n\n${estructura}`).setColor(`#A9FF3D`))
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 ver 1 lista que es ${numero} en ${message.guild.id}`)
    if(!message.member.hasPermission("ADMINISTRATOR") || filas[numero-1].autor!=`${message.author.id}`) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **Sin ser administrador o el creador de la lista, no puedes hacer esto.**\n\n${estructura}`).setColor(`#A9FF3D`))
    let integrantes = [];
    let num_paginas = 0;
    let contador = 0;
    for(var i=0 ; i<=2000; i++){
      if(filas[numero-1][`user_${i}`]) integrantes.push('<@'+filas[numero-1][`user_${i}`]+'>'), contador++;
      else integrantes.push(`- - -`)
    }
    if(contador<24) num_paginas = 1;
    else num_paginas = parseInt(integrantes.length/24)+1;

    let embed = new Discord.MessageEmbed()
      .setTitle(`:notepad_spiral: __${filas[numero-1].titulo}__`)
      .setDescription(`:busts_in_silhouette: **Participantes:** ${filas[numero-1].participantes}\n:hash: **Apúntate:** ${client.config.prefijos[message.guild.id]}+lista ${numero}`)
      .setThumbnail(`https://images.vexels.com/media/users/3/145567/isolated/preview/f3626d1206a21a7efa8e6ed51a7de2db-pergamino-de-navidad-by-vexels.png`)
      .setColor(`#A9FF3D`)
      .addField(`1ºUsuario`, `${integrantes[0]}`, true)
      .addField(`2ºUsuario`, `${integrantes[1]}`, true)
      .addField(`3ºUsuario`, `${integrantes[2]}`, true)
      .addField(`4ºUsuario`, `${integrantes[3]}`, true)
      .addField(`5ºUsuario`, `${integrantes[4]}`, true)
      .addField(`6ºUsuario`, `${integrantes[5]}`, true)
      .addField(`7ºUsuario`, `${integrantes[6]}`, true)
      .addField(`8ºUsuario`, `${integrantes[7]}`, true)
      .addField(`9ºUsuario`, `${integrantes[8]}`, true)
      .addField(`10ºUsuario`, `${integrantes[9]}`, true)
      .addField(`11ºUsuario`, `${integrantes[10]}`, true)
      .addField(`12ºUsuario`, `${integrantes[11]}`, true)
      .addField(`13ºUsuario`, `${integrantes[12]}`, true)
      .addField(`14ºUsuario`, `${integrantes[13]}`, true)
      .addField(`15ºUsuario`, `${integrantes[14]}`, true)
      .addField(`16ºUsuario`, `${integrantes[15]}`, true)
      .addField(`17ºUsuario`, `${integrantes[16]}`, true)
      .addField(`18ºUsuario`, `${integrantes[17]}`, true)
      .addField(`19ºUsuario`, `${integrantes[18]}`, true)
      .addField(`20ºUsuario`, `${integrantes[19]}`, true)
      .addField(`21ºUsuario`, `${integrantes[20]}`, true)
      .addField(`22ºUsuario`, `${integrantes[21]}`, true)
      .addField(`23ºUsuario`, `${integrantes[22]}`, true)
      .addField(`24ºUsuario`, `${integrantes[23]}`, true)
      .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág 1/${num_paginas}`)
    let mensaje = await message.channel.send(embed).then(m => {
      m.react("⏪");
      setTimeout(function() {
        m.react("⏩");
      }, 400);
      db_listas.run(`UPDATE '${message.guild.id}' SET pagina = 1, num_paginas = ${num_paginas}, mensaje = '${m.id}' WHERE titulo = '${filas[numero-1].titulo}'`, async function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 ver 1 lista que es ${numero} en ${message.guild.id}`)
      });
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
