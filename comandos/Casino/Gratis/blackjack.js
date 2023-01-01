/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_cartera = new sqlite3.Database("./memoria/db_cartera.sqlite");

let cartas = require("../../../archivos/Documentos/Casino/cartas.json")

let ludopatia_blackjack = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "blackjack`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  if(ludopatia_blackjack.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 30 segundos** ⛔`).setColor(`#95F5FC`)).then(m => m.delete({ timeout: 6000}))
  ludopatia_blackjack.add(message.author.id);
  setTimeout(() => { ludopatia_blackjack.delete(message.author.id); }, 30000);

  let baraja = JSON.parse(JSON.stringify(cartas))
  let cartas_user = [];
  let puntos_user = [];
  let suma_user = 0;
  let cartas_bot = [];
  let puntos_bot = [];
  let suma_bot = 0;
  let numero_palo;
  let numero_carta;
  let aux = 0;

  for(var i=0 ; i<2 ; i++){
    numero_palo = Math.round(Math.random()*3);
    do{numero_carta = Math.round(Math.random()*(baraja[numero_palo].length-1));}while(numero_carta<0)
    cartas_user.push(baraja[numero_palo][numero_carta])

    if(baraja[numero_palo][numero_carta]==='A:hearts:' || baraja[numero_palo][numero_carta]==='A:spades:' || baraja[numero_palo][numero_carta]==='A:diamonds:' || baraja[numero_palo][numero_carta]==='A:clubs:') puntos_user.push(11), suma_user = suma_user+11;
    if(baraja[numero_palo][numero_carta]==='2:hearts:' || baraja[numero_palo][numero_carta]==='2:spades:' || baraja[numero_palo][numero_carta]==='2:diamonds:' || baraja[numero_palo][numero_carta]==='2:clubs:') puntos_user.push(2), suma_user = suma_user+2;
    if(baraja[numero_palo][numero_carta]==='3:hearts:' || baraja[numero_palo][numero_carta]==='3:spades:' || baraja[numero_palo][numero_carta]==='3:diamonds:' || baraja[numero_palo][numero_carta]==='3:clubs:') puntos_user.push(3), suma_user = suma_user+3;
    if(baraja[numero_palo][numero_carta]==='4:hearts:' || baraja[numero_palo][numero_carta]==='4:spades:' || baraja[numero_palo][numero_carta]==='4:diamonds:' || baraja[numero_palo][numero_carta]==='4:clubs:') puntos_user.push(4), suma_user = suma_user+4;
    if(baraja[numero_palo][numero_carta]==='5:hearts:' || baraja[numero_palo][numero_carta]==='5:spades:' || baraja[numero_palo][numero_carta]==='5:diamonds:' || baraja[numero_palo][numero_carta]==='5:clubs:') puntos_user.push(5), suma_user = suma_user+5;
    if(baraja[numero_palo][numero_carta]==='6:hearts:' || baraja[numero_palo][numero_carta]==='6:spades:' || baraja[numero_palo][numero_carta]==='6:diamonds:' || baraja[numero_palo][numero_carta]==='6:clubs:') puntos_user.push(6), suma_user = suma_user+6;
    if(baraja[numero_palo][numero_carta]==='7:hearts:' || baraja[numero_palo][numero_carta]==='7:spades:' || baraja[numero_palo][numero_carta]==='7:diamonds:' || baraja[numero_palo][numero_carta]==='7:clubs:') puntos_user.push(7), suma_user = suma_user+7;
    if(baraja[numero_palo][numero_carta]==='8:hearts:' || baraja[numero_palo][numero_carta]==='8:spades:' || baraja[numero_palo][numero_carta]==='8:diamonds:' || baraja[numero_palo][numero_carta]==='8:clubs:') puntos_user.push(8), suma_user = suma_user+8;
    if(baraja[numero_palo][numero_carta]==='9:hearts:' || baraja[numero_palo][numero_carta]==='9:spades:' || baraja[numero_palo][numero_carta]==='9:diamonds:' || baraja[numero_palo][numero_carta]==='9:clubs:') puntos_user.push(9), suma_user = suma_user+9;
    if(baraja[numero_palo][numero_carta]==='10:hearts:' || baraja[numero_palo][numero_carta]==='10:spades:' || baraja[numero_palo][numero_carta]==='10:diamonds:' || baraja[numero_palo][numero_carta]==='10:clubs:') puntos_user.push(10), suma_user = suma_user+10;
    if(baraja[numero_palo][numero_carta]==='J:hearts:' || baraja[numero_palo][numero_carta]==='J:spades:' || baraja[numero_palo][numero_carta]==='J:diamonds:' || baraja[numero_palo][numero_carta]==='J:clubs:') puntos_user.push(10), suma_user = suma_user+10;
    if(baraja[numero_palo][numero_carta]==='Q:hearts:' || baraja[numero_palo][numero_carta]==='Q:spades:' || baraja[numero_palo][numero_carta]==='Q:diamonds:' || baraja[numero_palo][numero_carta]==='Q:clubs:') puntos_user.push(10), suma_user = suma_user+10;
    if(baraja[numero_palo][numero_carta]==='K:hearts:' || baraja[numero_palo][numero_carta]==='K:spades:' || baraja[numero_palo][numero_carta]==='K:diamonds:' || baraja[numero_palo][numero_carta]==='K:clubs:') puntos_user.push(10), suma_user = suma_user+10;

    baraja[numero_palo].splice(numero_carta, 1)
  }
  for(var i=0 ; i<2 ; i++){
    numero_palo = Math.round(Math.random()*3);
    do{numero_carta = Math.round(Math.random()*(baraja[numero_palo].length-1));}while(numero_carta<0)
    cartas_bot.push(baraja[numero_palo][numero_carta])

    if(baraja[numero_palo][numero_carta]==='A:hearts:' || baraja[numero_palo][numero_carta]==='A:spades:' || baraja[numero_palo][numero_carta]==='A:diamonds:' || baraja[numero_palo][numero_carta]==='A:clubs:') puntos_bot.push(11), suma_bot = suma_bot+11;
    if(baraja[numero_palo][numero_carta]==='2:hearts:' || baraja[numero_palo][numero_carta]==='2:spades:' || baraja[numero_palo][numero_carta]==='2:diamonds:' || baraja[numero_palo][numero_carta]==='2:clubs:') puntos_bot.push(2), suma_bot = suma_bot+2;
    if(baraja[numero_palo][numero_carta]==='3:hearts:' || baraja[numero_palo][numero_carta]==='3:spades:' || baraja[numero_palo][numero_carta]==='3:diamonds:' || baraja[numero_palo][numero_carta]==='3:clubs:') puntos_bot.push(3), suma_bot = suma_bot+3;
    if(baraja[numero_palo][numero_carta]==='4:hearts:' || baraja[numero_palo][numero_carta]==='4:spades:' || baraja[numero_palo][numero_carta]==='4:diamonds:' || baraja[numero_palo][numero_carta]==='4:clubs:') puntos_bot.push(4), suma_bot = suma_bot+4;
    if(baraja[numero_palo][numero_carta]==='5:hearts:' || baraja[numero_palo][numero_carta]==='5:spades:' || baraja[numero_palo][numero_carta]==='5:diamonds:' || baraja[numero_palo][numero_carta]==='5:clubs:') puntos_bot.push(5), suma_bot = suma_bot+5;
    if(baraja[numero_palo][numero_carta]==='6:hearts:' || baraja[numero_palo][numero_carta]==='6:spades:' || baraja[numero_palo][numero_carta]==='6:diamonds:' || baraja[numero_palo][numero_carta]==='6:clubs:') puntos_bot.push(6), suma_bot = suma_bot+6;
    if(baraja[numero_palo][numero_carta]==='7:hearts:' || baraja[numero_palo][numero_carta]==='7:spades:' || baraja[numero_palo][numero_carta]==='7:diamonds:' || baraja[numero_palo][numero_carta]==='7:clubs:') puntos_bot.push(7), suma_bot = suma_bot+7;
    if(baraja[numero_palo][numero_carta]==='8:hearts:' || baraja[numero_palo][numero_carta]==='8:spades:' || baraja[numero_palo][numero_carta]==='8:diamonds:' || baraja[numero_palo][numero_carta]==='8:clubs:') puntos_bot.push(8), suma_bot = suma_bot+8;
    if(baraja[numero_palo][numero_carta]==='9:hearts:' || baraja[numero_palo][numero_carta]==='9:spades:' || baraja[numero_palo][numero_carta]==='9:diamonds:' || baraja[numero_palo][numero_carta]==='9:clubs:') puntos_bot.push(9), suma_bot = suma_bot+9;
    if(baraja[numero_palo][numero_carta]==='10:hearts:' || baraja[numero_palo][numero_carta]==='10:spades:' || baraja[numero_palo][numero_carta]==='10:diamonds:' || baraja[numero_palo][numero_carta]==='10:clubs:') puntos_bot.push(10), suma_bot = suma_bot+10;
    if(baraja[numero_palo][numero_carta]==='J:hearts:' || baraja[numero_palo][numero_carta]==='J:spades:' || baraja[numero_palo][numero_carta]==='J:diamonds:' || baraja[numero_palo][numero_carta]==='J:clubs:') puntos_bot.push(10), suma_bot = suma_bot+10;
    if(baraja[numero_palo][numero_carta]==='Q:hearts:' || baraja[numero_palo][numero_carta]==='Q:spades:' || baraja[numero_palo][numero_carta]==='Q:diamonds:' || baraja[numero_palo][numero_carta]==='Q:clubs:') puntos_bot.push(10), suma_bot = suma_bot+10;
    if(baraja[numero_palo][numero_carta]==='K:hearts:' || baraja[numero_palo][numero_carta]==='K:spades:' || baraja[numero_palo][numero_carta]==='K:diamonds:' || baraja[numero_palo][numero_carta]==='K:clubs:') puntos_bot.push(10), suma_bot = suma_bot+10;

    baraja[numero_palo].splice(numero_carta, 1)
  }

  if(suma_user===21 && suma_bot===21){
    let embed = new Discord.MessageEmbed()
      .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
      .setDescription(`Cartas de la banca: ${cartas_bot.join(" , ")} | ${suma_bot} puntos\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n:judge: **¡EMPATE!**\n\n:moneybag: **MONEDAS:** 0`)
      .setThumbnail(message.author.avatarURL())
      .setColor(`#95F5FC`)
      .setTimestamp();
    return message.channel.send(embed)
  }

  let embed = new Discord.MessageEmbed()
    .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
    .setDescription(`Cartas de la banca: :question: :question: :question:\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n- - - - - - - - - - - - - - - - - - - - - -\n\n**¿${message.author}, QUIERES COGER OTRA CARTA?**\n\nResponde: `+'`Si` o `No`')
    .setThumbnail(message.author.avatarURL())
    .setColor(`#95F5FC`)
  let mensaje = await message.channel.send(embed)

  let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.channel.id === message.channel.id, {time : 60000});
  collector.on("collect", async m => {
    if(m.content.toLowerCase()==="si" || m.content.toLowerCase()==="SI" || m.content.toLowerCase()==="Si" || m.content.toLowerCase()==="sI" || m.content.toLowerCase()==="s" || m.content.toLowerCase()==="S"){
      numero_palo = Math.round(Math.random()*3);
      do{numero_carta = Math.round(Math.random()*(baraja[numero_palo].length-1));}while(numero_carta<0)
      cartas_user.push(baraja[numero_palo][numero_carta])

      if(baraja[numero_palo][numero_carta]==='A:hearts:' || baraja[numero_palo][numero_carta]==='A:spades:' || baraja[numero_palo][numero_carta]==='A:diamonds:' || baraja[numero_palo][numero_carta]==='A:clubs:') puntos_user.push(11), suma_user = suma_user+11;
      if(baraja[numero_palo][numero_carta]==='2:hearts:' || baraja[numero_palo][numero_carta]==='2:spades:' || baraja[numero_palo][numero_carta]==='2:diamonds:' || baraja[numero_palo][numero_carta]==='2:clubs:') puntos_user.push(2), suma_user = suma_user+2;
      if(baraja[numero_palo][numero_carta]==='3:hearts:' || baraja[numero_palo][numero_carta]==='3:spades:' || baraja[numero_palo][numero_carta]==='3:diamonds:' || baraja[numero_palo][numero_carta]==='3:clubs:') puntos_user.push(3), suma_user = suma_user+3;
      if(baraja[numero_palo][numero_carta]==='4:hearts:' || baraja[numero_palo][numero_carta]==='4:spades:' || baraja[numero_palo][numero_carta]==='4:diamonds:' || baraja[numero_palo][numero_carta]==='4:clubs:') puntos_user.push(4), suma_user = suma_user+4;
      if(baraja[numero_palo][numero_carta]==='5:hearts:' || baraja[numero_palo][numero_carta]==='5:spades:' || baraja[numero_palo][numero_carta]==='5:diamonds:' || baraja[numero_palo][numero_carta]==='5:clubs:') puntos_user.push(5), suma_user = suma_user+5;
      if(baraja[numero_palo][numero_carta]==='6:hearts:' || baraja[numero_palo][numero_carta]==='6:spades:' || baraja[numero_palo][numero_carta]==='6:diamonds:' || baraja[numero_palo][numero_carta]==='6:clubs:') puntos_user.push(6), suma_user = suma_user+6;
      if(baraja[numero_palo][numero_carta]==='7:hearts:' || baraja[numero_palo][numero_carta]==='7:spades:' || baraja[numero_palo][numero_carta]==='7:diamonds:' || baraja[numero_palo][numero_carta]==='7:clubs:') puntos_user.push(7), suma_user = suma_user+7;
      if(baraja[numero_palo][numero_carta]==='8:hearts:' || baraja[numero_palo][numero_carta]==='8:spades:' || baraja[numero_palo][numero_carta]==='8:diamonds:' || baraja[numero_palo][numero_carta]==='8:clubs:') puntos_user.push(8), suma_user = suma_user+8;
      if(baraja[numero_palo][numero_carta]==='9:hearts:' || baraja[numero_palo][numero_carta]==='9:spades:' || baraja[numero_palo][numero_carta]==='9:diamonds:' || baraja[numero_palo][numero_carta]==='9:clubs:') puntos_user.push(9), suma_user = suma_user+9;
      if(baraja[numero_palo][numero_carta]==='10:hearts:' || baraja[numero_palo][numero_carta]==='10:spades:' || baraja[numero_palo][numero_carta]==='10:diamonds:' || baraja[numero_palo][numero_carta]==='10:clubs:') puntos_user.push(10), suma_user = suma_user+10;
      if(baraja[numero_palo][numero_carta]==='J:hearts:' || baraja[numero_palo][numero_carta]==='J:spades:' || baraja[numero_palo][numero_carta]==='J:diamonds:' || baraja[numero_palo][numero_carta]==='J:clubs:') puntos_user.push(10), suma_user = suma_user+10;
      if(baraja[numero_palo][numero_carta]==='Q:hearts:' || baraja[numero_palo][numero_carta]==='Q:spades:' || baraja[numero_palo][numero_carta]==='Q:diamonds:' || baraja[numero_palo][numero_carta]==='Q:clubs:') puntos_user.push(10), suma_user = suma_user+10;
      if(baraja[numero_palo][numero_carta]==='K:hearts:' || baraja[numero_palo][numero_carta]==='K:spades:' || baraja[numero_palo][numero_carta]==='K:diamonds:' || baraja[numero_palo][numero_carta]==='K:clubs:') puntos_user.push(10), suma_user = suma_user+10;

      baraja[numero_palo].splice(numero_carta, 1)
      if(suma_user>21){
        for(var i=0 ; i<puntos_user.length ; i++){
          if(puntos_user[i]===11){
            puntos_user[i] = 1;
            suma_user = suma_user-10;
            break;
          }
          if(i===puntos_user.length-1){
            aux = 1;
            embed = new Discord.MessageEmbed()
              .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
              .setDescription(`Cartas de la banca: :question: :question: :question:\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n:sob: **¡TE PASASTE DE PUNTOS! HAS PERDIDO**\n\n:moneybag: **MONEDAS:** 0`)
              .setThumbnail(message.author.avatarURL())
              .setColor(`#95F5FC`)
              .setTimestamp();
            if(mensaje) message.channel.send(embed)
            collector.stop();
            return;
          }
        }
      }
      else if(suma_user===21){
        aux = 1;
        if(suma_user>suma_bot){
          embed = new Discord.MessageEmbed()
            .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
            .setDescription(`Cartas de la banca: ${cartas_bot.join(" , ")} | ${suma_bot} puntos\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n:tada: **¡HAS GANADO!**\n\n:moneybag: **MONEDAS:** 500`)
            .setThumbnail(message.author.avatarURL())
            .setColor(`#95F5FC`)
            .setTimestamp();
            db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "blackjack" => ${message.content}`)
              let sentencia;
              if(!filas) sentencia = `INSERT INTO usuarios(id, monedas) VALUES('${message.author.id}', ${500})`;
              else sentencia = `UPDATE usuarios SET monedas = ${filas.monedas+(500)} WHERE id = ${message.author.id}`;
              db_cartera.run(sentencia, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "blackjack" => ${message.content}`)
              })
            })
          if(mensaje) message.channel.send(embed)
          collector.stop();
          return;
        }
        else if(suma_user===suma_bot){
          embed = new Discord.MessageEmbed()
            .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
            .setDescription(`Cartas de la banca: ${cartas_bot.join(" , ")} | ${suma_bot} puntos\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n:judge: **¡EMPATE!**\n\n:moneybag: **MONEDAS:** 0`)
            .setThumbnail(message.author.avatarURL())
            .setColor(`#95F5FC`)
            .setTimestamp();
            if(mensaje) message.channel.send(embed)
            collector.stop();
            return;
        }
        else{
          embed = new Discord.MessageEmbed()
            .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
            .setDescription(`Cartas de la banca: :question: :question: :question:\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n:sob: **HAS PERDIDO**\n\n:moneybag: **MONEDAS:** 0`)
            .setThumbnail(message.author.avatarURL())
            .setColor(`#95F5FC`)
            .setTimestamp();
          if(mensaje) message.channel.send(embed)
          collector.stop();
          return;
        }
      }
      embed = new Discord.MessageEmbed()
        .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
        .setDescription(`Cartas de la banca: :question: :question: :question:\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n- - - - - - - - - - - - - - - - - - - - - -\n\n**¿${message.author}, QUIERES COGER OTRA CARTA?**\n\nResponde: `+'`Si` o `No`')
        .setThumbnail(message.author.avatarURL())
        .setColor(`#95F5FC`)
      if(mensaje) message.channel.send(embed)
    }
    else if(m.content.toLowerCase() === "no" || m.content.toLowerCase() === "NO" || m.content.toLowerCase() === "No" || m.content.toLowerCase() === "nO" || m.content.toLowerCase() === "n" || m.content.toLowerCase() === "N"){
      aux = 1;
      do{
        numero_palo = Math.round(Math.random()*3);
        do{numero_carta = Math.round(Math.random()*(baraja[numero_palo].length-1));}while(numero_carta<0)
        cartas_bot.push(baraja[numero_palo][numero_carta])

        if(baraja[numero_palo][numero_carta]==='A:hearts:' || baraja[numero_palo][numero_carta]==='A:spades:' || baraja[numero_palo][numero_carta]==='A:diamonds:' || baraja[numero_palo][numero_carta]==='A:clubs:') puntos_bot.push(11), suma_bot = suma_bot+11;
        if(baraja[numero_palo][numero_carta]==='2:hearts:' || baraja[numero_palo][numero_carta]==='2:spades:' || baraja[numero_palo][numero_carta]==='2:diamonds:' || baraja[numero_palo][numero_carta]==='2:clubs:') puntos_bot.push(2), suma_bot = suma_bot+2;
        if(baraja[numero_palo][numero_carta]==='3:hearts:' || baraja[numero_palo][numero_carta]==='3:spades:' || baraja[numero_palo][numero_carta]==='3:diamonds:' || baraja[numero_palo][numero_carta]==='3:clubs:') puntos_bot.push(3), suma_bot = suma_bot+3;
        if(baraja[numero_palo][numero_carta]==='4:hearts:' || baraja[numero_palo][numero_carta]==='4:spades:' || baraja[numero_palo][numero_carta]==='4:diamonds:' || baraja[numero_palo][numero_carta]==='4:clubs:') puntos_bot.push(4), suma_bot = suma_bot+4;
        if(baraja[numero_palo][numero_carta]==='5:hearts:' || baraja[numero_palo][numero_carta]==='5:spades:' || baraja[numero_palo][numero_carta]==='5:diamonds:' || baraja[numero_palo][numero_carta]==='5:clubs:') puntos_bot.push(5), suma_bot = suma_bot+5;
        if(baraja[numero_palo][numero_carta]==='6:hearts:' || baraja[numero_palo][numero_carta]==='6:spades:' || baraja[numero_palo][numero_carta]==='6:diamonds:' || baraja[numero_palo][numero_carta]==='6:clubs:') puntos_bot.push(6), suma_bot = suma_bot+6;
        if(baraja[numero_palo][numero_carta]==='7:hearts:' || baraja[numero_palo][numero_carta]==='7:spades:' || baraja[numero_palo][numero_carta]==='7:diamonds:' || baraja[numero_palo][numero_carta]==='7:clubs:') puntos_bot.push(7), suma_bot = suma_bot+7;
        if(baraja[numero_palo][numero_carta]==='8:hearts:' || baraja[numero_palo][numero_carta]==='8:spades:' || baraja[numero_palo][numero_carta]==='8:diamonds:' || baraja[numero_palo][numero_carta]==='8:clubs:') puntos_bot.push(8), suma_bot = suma_bot+8;
        if(baraja[numero_palo][numero_carta]==='9:hearts:' || baraja[numero_palo][numero_carta]==='9:spades:' || baraja[numero_palo][numero_carta]==='9:diamonds:' || baraja[numero_palo][numero_carta]==='9:clubs:') puntos_bot.push(9), suma_bot = suma_bot+9;
        if(baraja[numero_palo][numero_carta]==='10:hearts:' || baraja[numero_palo][numero_carta]==='10:spades:' || baraja[numero_palo][numero_carta]==='10:diamonds:' || baraja[numero_palo][numero_carta]==='10:clubs:') puntos_bot.push(10), suma_bot = suma_bot+10;
        if(baraja[numero_palo][numero_carta]==='J:hearts:' || baraja[numero_palo][numero_carta]==='J:spades:' || baraja[numero_palo][numero_carta]==='J:diamonds:' || baraja[numero_palo][numero_carta]==='J:clubs:') puntos_bot.push(10), suma_bot = suma_bot+10;
        if(baraja[numero_palo][numero_carta]==='Q:hearts:' || baraja[numero_palo][numero_carta]==='Q:spades:' || baraja[numero_palo][numero_carta]==='Q:diamonds:' || baraja[numero_palo][numero_carta]==='Q:clubs:') puntos_bot.push(10), suma_bot = suma_bot+10;
        if(baraja[numero_palo][numero_carta]==='K:hearts:' || baraja[numero_palo][numero_carta]==='K:spades:' || baraja[numero_palo][numero_carta]==='K:diamonds:' || baraja[numero_palo][numero_carta]==='K:clubs:') puntos_bot.push(10), suma_bot = suma_bot+10;

        baraja[numero_palo].splice(numero_carta, 1)

        for(var i=0 ; i<puntos_bot.length ; i++){
          if(puntos_bot[i]===11){
            puntos_bot[i] = 1;
            suma_bot = suma_bot-10;
            break;
          }
        }
      }while(suma_bot<16)
      if(suma_bot>21){
        embed = new Discord.MessageEmbed()
          .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
          .setDescription(`Cartas de la banca: ${cartas_bot.join(" , ")} | ${suma_bot} puntos\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n:tada: **¡HAS GANADO!**\n\n:moneybag: **MONEDAS:** 500`)
          .setThumbnail(message.author.avatarURL())
          .setColor(`#95F5FC`)
          .setTimestamp();
        db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #4 ganando al blackjack`)
          let sentencia;
          if(!filas) sentencia = `INSERT INTO usuarios(id, monedas) VALUES('${message.author.id}', ${500})`;
          else sentencia = `UPDATE usuarios SET monedas = ${filas.monedas+(500)} WHERE id = ${message.author.id}`;
          db_cartera.run(sentencia, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #5 ganando al blackjack`)
          })
        })
        if(mensaje) message.channel.send(embed)
        collector.stop();
      }
      else if(suma_user>suma_bot){
        embed = new Discord.MessageEmbed()
          .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
          .setDescription(`Cartas de la banca: ${cartas_bot.join(" , ")} | ${suma_bot} puntos\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n:tada: **¡HAS GANADO!**\n\n:moneybag: **MONEDAS:** 500`)
          .setThumbnail(message.author.avatarURL())
          .setColor(`#95F5FC`)
          .setTimestamp();
        db_cartera.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #3 comando "blackjack" => ${message.content}`)
          let sentencia;
          if(!filas) sentencia = `INSERT INTO usuarios(id, monedas) VALUES('${message.author.id}', ${500})`;
          else sentencia = `UPDATE usuarios SET monedas = ${filas.monedas+(500)} WHERE id = ${message.author.id}`;
          db_cartera.run(sentencia, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #4 comando "blackjack" => ${message.content}`)
          })
        })
        if(mensaje) message.channel.send(embed)
        collector.stop();
      }
      else if(suma_user===suma_bot){
        embed = new Discord.MessageEmbed()
          .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
          .setDescription(`Cartas de la banca: ${cartas_bot.join(" , ")} | ${suma_bot} puntos\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n:judge: **¡EMPATE!**\n\n:moneybag: **MONEDAS:** 0`)
          .setThumbnail(message.author.avatarURL())
          .setColor(`#95F5FC`)
          .setTimestamp();
        if(mensaje) message.channel.send(embed)
        collector.stop();
      }
      else{
        embed = new Discord.MessageEmbed()
          .setTitle(`:diamonds: PARTIDA DE BLACKJACK :spades:`)
          .setDescription(`Cartas de la banca: ${cartas_bot.join(" , ")} | ${suma_bot} puntos\n\n- - - - - - - - - - - - - - - - - - - - - -\n\nTus cartas: ${cartas_user.join(" , ")} | ${suma_user} puntos\n\n:sob: **HAS PERDIDO**\n\n:moneybag: **MONEDAS:** 0`)
          .setThumbnail(message.author.avatarURL())
          .setColor(`#95F5FC`)
          .setTimestamp();
        if(mensaje) message.channel.send(embed)
        collector.stop();
      }
      collector.stop();
    }
  });
  collector.on("end", async collected => {
    if(collected.size === 0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **Como no respondes ${message.author}, hago como que te fuiste, y el dinero para mi.**`).setColor(`#95F5FC`))
    if(aux === 1) return;
    collector.stop();
    return message.channel.send(new Discord.MessageEmbed().setDescription(`:broken_heart: **Como no respondes ${message.author}, hago como que te fuiste, y el dinero para mi.**`).setColor(`#95F5FC`))
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
