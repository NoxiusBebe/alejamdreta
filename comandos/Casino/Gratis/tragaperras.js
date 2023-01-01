/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_cartera = new sqlite3.Database("./memoria/db_cartera.sqlite");

let frutas = require("../../../archivos/Documentos/Casino/frutas.json")

let ludopatia_tragaperras = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "tragaperras`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  if(ludopatia_tragaperras.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 1 minuto** ⛔`)).then(m => m.delete({ timeout: 6000}))
  ludopatia_tragaperras.add(message.author.id);
  setTimeout(() => { ludopatia_tragaperras.delete(message.author.id); }, 60000);

  let poderpremio;
  let rula1;
  let rula2;
  let rula3;

  let mensaje = await message.channel.send(new Discord.MessageEmbed().setDescription(`**:arrows_counterclockwise: ${message.author}, GIRANDO LOS CILINDROS .**`).setColor(`#95F5FC`)).catch(err => console.log(err));
  setTimeout(async function() {
      if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:arrows_counterclockwise: ${message.author}, GIRANDO LOS CILINDROS . .**`).setColor(`#95F5FC`));
      rula1 = Math.round(Math.random()*(frutas.length-1));
  }, 1000);
  setTimeout(async function() {
      if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:arrows_counterclockwise: ${message.author}, GIRANDO LOS CILINDROS . . .**`).setColor(`#95F5FC`));
      rula2 = Math.round(Math.random()*(frutas.length-1));
  }, 2000);
  setTimeout(async function() {
    if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:arrows_counterclockwise: ${message.author}, GIRANDO LOS CILINDROS . . . .**`).setColor(`#95F5FC`));
      rula3 = Math.round(Math.random()*(frutas.length-1));
  }, 3000);
  setTimeout(async function() {
    let embed = new Discord.MessageEmbed()
      .setDescription(`**:slot_machine: __LA MÁQUINA TRAGAPERRAS__ :slot_machine:**\n\n:four_leaf_clover: **Tu tirada:** ${frutas[rula1]} ${frutas[rula2]} ${frutas[rula3]}`)
      .setColor(`#95F5FC`)
      .setThumbnail(message.author.avatarURL())
      .setTimestamp();
    if(mensaje) mensaje.edit(embed);
    if(rula1===rula2 && rula1===rula3){
      let cuadroS = new Discord.MessageEmbed()
        .setDescription(`**:star_struck: HAS GANADO EN LA MÁQUINA TRAGAPERRAS**\n\n:confetti_ball: ¡ENHORABUENA! HAS GANADO **${30000}** MONEDAS`)
        .setColor('#34d134')
      message.channel.send(cuadroS)
      db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "tragaperras" => ${message.content}`)
        let sentencia;
        if(!filas) sentencia = `INSERT INTO usuarios(id, monedas) VALUES('${message.author.id}', ${30000})`;
        else sentencia = `UPDATE usuarios SET monedas = ${filas.monedas+(30000)} WHERE id = ${message.author.id}`;

        db_cartera.run(sentencia, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "tragaperras" => ${message.content}`)
        })
      })
    }
    else{
      let cuadroS = new Discord.MessageEmbed()
        .setDescription(`:anger: **PERDISTE TU TIEMPO TONTAMENTE, PERO SIGUE INTENTÁNDOLO...**`)
        .setColor('#d13434')
      return message.channel.send(cuadroS)
    }
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
