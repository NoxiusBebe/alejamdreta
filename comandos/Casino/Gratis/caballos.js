/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_cartera = new sqlite3.Database("./memoria/db_cartera.sqlite");

let ludopatia_caballos = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "caballos [número del caballo]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let apuestacaballo = args.join(" ");
  if(!apuestacaballo || apuestacaballo<1 || apuestacaballo>10 || isNaN(apuestacaballo)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes apostar a un caballo del 1 al 10**\n\n${estructura}`).setColor(`#95F5FC`))

  if(ludopatia_caballos.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 1 minuto** ⛔`).setColor(`#95F5FC`)).then(m => m.delete({ timeout: 6000}))
  ludopatia_caballos.add(message.author.id);
  setTimeout(() => { ludopatia_caballos.delete(message.author.id); }, 60000);

  let poderpremio;
  let numaleatorio6 = Math.round(Math.random()*(10-1))+1;

  let mensaje = await message.channel.send(new Discord.MessageEmbed().setDescription(`**:one: / :seven:\n\n¡Y DA COMIENZO LA CARRERA! EL CABALLO NÚMERO ${Math.round(Math.random()*(10-1))+1} PARECE QUE HA DESAYUNADO BIEN ESTA MAÑANA**`).setThumbnail(message.author.avatarURL()).setColor(`#95F5FC`)).catch(err => console.log(err));
  setTimeout(async function() {if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:two: / :seven:\n\nSORPRENDENTEMENTE, EL CABALLO NÚMERO ${Math.round(Math.random()*(10-1))+1} TOMA LA VENTAJA Y SE ADELANTA EN UN SUSPIRO**`).setThumbnail(message.author.avatarURL()).setColor(`#95F5FC`));}, 5000);
  setTimeout(async function() {if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:three: / :seven:\n\n¿ES UN PÁJARO? ¿ES UN AVIÓN? MADRE MÍA CON EL CABALLO ${Math.round(Math.random()*(10-1))+1}, VA COMO UNA BALA.**`).setThumbnail(message.author.avatarURL()).setColor(`#95F5FC`));}, 10000);
  setTimeout(async function() {if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:four: / :seven:\n\nMITAD DE LA CARRERA Y LA SITUACION ES QUE EL CABALLO ${Math.round(Math.random()*(10-1))+1} VA EN 1º POSICION PERO LE PISAN LOS TALONES, NO HAY NADA CLARO...**`).setThumbnail(message.author.avatarURL()).setColor(`#95F5FC`));}, 15000);
  setTimeout(async function() {if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:five: / :seven:\n\nSOLO QUEDA UNA RECTA, PARECE QUE EL CABALLO NÚMERO ${Math.round(Math.random()*(10-1))+1} PUEDE SER EL VENCEDOR PERO NO ESTÁ TODO CLARO**`).setThumbnail(message.author.avatarURL()).setColor(`#95F5FC`));}, 20000);
  setTimeout(async function() {if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:six: / :seven:\n\n¡GALOPAN Y GALOPAN, CRUZAN LA META Y..... TENEMOS QUE RECURRIR A LA FOTO FINISH PARA VER QUIEN GANÓ!**`).setThumbnail(message.author.avatarURL()).setColor(`#95F5FC`));}, 25000);
  setTimeout(async function() {if(mensaje) mensaje.edit(new Discord.MessageEmbed().setDescription(`**:seven: / :seven:\n\n¡FINALMENTE, TRAS REVISAR LA FOTO FINISH, EL CABALLO NUMERO ${numaleatorio6} ES QUIEN GANA LA CARRERA!**`).setThumbnail(message.author.avatarURL()).setColor(`#95F5FC`));}, 30000);
  setTimeout(async function() {
    let embed = new Discord.MessageEmbed()
      .setDescription(`**:racehorse: __CARRERAS DE CABALLOS__ :racehorse:**\n\n:money_with_wings: **Tu apuesta fue:** ${apuestacaballo}\n:first_place: **Y el ganador es:** ${numaleatorio6}`)
      .setColor(`#95F5FC`)
      .setThumbnail(message.author.avatarURL())
      .setTimestamp();
    if(mensaje) mensaje.edit(embed);
    if(parseInt(apuestacaballo) === numaleatorio6){
      let cuadroS = new Discord.MessageEmbed()
        .setDescription(`:star_struck: **HAS GANADO EN LAS CARRERAS DE CABALLOS**\n\n:confetti_ball: ¡ENHORABUENA! HAS GANADO **2000** MONEDAS`)
        .setColor('#34d134')
      message.channel.send(cuadroS)
      db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "caballos" => ${message.content}`)
        let sentencia;
        if(!filas) sentencia = `INSERT INTO usuarios(id, monedas) VALUES('${message.author.id}', ${2000})`;
        else sentencia = `UPDATE usuarios SET monedas = ${filas.monedas+(2000)} WHERE id = ${message.author.id}`

        db_cartera.run(sentencia, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "caballos" => ${message.content}`)
        })
      })
    }
    else{
      let cuadroS = new Discord.MessageEmbed()
        .setDescription(`:anger: **PERDISTE TU TIEMPO TONTAMENTE, PERO SIGUE INTENTÁNDOLO...**`)
        .setColor('#d13434')
      message.channel.send(cuadroS)
    }
  }, 35000);
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
