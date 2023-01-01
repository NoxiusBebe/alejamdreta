/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_cartera = new sqlite3.Database("./memoria/db_cartera.sqlite");

let ludopatia_ruleta = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "ruleta [número del 1 al 36]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let apuesta = args.join(" ")
  let mensaje;
  let resultado = Math.round(Math.random()*36);
  let poderpremio;

  if(!apuesta || apuesta<0 || apuesta>36 || isNaN(apuesta)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **La apuesta que has hecho no es válida**\n\n${estructura}`).setColor(`#95F5FC`))

  if(ludopatia_ruleta.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 1 minuto** ⛔`).setColor(`#95F5FC`)).then(m => m.delete({ timeout: 6000}))
  ludopatia_ruleta.add(message.author.id);
  setTimeout(() => { ludopatia_ruleta.delete(message.author.id); }, 60000);

  mensaje = await message.channel.send(new Discord.MessageEmbed().setDescription(`**:arrows_counterclockwise: ${message.author}, :microphone: tira deee la ruletaaaaa .**`).setColor(`#95F5FC`)).catch(err => console.log(err));
  setTimeout(async function() {if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:arrows_counterclockwise: ${message.author}, :microphone: tira deee la ruletaaaaa . .**`).setColor(`#95F5FC`));}, 1000);
  setTimeout(async function() {if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:arrows_counterclockwise: ${message.author}, :microphone: tira deee la ruletaaaaa . . .**`).setColor(`#95F5FC`));}, 2000);
  setTimeout(async function() {if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:arrows_counterclockwise: ${message.author}, :microphone: tira deee la ruletaaaaa . . . .**`).setColor(`#95F5FC`));}, 3000);
  setTimeout(async function() {
    if(resultado===1 || resultado===3 || resultado===5 || resultado===7 || resultado===9 || resultado===12 || resultado===14 || resultado===16 || resultado===18 || resultado===19 || resultado===21 || resultado===23 || resultado===25 || resultado===27 || resultado===30 || resultado===32 || resultado===34 || resultado===36){
      let embed = new Discord.MessageEmbed()
        .setDescription(`:game_die: __**LA RULETA**__ :game_die:`)
        .setColor(`#95F5FC`)
        .setThumbnail(message.author.avatarURL())
        .addField(":four_leaf_clover: Tu apuesta :four_leaf_clover: ", `${apuesta}`, true)
        .addField(":8ball: Bola final :8ball:",`**${resultado}**`, true)
        .setTimestamp();
      if(mensaje) mensaje.edit(embed);
    }
    if(resultado===2 || resultado===4 || resultado===6 || resultado===8 || resultado===10 || resultado===11 || resultado===13 || resultado===15 || resultado===17 || resultado===20 || resultado===22 || resultado===24 || resultado===26 || resultado===28 || resultado===29 || resultado===31 || resultado===33 || resultado===35){
      let embed = new Discord.MessageEmbed()
        .setDescription(`:game_die: __**LA RULETA**__ :game_die:`)
        .setColor(`#95F5FC`)
        .setThumbnail(message.author.avatarURL())
        .addField(":four_leaf_clover: Tu apuesta :four_leaf_clover: ", `${apuesta}`, true)
        .addField(":8ball: Bola final :8ball:",`**${resultado}**`, true)
        .setTimestamp();
      message.channel.send(embed);
    }
    if(resultado===0){
      let embed = new Discord.MessageEmbed()
        .setDescription(`**:game_die: __**LA RULETA**__ :game_die:**`)
        .setColor(`#95F5FC`)
        .setThumbnail(message.author.avatarURL())
        .addField(":four_leaf_clover: Tu apuesta :four_leaf_clover: ", `${apuesta}`, true)
        .addField(":8ball: Bola final :8ball:",`**${resultado}**`, true)
        .setTimestamp();
      message.channel.send(embed);
    }
    if(parseInt(apuesta) === resultado){
      let cuadroS = new Discord.MessageEmbed()
        .setDescription(`**:star_struck: HAS GANADO EN LA RULETA**\n\n:confetti_ball: ¡ENHORABUENA! HAS GANADO **${5000}** MONEDAS`)
        .setColor('#34d134')
      message.channel.send(cuadroS)
      db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "ruleta" => ${message.content}`)
        let sentencia;
        if(!filas) sentencia = `INSERT INTO usuarios(id, monedas) VALUES('${message.author.id}', ${5000})`;
        else sentencia = `UPDATE usuarios SET monedas = ${filas.monedas+(5000)} WHERE id = ${message.author.id}`;
        db_cartera.run(sentencia, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "ruleta" => ${message.content}`)
        })
      })
    }
    else{
      let cuadroS = new Discord.MessageEmbed()
        .setDescription(`:anger: **PERDISTE TU TIEMPO TONTAMENTE, PERO SIGUE INTENTÁNDOLO...**`)
        .setColor('#d13434')
      message.channel.send(cuadroS)
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
