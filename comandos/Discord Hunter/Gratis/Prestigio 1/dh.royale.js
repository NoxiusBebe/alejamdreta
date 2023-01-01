/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

const frases_ataque_dh = require("../../../../archivos/Documentos/Discord Hunter/battleroyale/ataque.json")
const frases_muerte_dh = require("../../../../archivos/Documentos/Discord Hunter/battleroyale/muerte.json")
const frases_botiquin_dh = require("../../../../archivos/Documentos/Discord Hunter/battleroyale/botiquin.json")
const frases_armas_dh = require("../../../../archivos/Documentos/Discord Hunter/battleroyale/armas.json")

const nombres_armas_dh = require("../../../../archivos/Documentos/Discord Hunter/armas/armas.json")

let stop_farmear = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.royale`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};

  let conv_permisos = require(`../../../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)


  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#9262FF`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#9262FF`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 battleroyale de DH`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
    if(client.config.estado_server_royale[message.guild.id]===1 || client.config.estado_server_royale[message.guild.id]===2) return message.channel.send(`:name_badge: **${message.author}, DISCORD HUNTER ROYALE YA ESTÁ ACTIVO EN EL SERVIDOR.**\n\nPrueba a unirte usando`+"*`"+client.config.prefijos[message.guild.id]+"+dh.royale`*")
    if(filas.estado_royale === 1) return message.channel.send(new Discord.MessageEmbed().setDescription(`:name_badge: ${message.author}, ya estás en un Discord Hunter Royale.\n\nCuando acabes, podrás participar en otro.`).setColor(`#9262FF`))
    client.config.estado_server_royale[message.guild.id] = 1;

    let bonificacion;
    if(message.guild.id!='378197663629443083') bonificacion = 1;
    else bonificacion = 4;

    let embed_royale;
    let usuarios_royale = {};
    let vivencia_royale = {};
    let vida_royale_usuario = {};
    let escudo_royale_usuario = {};
    let arma_royale_usuario = {};

    db_discordhunter.run(`INSERT INTO battleroyale(id, contador, usuario_1) VALUES('${message.guild.id}', 1, '${message.author.id}')`, async function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 battleroyale de DH`)
      db_discordhunter.run(`UPDATE usuarios SET estado_royale = 1 WHERE id = '${message.author.id}'`, async function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #3 battleroyale de DH`)
        embed_royale = await message.channel.send(new Discord.MessageEmbed().setDescription(`:fire: **DISCORD HUNTER ROYALE** :fire:\n\n Modo Battle Royale activado. El funcionamiento es el siguiente:\n\n- Participantes: mínimo 10 jugadores, y máximo 24 jugadores\n- Todos comienzan con 10.000 de vida y ningun arma\n- Las distintas novedades y acciones se mostrarán en el mismo mensaje (Panel de Espectadores)\n- Solo habrá un ganador, ¿quién será?\n\n:warning: Teneis 2 minutos para entrar en la partida usando **${client.config.prefijos[message.guild.id]}+dh.royale**\n\n **MUCHA SUERTE, Y QUE LA FUERZA OS ACOMPAÑE :raised_hand:**`).setColor(`#9262FF`))
        client.config.estado_server_royale[message.guild.id] = 1;
      });
    })

    setTimeout(async function() {
      db_discordhunter.get(`SELECT * FROM battleroyale WHERE id = '${message.guild.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #4 battleroyale de DH`)
        if(filas2.contador<10){
          client.config.estado_server_royale[message.guild.id] = null;
          for(var i=0 ; i<filas2.contador ; i++) await cancelar_royale(filas2[`usuario_${i+1}`]);
          db_discordhunter.run(`DELETE FROM battleroyale WHERE id = '${message.guild.id}'`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #803`)
          })
          return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Discord Hunter Royale ha sido cancelado por falta de jugadores** :x:`).setColor(`#9262FF`))
        }
        else{
          client.config.estado_server_royale[message.guild.id] = 2;
          for(var i=1 ; i<=24 ; i++){
            if(filas2[`usuario_${i}`]){
              usuarios_royale[i-1] = `${filas2[`usuario_${i}`]}`;
              vivencia_royale[i-1] = ":white_check_mark:";
              vida_royale_usuario[i-1] = 10000;
              escudo_royale_usuario[i-1] = 0;
              arma_royale_usuario[i-1] = 1;
            }
            else{
              usuarios_royale[i-1] = "-----";
              vivencia_royale[i-1] = "-----";
            }
          }
          let edicion_royale = new Discord.MessageEmbed()
            .setTitle(":fire: **DISCORD HUNTER ROYALE** :fire:\n------------------------------------------")
            .setAuthor(`Cargando personajes y sesion ...`, `https://i.pinimg.com/originals/c5/d4/53/c5d45320064d9fd81d0d433056e8bb0c.gif`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`:hourglass: **INICIANDO PARTIDA...** :hourglass_flowing_sand:`)
            .addField("**----------------------------------**", "---------------------------------")
            .addField(`**Jugador:**`, `${vivencia_royale[0]} <@${usuarios_royale[0]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[1]} <@${usuarios_royale[1]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[2]} <@${usuarios_royale[2]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[3]} <@${usuarios_royale[3]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[4]} <@${usuarios_royale[4]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[5]} <@${usuarios_royale[5]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[6]} <@${usuarios_royale[6]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[7]} <@${usuarios_royale[7]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[8]} <@${usuarios_royale[8]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[9]} <@${usuarios_royale[9]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[10]} <@${usuarios_royale[10]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[11]} <@${usuarios_royale[11]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[12]} <@${usuarios_royale[12]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[13]} <@${usuarios_royale[13]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[14]} <@${usuarios_royale[14]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[15]} <@${usuarios_royale[15]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[16]} <@${usuarios_royale[16]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[17]} <@${usuarios_royale[17]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[18]} <@${usuarios_royale[18]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[19]} <@${usuarios_royale[19]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[20]} <@${usuarios_royale[20]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[21]} <@${usuarios_royale[21]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[22]} <@${usuarios_royale[22]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[23]} <@${usuarios_royale[23]}>`, true)
            .setColor('#ff9b3d');
          embed_royale = await message.channel.send(edicion_royale)

          let numero_random;
          let atacante_royale;
          let victima_royale;
          let frase_lobby;
          let ayuda_royale;
          let contador_royale = filas2.contador;

          // AQUI VA EL PROGRESO DEL BATTLE ROYALE
          let fases_partida = setInterval(async function() {
            ayuda_royale = Math.round(Math.random()*(9-0))+0;
            numero_random = Math.round(Math.random()*(10-1))+1;
            if(numero_random === 1 || numero_random === 2  || numero_random === 3  || numero_random === 4  || numero_random === 5){
              //JUGADOR CONTRA JUGADOR
              do{
                atacante_royale = Math.round(Math.random()*(filas2.contador-1))+1;
                victima_royale = Math.round(Math.random()*(filas2.contador-1))+1;
              }while((vivencia_royale[atacante_royale-1] != ":white_check_mark:") || (vivencia_royale[victima_royale-1] != ":white_check_mark:") || (atacante_royale === victima_royale))

              let vida_atacante = vida_royale_usuario[atacante_royale-1]
              let escudo_atacante = escudo_royale_usuario[atacante_royale-1]
              let arma_atacante;
              if(!arma_royale_usuario[atacante_royale-1] || arma_royale_usuario[atacante_royale-1]<0) arma_atacante = -1;
              else arma_atacante = arma_royale_usuario[atacante_royale-1]

              let vida_victima = vida_royale_usuario[victima_royale-1]
              let escudo_victima = escudo_royale_usuario[victima_royale-1]

              if(arma_atacante===-1) numero_random = Math.round(Math.random()*(30-20))+20;
              if(arma_atacante===0) numero_random = Math.round(Math.random()*(50-40))+40;
              if(arma_atacante===1) numero_random = Math.round(Math.random()*(70-60))+60;
              if(arma_atacante===2) numero_random = Math.round(Math.random()*(120-100))+100;
              if(arma_atacante===3) numero_random = Math.round(Math.random()*(190-140))+140;
              if(arma_atacante===4) numero_random = Math.round(Math.random()*(240-200))+200;
              if(arma_atacante===5) numero_random = Math.round(Math.random()*(340-280))+280;
              if(arma_atacante===6) numero_random = Math.round(Math.random()*(400-350))+350;
              if(arma_atacante===7) numero_random = Math.round(Math.random()*(480-420))+420;
              if(arma_atacante===8) numero_random = Math.round(Math.random()*(600-500))+500;
              if(arma_atacante===9) numero_random = Math.round(Math.random()*(750-650))+650;
              if(arma_atacante===10) numero_random = Math.round(Math.random()*(900-800))+800;
              if(arma_atacante===11) numero_random = Math.round(Math.random()*(1150-980))+980;
              if(arma_atacante===12) numero_random = Math.round(Math.random()*(2500-1500))+1500;
              if(arma_atacante===13) numero_random = Math.round(Math.random()*(4500-3000))+3000;
              if(arma_atacante===14) numero_random = Math.round(Math.random()*(7000-5000))+5000;
              if(arma_atacante===15) numero_random = Math.round(Math.random()*(7000-5000))+5000;
              if(arma_atacante===16) numero_random = Math.round(Math.random()*(11000-7000))+7000;
              if(arma_atacante===17) numero_random = Math.round(Math.random()*(11000-7000))+7000;
              if(arma_atacante===18) numero_random = Math.round(Math.random()*(11000-7000))+7000;
              if(arma_atacante===19) numero_random = Math.round(Math.random()*(15000-10000))+10000;

              if(escudo_victima<=0){
                escudo_royale_usuario[victima_royale-1] = 0;
                vida_victima = vida_victima-numero_random;
                vida_royale_usuario[victima_royale-1] = vida_victima
                frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_ataque_dh[ayuda_royale]} <@${usuarios_royale[victima_royale-1]}>. Le ha quitado ${numero_random} de vida.`;
              }

              if(escudo_victima>0){
                escudo_victima = escudo_victima-numero_random
                if(escudo_victima<=0) escudo_victima = 0;
                escudo_royale_usuario[victima_royale-1] = escudo_victima;
                frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_ataque_dh[ayuda_royale]} <@${usuarios_royale[victima_royale-1]}>. Le ha quitado ${numero_random} de escudo.`;
              }

              if(vida_victima<=0){
                vida_royale_usuario[victima_royale-1] = 0;
                frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_muerte_dh[ayuda_royale]} <@${usuarios_royale[victima_royale-1]}>.`;
                vivencia_royale[victima_royale-1] = `:boom:`;
                client.config.estado_royale[usuarios_royale[victima_royale-1]] = null;
                contador_royale = contador_royale-1;
                db_discordhunter.run(`UPDATE usuarios SET client.config.estado_royale = 0 WHERE id = '${usuarios_royale[victima_royale-1]}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #-210`)
                })
                if(contador_royale===1){
                  clearInterval(fases_partida);
                  setTimeout(async function() {
                    frase_lobby = `:trophy: <@${usuarios_royale[atacante_royale-1]}> HA GANADO ESTE BATTLE ROYALE :trophy:\nSe te sumarán tus recompensas inmediatamente. Gracias por jugar :smile:`;
                    edicion_royale = new Discord.MessageEmbed()
                    .setTitle(":fire: **DISCORD HUNTER ROYALE** :fire:\n------------------------------------------")
                    .setAuthor(`PARTIDA FINALIZADA`, `http://blubettingpro.com/wp-content/uploads/2018/09/checkmark-2.gif`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(frase_lobby)
                    .addField("**----------------------------------**", "---------------------------------")
                    .addField(`**Jugador:**`, `${vivencia_royale[0]} <@${usuarios_royale[0]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[1]} <@${usuarios_royale[1]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[2]} <@${usuarios_royale[2]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[3]} <@${usuarios_royale[3]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[4]} <@${usuarios_royale[4]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[5]} <@${usuarios_royale[5]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[6]} <@${usuarios_royale[6]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[7]} <@${usuarios_royale[7]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[8]} <@${usuarios_royale[8]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[9]} <@${usuarios_royale[9]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[10]} <@${usuarios_royale[10]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[11]} <@${usuarios_royale[11]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[12]} <@${usuarios_royale[12]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[13]} <@${usuarios_royale[13]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[14]} <@${usuarios_royale[14]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[15]} <@${usuarios_royale[15]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[16]} <@${usuarios_royale[16]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[17]} <@${usuarios_royale[17]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[18]} <@${usuarios_royale[18]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[19]} <@${usuarios_royale[19]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[20]} <@${usuarios_royale[20]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[21]} <@${usuarios_royale[21]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[22]} <@${usuarios_royale[22]}>`, true)
                    .addField(`**Jugador:**`, `${vivencia_royale[23]} <@${usuarios_royale[23]}>`, true)
                    .setColor('#c8ff3d');
                    embed_royale.edit(edicion_royale);
                    client.config.estado_royale[usuarios_royale[atacante_royale-1]] = null;
                    client.config.estado_server_royale[message.guild.id] = null;

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${usuarios_royale[atacante_royale-1]}'`, async (err, filas3) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #510`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas3.coins+(100000*filas2.contador*bonificacion)}, xp = ${filas3.xp+(100000*filas2.contador*bonificacion)}, estado_royale = 0 WHERE id = '${usuarios_royale[atacante_royale-1]}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #511`)
                        if(usuarios_royale[atacante_royale-1]===filas2.usuario_1 && filas3.lanza===":x:"){
                          db_discordhunter.run(`UPDATE usuarios SET lanza = ':white_check_mark:' WHERE id = '${message.author.id}'`, async function(err) {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
                            message.channel.send(new Discord.MessageEmbed().setAuthor(`¡HAS ENCONTRADO UN ARMA MÍSTICA!`, message.author.avatarURL()).setDescription(`**LANZA DE ARES**`).setImage("https://cdn.discordapp.com/attachments/523268901719769088/793504510064590858/erww.png"))
                          })
                        }
                        db_discordhunter.run(`DELETE FROM battleroyale WHERE id = '${message.guild.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #803`)
                          for(var i=0 ; i<filas2.contador ; i++) await cancelar_royale(filas2[`usuario_${i+1}`]);
                        })
                      })
                    })
                  }, 10000);
                }
              }
            }
            else if(numero_random === 6 || numero_random === 7  || numero_random === 8  || numero_random === 9){
              //JUGADOR ENCUENTRA ARMA
              numero_random = Math.round(Math.random()*(94));
              do{ atacante_royale = Math.round(Math.random()*(filas2.contador-1))+1; }while(vivencia_royale[atacante_royale-1] != ":white_check_mark:")

              if(!arma_royale_usuario[atacante_royale-1]) arma_royale_usuario[atacante_royale-1] = -1
              let arma_util = arma_royale_usuario[atacante_royale-1]

              if(numero_random>=0 && numero_random<5){
                if(arma_util<=0){
                  arma_royale_usuario[atacante_royale-1] = 0;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Vara.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró una Vara, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=5 && numero_random<10){
                if(arma_util<=1){
                  arma_royale_usuario[atacante_royale-1] = 1;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Arco.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró un Arco, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=10 && numero_random<15){
                if(arma_util<=2){
                  arma_royale_usuario[atacante_royale-1] = 2;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Dagas.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró unas Dagas, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=15 && numero_random<20){
                if(arma_util<=3){
                  arma_royale_usuario[atacante_royale-1] = 3;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Martillo.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró un Martillo, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=20 && numero_random<25){
                if(arma_util<=4){
                  arma_royale_usuario[atacante_royale-1] = 4;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Ballesta.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró una Ballesta, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=25 && numero_random<30){
                if(arma_util<=5){
                  arma_royale_usuario[atacante_royale-1] = 5;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Hacha.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró un Hacha, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=30 && numero_random<35){
                if(arma_util<=6){
                  arma_royale_usuario[atacante_royale-1] = 6;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Espada.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró una Espada, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=35 && numero_random<40){
                if(arma_util<=7){
                  arma_royale_usuario[atacante_royale-1] = 7;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Sable.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró un Sable, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=40 && numero_random<45){
                if(arma_util<=8){
                  arma_royale_usuario[atacante_royale-1] = 8;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Katana.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró una Katana, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=45 && numero_random<50){
                if(arma_util<=9){
                  arma_royale_usuario[atacante_royale-1] = 9;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Magia.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> pudo aprender a usar la Magia, pero su arma actual es mucho mejor, y no lo hizo.`;
              }
              if(numero_random>=50 && numero_random<55){
                if(arma_util<=10){
                  arma_royale_usuario[atacante_royale-1] = 10;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Báculo.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró un Báculo, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=55 && numero_random<60){
                if(arma_util<=11){
                  arma_royale_usuario[atacante_royale-1] = 11;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Poderes Místicos.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> pudo aprender a usar los Poderes Místicos, pero su arma actual es mucho mejor, y no lo hizo.`;
              }
              if(numero_random>=60 && numero_random<65){
                if(arma_util<=12){
                  arma_royale_usuario[atacante_royale-1] = 12;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Poderes Oscuros.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> pudo aprender a usar los Poderes Oscuros, pero su arma actual es mucho mejor, y no lo hizo.`;
              }
              if(numero_random>=65 && numero_random<70){
                if(arma_util<=13){
                  arma_royale_usuario[atacante_royale-1] = 13;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Espada de Excalibur.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró la Espada de Excalibur, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=70 && numero_random<75){
                if(arma_util<=14){
                  arma_royale_usuario[atacante_royale-1] = 14;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Lanza de Ares.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró la Lanza de Ares, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=75 && numero_random<80){
                if(arma_util<=15){
                  arma_royale_usuario[atacante_royale-1] = 15;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Tridente de Poseidon.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró el Tridente de Poseidon, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=80 && numero_random<85){
                if(arma_util<=16){
                  arma_royale_usuario[atacante_royale-1] = 16;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Casco de Hades.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró el Casco de Hades, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=85 && numero_random<90){
                if(arma_util<=17){
                  arma_royale_usuario[atacante_royale-1] = 17;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Rayos de Zeus.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> pudo aprender a usar los Rayos de Zeus, pero su arma actual es mucho mejor, y no lo hizo.`;
              }
              if(numero_random>=90 && numero_random<95){
                if(arma_util<=18){
                  arma_royale_usuario[atacante_royale-1] = 18;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Guadaña de Cronos.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró la Guadaña de Cronos, pero su arma actual es mucho mejor, y la dejó.`;
              }
              if(numero_random>=95){
                if(arma_util<=19){
                  arma_royale_usuario[atacante_royale-1] = 19;
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_armas_dh[ayuda_royale]} Guadaña de Cronos.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró la Guadaña de Cronos, pero su arma actual es mucho mejor, y la dejó.`;
              }
            }
            else if(numero_random === 10){
              //JUGADOR ENCUENTRA POCION
              numero_random = Math.round(Math.random()*(2-0))+0;
              do{ atacante_royale = Math.round(Math.random()*(filas2.contador-1))+1; }while(vivencia_royale[atacante_royale-1] != ":white_check_mark:")

              let vida_util = vida_royale_usuario[atacante_royale-1]
              let escudo_util = escudo_royale_usuario[atacante_royale-1]

              if(numero_random===0 || numero_random===2){
                if(vida_util <= 10000){
                  vida_royale_usuario[atacante_royale-1] = 10000
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_botiquin_dh[ayuda_royale]} pócima de vida.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró una Cura, pero no necesita recuperar salud, y la dejó.`;
              }
              if(numero_random===1){
                if(escudo_util <= 5000){
                  escudo_royale_usuario[atacante_royale-1] = 5000
                  frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> ${frases_botiquin_dh[ayuda_royale]} pócima de escudo.`;
                }
                else frase_lobby = `<@${usuarios_royale[atacante_royale-1]}> encontró una Armadura, pero no necesita mas escudo, y la dejó.`;
              }
            }

            edicion_royale = new Discord.MessageEmbed()
            .setTitle(":fire: **DISCORD HUNTER ROYALE** :fire:\n------------------------------------------")
            .setAuthor(`Partida en progreso ...`, `https://i.pinimg.com/originals/9e/7a/fd/9e7afda70cde1b6bd73da5dab17a7406.gif`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(frase_lobby)
            .addField("**----------------------------------**", "---------------------------------")
            .addField(`**Jugador:**`, `${vivencia_royale[0]} <@${usuarios_royale[0]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[1]} <@${usuarios_royale[1]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[2]} <@${usuarios_royale[2]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[3]} <@${usuarios_royale[3]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[4]} <@${usuarios_royale[4]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[5]} <@${usuarios_royale[5]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[6]} <@${usuarios_royale[6]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[7]} <@${usuarios_royale[7]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[8]} <@${usuarios_royale[8]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[9]} <@${usuarios_royale[9]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[10]} <@${usuarios_royale[10]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[11]} <@${usuarios_royale[11]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[12]} <@${usuarios_royale[12]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[13]} <@${usuarios_royale[13]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[14]} <@${usuarios_royale[14]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[15]} <@${usuarios_royale[15]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[16]} <@${usuarios_royale[16]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[17]} <@${usuarios_royale[17]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[18]} <@${usuarios_royale[18]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[19]} <@${usuarios_royale[19]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[20]} <@${usuarios_royale[20]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[21]} <@${usuarios_royale[21]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[22]} <@${usuarios_royale[22]}>`, true)
            .addField(`**Jugador:**`, `${vivencia_royale[23]} <@${usuarios_royale[23]}>`, true)
            .setColor('#ff9b3d');
            embed_royale.edit(edicion_royale);
          }, 10000)
        }
      })
    }, 123000);
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

function cancelar_royale(usuario){
  db_discordhunter.run(`UPDATE usuarios SET estado_royale = 0 WHERE id = '${usuario}'`, async function(err) {
    if(err) return console.log(err.message + ` ERROR #1 cancelando battleroyale con ${usuario}`)
  })
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
