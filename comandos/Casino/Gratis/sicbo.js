/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_cartera = new sqlite3.Database("./memoria/db_cartera.sqlite");

let ludopatia_sicbo = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "sicbo [número del 1 al 6]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let numero = args.join(" ")
  if(!numero) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes elegir un número**\n\n${estructura}`))
  if((numero!="1" && numero!="2" && numero!="3" && numero!="4" && numero!="5" && numero!="6") || isNaN(numero)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Apuesta incorrecta**\n\n${estructura}`).setColor(`#95F5FC`))
  numero = parseInt(numero);

  if(ludopatia_sicbo.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 5 minutos** ⛔`)).then(m => m.delete({ timeout: 6000}))
  ludopatia_sicbo.add(message.author.id);
  setTimeout(() => { ludopatia_sicbo.delete(message.author.id);}, 300000);

  let dado_1;
  let dado_2;
  let dado_3;

  let completo = [];

  let ganancia=0;

  let mensaje = await message.channel.send(new Discord.MessageEmbed().setDescription(`**:game_die: ${message.author}, AGITANDO EL CUBO .**`).setColor(`#95F5FC`));

  setTimeout(async function() {
      if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:game_die: ${message.author}, AGITANDO EL CUBO . .**`).setColor(`#95F5FC`));
      dado_1 = Math.round(Math.random()*(6-1)+1);
      completo.push(dado_1);
  }, 1000);
  setTimeout(async function() {
      if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:game_die: ${message.author}, AGITANDO EL CUBO . . .**`).setColor(`#95F5FC`));
      dado_2 = Math.round(Math.random()*(6-1)+1);
      completo.push(dado_2);
  }, 2000);
  setTimeout(async function() {
      if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:game_die: ${message.author}, AGITANDO EL CUBO . . . .**`).setColor(`#95F5FC`));
      dado_3 = Math.round(Math.random()*(6-1)+1);
      completo.push(dado_3);
  }, 3000);

  setTimeout(async function() {
    for(var i=0 ; i<3 ; i++) if(completo[i]===numero) ganancia++;
    if(ganancia===3) ganancia = 1000;
    else if(ganancia===2) ganancia = 500;
    else if(ganancia===1) ganancia = 200;
    else ganancia = 0;
    let embed = new Discord.MessageEmbed()
      .setDescription(`**:game_die: __JUEGO DEL SIC-BO__ :game_die:**`)
      .setColor(`#95F5FC`)
      .setThumbnail(message.author.avatarURL())
      .addField(`:four_leaf_clover: Tu apuesta: `, numero, true)
      .addField(":magic_wand: Combinación: ",`:game_die:${dado_1}, :game_die:${dado_2} y :game_die:${dado_3}`, true)
      .addField(`:moneybag: Monedas: `, ganancia)
      .setTimestamp();
    if(mensaje) mensaje.edit(embed);
    db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "sicbo" => ${message.content}`)
      let sentencia;
      if(!filas) sentencia = `INSERT INTO usuarios(id, monedas) VALUES('${message.author.id}', ${ganancia})`;
      else sentencia = `UPDATE usuarios SET monedas = ${filas.monedas+(ganancia)} WHERE id = ${message.author.id}`;

      db_cartera.run(sentencia, function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "sicbo" => ${message.content}`)
      })
    })
  }, 4000);
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
