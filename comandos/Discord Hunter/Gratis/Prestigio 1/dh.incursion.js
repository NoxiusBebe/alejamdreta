/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

const monstruos_nivel_1 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_1.json")
const monstruos_nivel_2 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_2.json")
const monstruos_nivel_3 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_3.json")
const monstruos_nivel_4 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_4.json")
const monstruos_nivel_5 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_5.json")
const monstruos_nivel_6 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_6.json")
const monstruos_nivel_7 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_7.json")
const monstruos_nivel_8 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_8.json")
const monstruos_nivel_9 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_9.json")
const monstruos_nivel_10 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_nivel_10.json")

const imagenes_nivel_1 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_1.json")
const imagenes_nivel_2 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_2.json")
const imagenes_nivel_3 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_3.json")
const imagenes_nivel_4 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_4.json")
const imagenes_nivel_5 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_5.json")
const imagenes_nivel_6 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_6.json")
const imagenes_nivel_7 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_7.json")
const imagenes_nivel_8 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_8.json")
const imagenes_nivel_9 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_9.json")
const imagenes_nivel_10 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_nivel_10.json")

const regiones_niveles_dh = require("../../../../archivos/Documentos/Discord Hunter/regiones/niveles1-10.json")

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.incursion [opcion: 'normal' o 'heroica']`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let tipo = args.join(" ")
  if(tipo==="normal" || tipo==="Normal" || tipo==="NORMAL"){
    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 incursion de 3 de DH`)
      if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
      if(filas.estado_incursion===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: Ya estás participando en una **INCURSIÓN**.\n\nCuando acabes, podrás apuntarte a otra").setColor(`#9262FF`))
      if(filas.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud**\n\nCúrate en la tienda`).setColor(`#9262FF`))

      let bonificacion;
      if(message.guild.id===client.config.servidor_soporte) bonificacion = client.config.dh_plus;
      else bonificacion = 1;

      db_discordhunter.all(`SELECT * FROM incursiones`, (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 incursion de 3 de DH`)
        for(var i=1 ; i<100000 ; i++){
          for(var j=0 ; j<=filas2.length ; j++){
            if(filas2.length===0){
              db_discordhunter.run(`INSERT INTO incursiones(numero, id, jugador1) VALUES(1, '${message.guild.id}', '${message.author.id}')`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 incursion de 3 de DH`)
                db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 1 WHERE id = '${message.author.id}'`, function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #4 incursion de 3 de DH`)
                })
                client.config.ronda_incursion[message.author.id] = 0;
                client.config.identificador_incursion[message.author.id] = i;
                message.channel.send(`:rosette: INCURSION CREADA POR ${message.author}.\n\nTus dos compañeros deberan unirse en menos de 1 minuto usando el comando: **${client.config.prefijos[message.guild.id]}+dh.inc ${i}**`)
              })
              break;
            }
            if(filas2[j] && filas2[j].numero===i) i = i+1, j = -1;
            if(j===(filas2.length-1)){
              db_discordhunter.run(`INSERT INTO incursiones(numero, id, jugador1) VALUES(${i}, '${message.guild.id}', '${message.author.id}')`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #5 incursion de 3 de DH`)
                db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 1 WHERE id = '${message.author.id}'`, function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #6 incursion de 3 de DH`)
                })
                client.config.ronda_incursion[message.author.id] = 0;
                client.config.identificador_incursion[message.author.id] = i;
                message.channel.send(new Discord.MessageEmbed().setDescription(`:rosette: INCURSION CREADA POR ${message.author}.\n\nTus dos compañeros deberan unirse en menos de 1 minuto usando el comando: **${client.config.prefijos[message.guild.id]}+dh.inc ${i}**`))
              })
              break;
            }
          }
          break;
        }
      })

      setTimeout(async function() {
        db_discordhunter.get(`SELECT * FROM incursiones WHERE numero = ${client.config.identificador_incursion[message.author.id]}`, (err, filas2) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #7 incursion de 3 de DH`)
          let jugador_1 = filas2.jugador1;
          let jugador_2 = filas2.jugador2;
          let jugador_3 = filas2.jugador3;
          if(!jugador_1 || !jugador_2 || !jugador_3){
            message.channel.send(new Discord.MessageEmbed().setDescription(`:x: No se ha podido realizar la incursión por falta de jugadores (${message.author})`))
            db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 0 WHERE id = '${jugador_1}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #8 incursion de 3 de DH`)
            })
            db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 0 WHERE id = '${jugador_2}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #8 incursion de 3 de DH`)
            })
            db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 0 WHERE id = '${jugador_3}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #8 incursion de 3 de DH`)
            })
            db_discordhunter.run(`DELETE FROM incursiones WHERE numero = ${client.config.identificador_incursion[message.author.id]}`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #30 incursion de 3 de DH`)
            })
            return;
          }
          // ----------------------------------------------------------------------------------------------
          let coins_1;
          let xp_1;
          let nivel_1;
          let vida_1;
          let escudo_1;
          let arma_1;
          let prestigio_1;
          let recon_1;
          // ----------------------------------------------------------------------------------------------
          let coins_2;
          let xp_2;
          let nivel_2;
          let vida_2;
          let escudo_2;
          let arma_2;
          let prestigio_2;
          let recon_2;
          // ----------------------------------------------------------------------------------------------
          let coins_3;
          let xp_3;
          let nivel_3;
          let vida_3;
          let escudo_3;
          let arma_3;
          let prestigio_3;
          let recon_3;
          // ----------------------------------------------------------------------------------------------
          db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas4) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #9 incursion de 3 de DH`)
            coins_1 = filas4.coins;
            xp_1 = filas4.xp;
            nivel_1 = filas4.nivel;
            vida_1 = filas4.vida;
            escudo_1 = filas4.escudo;
            if(escudo_1===":x:") escudo_1 = 0;
            if(escudo_1==="Madera") escudo_1 = 100;
            if(escudo_1==="Acero") escudo_1 = 500;
            if(escudo_1==="Bronce") escudo_1 = 1000;
            if(escudo_1==="Plata") escudo_1 = 6000;
            if(escudo_1==="Oro") escudo_1 = 20000;
            if(escudo_1==="Platino") escudo_1 = 50000;
            if(escudo_1==="Diamante") escudo_1 = 100000;
            if(escudo_1==="Divina") escudo_1 = 500000;
            arma_1 = filas4.arma;
            prestigio_1 = filas4.prestigio;
            recon_1 = filas4.logro_incursion;
          })
          db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_2}'`, (err, filas4) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #10 incursion de 3 de DH`)
            coins_2 = filas4.coins;
            xp_2 = filas4.xp;
            nivel_2 = filas4.nivel;
            vida_2 = filas4.vida;
            escudo_2 = filas4.escudo;
            if(escudo_2===":x:") escudo_2 = 0;
            if(escudo_2==="Madera") escudo_2 = 100;
            if(escudo_2==="Acero") escudo_2 = 500;
            if(escudo_2==="Bronce") escudo_2 = 1000;
            if(escudo_2==="Plata") escudo_2 = 6000;
            if(escudo_2==="Oro") escudo_2 = 20000;
            if(escudo_2==="Platino") escudo_2 = 50000;
            if(escudo_2==="Diamante") escudo_2 = 100000;
            if(escudo_2==="Divina") escudo_2 = 500000;
            arma_2 = filas4.arma;
            prestigio_2 = filas4.prestigio;
            recon_2 = filas4.logro_incursion;
          })
          db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_3}'`, (err, filas4) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #11 incursion de 3 de DH`)
            coins_3 = filas4.coins;
            xp_3 = filas4.xp;
            nivel_3 = filas4.nivel;
            vida_3 = filas4.vida;
            escudo_3 = filas4.escudo;
            if(escudo_3===":x:") escudo_3 = 0;
            if(escudo_3==="Madera") escudo_3 = 100;
            if(escudo_3==="Acero") escudo_3 = 500;
            if(escudo_3==="Bronce") escudo_3 = 1000;
            if(escudo_3==="Plata") escudo_3 = 6000;
            if(escudo_3==="Oro") escudo_3 = 20000;
            if(escudo_3==="Platino") escudo_3 = 50000;
            if(escudo_3==="Diamante") escudo_3 = 100000;
            if(escudo_3==="Divina") escudo_3 = 500000;
            arma_3 = filas4.arma;
            prestigio_3 = filas4.prestigio;
            recon_3 = filas4.logro_incursion;
          })
          message.channel.send(new Discord.MessageEmbed().setDescription("**:crossed_swords: LA INCURSION DARÁ COMIENZO EN 15 SEGUNDOS. PREPARAOS . . .**"))
          let fase_niveles = setInterval(async function() {
            let enemigo;
            let imagen;
            let vida_enemigo;
            let lugar = `${regiones_niveles_dh[client.config.ronda_incursion[message.author.id]-1]}`;
            let random;

            if(client.config.ronda_incursion[message.author.id]===0) random = await Math.round(Math.random()*(monstruos_nivel_1.length-1)), enemigo = `${monstruos_nivel_1[random]}`, imagen = `${imagenes_nivel_1[random]}`, vida_enemigo = 500*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
            if(client.config.ronda_incursion[message.author.id]===1) random = await Math.round(Math.random()*(monstruos_nivel_2.length-1)), enemigo = `${monstruos_nivel_2[random]}`, imagen = `${imagenes_nivel_2[random]}`, vida_enemigo = 3000*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
            if(client.config.ronda_incursion[message.author.id]===2) random = await Math.round(Math.random()*(monstruos_nivel_3.length-1)), enemigo = `${monstruos_nivel_3[random]}`, imagen = `${imagenes_nivel_3[random]}`, vida_enemigo = 6500*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
            if(client.config.ronda_incursion[message.author.id]===3) random = await Math.round(Math.random()*(monstruos_nivel_4.length-1)), enemigo = `${monstruos_nivel_4[random]}`, imagen = `${imagenes_nivel_4[random]}`, vida_enemigo = 10500*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
            if(client.config.ronda_incursion[message.author.id]===4) random = await Math.round(Math.random()*(monstruos_nivel_5.length-1)), enemigo = `${monstruos_nivel_5[random]}`, imagen = `${imagenes_nivel_5[random]}`, vida_enemigo = 13000*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
            if(client.config.ronda_incursion[message.author.id]===5) random = await Math.round(Math.random()*(monstruos_nivel_6.length-1)), enemigo = `${monstruos_nivel_6[random]}`, imagen = `${imagenes_nivel_6[random]}`, vida_enemigo = 17500*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
            if(client.config.ronda_incursion[message.author.id]===6) random = await Math.round(Math.random()*(monstruos_nivel_7.length-1)), enemigo = `${monstruos_nivel_7[random]}`, imagen = `${imagenes_nivel_7[random]}`, vida_enemigo = 21000*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
            if(client.config.ronda_incursion[message.author.id]===7) random = await Math.round(Math.random()*(monstruos_nivel_8.length-1)), enemigo = `${monstruos_nivel_8[random]}`, imagen = `${imagenes_nivel_8[random]}`, vida_enemigo = 25000*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
            if(client.config.ronda_incursion[message.author.id]===8) random = await Math.round(Math.random()*(monstruos_nivel_9.length-1)), enemigo = `${monstruos_nivel_9[random]}`, imagen = `${imagenes_nivel_9[random]}`, vida_enemigo = 30000*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
            if(client.config.ronda_incursion[message.author.id]===9) random = await Math.round(Math.random()*(monstruos_nivel_10.length-1)), enemigo = `${monstruos_nivel_10[random]}`, imagen = `${imagenes_nivel_10[random]}`, vida_enemigo = 35000*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));

            db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas4) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #12 incursion de 3 de DH`)
              coins_1 = filas4.coins;
              xp_1 = filas4.xp;
              nivel_1 = filas4.nivel;
              vida_1 = filas4.vida;

              arma_1 = filas4.arma;
              recon_1 = filas4.logro_incursion;
              prestigio_1 = filas4.prestigio;
            })
            db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_2}'`, (err, filas4) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #13 incursion de 3 de DH`)
              coins_2 = filas4.coins;
              xp_2 = filas4.xp;
              nivel_2 = filas4.nivel;
              vida_2 = filas4.vida;

              arma_2 = filas4.arma;
              recon_2 = filas4.logro_incursion;
              prestigio_2 = filas4.prestigio;
            })
            db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_3}'`, (err, filas4) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #14 incursion de 3 de DH`)
              coins_3 = filas4.coins;
              xp_3 = filas4.xp;
              nivel_3 = filas4.nivel;
              vida_3 = filas4.vida;

              arma_3 = filas4.arma;
              recon_3 = filas4.logro_incursion;
              prestigio_3 = filas4.prestigio;
            })

            setTimeout(async function() {
              let golpe_1;
              let golpe_2;
              let golpe_3;
              let golpeenemigo;
              let xpganados;
              let coinsganados;
              let limitexp;
              let sumadexp;

              do{
                if(arma_1===1) golpe_1 = Math.round(Math.random()*(50-40))+40;
                if(arma_1===2) golpe_1 = Math.round(Math.random()*(70-60))+60;
                if(arma_1===3) golpe_1 = Math.round(Math.random()*(120-100))+100;
                if(arma_1===4) golpe_1 = Math.round(Math.random()*(190-140))+140;
                if(arma_1===5) golpe_1 = Math.round(Math.random()*(240-200))+200;
                if(arma_1===6) golpe_1 = Math.round(Math.random()*(340-280))+280;
                if(arma_1===7) golpe_1 = Math.round(Math.random()*(400-350))+350;
                if(arma_1===8) golpe_1 = Math.round(Math.random()*(480-420))+420;
                if(arma_1===9) golpe_1 = Math.round(Math.random()*(600-500))+500;
                if(arma_1===10) golpe_1 = Math.round(Math.random()*(750-650))+650;
                if(arma_1===11) golpe_1 = Math.round(Math.random()*(900-800))+800;
                if(arma_1===12) golpe_1 = Math.round(Math.random()*(1150-980))+980;
                if(arma_1===13) golpe_1 = Math.round(Math.random()*(2500-1500))+1500;
                if(arma_1===14) golpe_1 = Math.round(Math.random()*(4500-3000))+3000;
                if(arma_1===15) golpe_1 = Math.round(Math.random()*(7000-5000))+5000;
                if(arma_1===16) golpe_1 = Math.round(Math.random()*(7000-5000))+5000;
                if(arma_1===17) golpe_1 = Math.round(Math.random()*(11000-7000))+7000;
                if(arma_1===18) golpe_1 = Math.round(Math.random()*(11000-7000))+7000;
                if(arma_1===19) golpe_1 = Math.round(Math.random()*(11000-7000))+7000;
                if(arma_1===20) golpe_1 = Math.round(Math.random()*(15000-10000))+10000;
                if(arma_1===21) golpe_1 = Math.round(Math.random()*(18000-14000))+14000;
                if(arma_1===22) golpe_1 = Math.round(Math.random()*(25000-20000))+20000;
                if(arma_1===23) golpe_1 = Math.round(Math.random()*(30000-20000))+20000;
                if(arma_1===24) golpe_1 = Math.round(Math.random()*(40000-30000))+30000;
                if(arma_1===25) golpe_1 = Math.round(Math.random()*(50000-45000))+45000;

                if(arma_2===1) golpe_2 = Math.round(Math.random()*(50-40))+40;
                if(arma_2===2) golpe_2 = Math.round(Math.random()*(70-60))+60;
                if(arma_2===3) golpe_2 = Math.round(Math.random()*(120-100))+100;
                if(arma_2===4) golpe_2 = Math.round(Math.random()*(190-140))+140;
                if(arma_2===5) golpe_2 = Math.round(Math.random()*(240-200))+200;
                if(arma_2===6) golpe_2 = Math.round(Math.random()*(340-280))+280;
                if(arma_2===7) golpe_2 = Math.round(Math.random()*(400-350))+350;
                if(arma_2===8) golpe_2 = Math.round(Math.random()*(480-420))+420;
                if(arma_2===9) golpe_2 = Math.round(Math.random()*(600-500))+500;
                if(arma_2===10) golpe_2 = Math.round(Math.random()*(750-650))+650;
                if(arma_2===11) golpe_2 = Math.round(Math.random()*(900-800))+800;
                if(arma_2===12) golpe_2 = Math.round(Math.random()*(1150-980))+980;
                if(arma_2===13) golpe_2 = Math.round(Math.random()*(2500-1500))+1500;
                if(arma_2===14) golpe_2 = Math.round(Math.random()*(4500-3000))+3000;
                if(arma_2===15) golpe_2 = Math.round(Math.random()*(7000-5000))+5000;
                if(arma_2===16) golpe_2 = Math.round(Math.random()*(7000-5000))+5000;
                if(arma_2===17) golpe_2 = Math.round(Math.random()*(11000-7000))+7000;
                if(arma_2===18) golpe_2 = Math.round(Math.random()*(11000-7000))+7000;
                if(arma_2===19) golpe_2 = Math.round(Math.random()*(11000-7000))+7000;
                if(arma_2===20) golpe_2 = Math.round(Math.random()*(15000-10000))+10000;
                if(arma_2===21) golpe_2 = Math.round(Math.random()*(18000-14000))+14000;
                if(arma_2===22) golpe_2 = Math.round(Math.random()*(25000-20000))+20000;
                if(arma_2===23) golpe_2 = Math.round(Math.random()*(30000-20000))+20000;
                if(arma_2===24) golpe_2 = Math.round(Math.random()*(40000-30000))+30000;
                if(arma_2===25) golpe_2 = Math.round(Math.random()*(50000-45000))+45000;

                if(arma_3===1) golpe_3 = Math.round(Math.random()*(50-40))+40;
                if(arma_3===2) golpe_3 = Math.round(Math.random()*(70-60))+60;
                if(arma_3===3) golpe_3 = Math.round(Math.random()*(120-100))+100;
                if(arma_3===4) golpe_3 = Math.round(Math.random()*(190-140))+140;
                if(arma_3===5) golpe_3 = Math.round(Math.random()*(240-200))+200;
                if(arma_3===6) golpe_3 = Math.round(Math.random()*(340-280))+280;
                if(arma_3===7) golpe_3 = Math.round(Math.random()*(400-350))+350;
                if(arma_3===8) golpe_3 = Math.round(Math.random()*(480-420))+420;
                if(arma_3===9) golpe_3 = Math.round(Math.random()*(600-500))+500;
                if(arma_3===10) golpe_3 = Math.round(Math.random()*(750-650))+650;
                if(arma_3===11) golpe_3 = Math.round(Math.random()*(900-800))+800;
                if(arma_3===12) golpe_3 = Math.round(Math.random()*(1150-980))+980;
                if(arma_3===13) golpe_3 = Math.round(Math.random()*(2500-1500))+1500;
                if(arma_3===14) golpe_3 = Math.round(Math.random()*(4500-3000))+3000;
                if(arma_3===15) golpe_3 = Math.round(Math.random()*(7000-5000))+5000;
                if(arma_3===16) golpe_3 = Math.round(Math.random()*(7000-5000))+5000;
                if(arma_3===17) golpe_3 = Math.round(Math.random()*(11000-7000))+7000;
                if(arma_3===18) golpe_3 = Math.round(Math.random()*(11000-7000))+7000;
                if(arma_3===19) golpe_3 = Math.round(Math.random()*(11000-7000))+7000;
                if(arma_3===20) golpe_3 = Math.round(Math.random()*(15000-10000))+10000;
                if(arma_3===21) golpe_3 = Math.round(Math.random()*(18000-14000))+14000;
                if(arma_3===22) golpe_3 = Math.round(Math.random()*(25000-20000))+20000;
                if(arma_3===23) golpe_3 = Math.round(Math.random()*(30000-20000))+20000;
                if(arma_3===24) golpe_3 = Math.round(Math.random()*(40000-30000))+30000;
                if(arma_3===25) golpe_3 = Math.round(Math.random()*(50000-45000))+45000;

                if(client.config.ronda_incursion[message.author.id]===0) golpeenemigo = (Math.round(Math.random()*(200-100))+100)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
                if(client.config.ronda_incursion[message.author.id]===1) golpeenemigo = (Math.round(Math.random()*(400-200))+200)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
                if(client.config.ronda_incursion[message.author.id]===2) golpeenemigo = (Math.round(Math.random()*(600-400))+400)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
                if(client.config.ronda_incursion[message.author.id]===3) golpeenemigo = (Math.round(Math.random()*(800-600))+600)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
                if(client.config.ronda_incursion[message.author.id]===4) golpeenemigo = (Math.round(Math.random()*(1000-800))+800)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
                if(client.config.ronda_incursion[message.author.id]===5) golpeenemigo = (Math.round(Math.random()*(1200-1000))+1000)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
                if(client.config.ronda_incursion[message.author.id]===6) golpeenemigo = (Math.round(Math.random()*(1400-1200))+1200)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
                if(client.config.ronda_incursion[message.author.id]===7) golpeenemigo = (Math.round(Math.random()*(1600-1400))+1400)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
                if(client.config.ronda_incursion[message.author.id]===8) golpeenemigo = (Math.round(Math.random()*(1800-1600))+1600)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));
                if(client.config.ronda_incursion[message.author.id]===9) golpeenemigo = (Math.round(Math.random()*(2000-1800))+1800)*(Math.pow((prestigio_1+prestigio_2+prestigio_3)/3, 2));

                if(vida_1>0) vida_enemigo = vida_enemigo-golpe_1
                if(vida_2>0) vida_enemigo = vida_enemigo-golpe_2
                if(vida_3>0) vida_enemigo = vida_enemigo-golpe_3

                if(vida_enemigo<=0){
                  vida_enemigo = 0;
                  break;
                }

                if(escudo_1<=0){
                  vida_1 = vida_1-(golpeenemigo/3);
                  if(vida_1<0) vida_1 = 0
                }
                if(escudo_2<=0){
                  vida_2 = vida_2-(golpeenemigo/3);
                  if(vida_2<0) vida_2 = 0
                }
                if(escudo_3<=0){
                  vida_3 = vida_3-(golpeenemigo/3);
                  if(vida_3<0) vida_3 = 0
                }

                if(escudo_1>0){
                  escudo_1 = escudo_1-(golpeenemigo/3)
                  if(escudo_1<=0) escudo_1 = 0;
                }
                if(escudo_2>0){
                  escudo_2 = escudo_2-(golpeenemigo/3)
                  if(escudo_2<=0) escudo_2 = 0;
                }
                if(escudo_3>0){
                  escudo_3 = escudo_3-(golpeenemigo/3)
                  if(escudo_3<=0) escudo_3 = 0;
                }
              }while((vida_1>0 || vida_2>0 || vida_3>0) && vida_enemigo>0);

              if(vida_enemigo<=0){
                let exploracioninfo = new Discord.MessageEmbed()
                  .setDescription(`**:white_check_mark: INCURSION (ENEMIGO NIVEL ${client.config.ronda_incursion[message.author.id]+1}) :crossed_swords:**`)
                  .setColor("#61ff8e")
                  .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                  .addField("**Region explorada:** ", `${regiones_niveles_dh[client.config.ronda_incursion[message.author.id]]}`, true)
                  .addField("**Enemigo:** ", `${enemigo}`, true)
                  .addField("**Nivel enemigo:** ", `${client.config.ronda_incursion[message.author.id]+1}`, true)
                  .addField("**----------------------------------**", "---------------------------------")
                  .addField('Jugador:', `<@${jugador_1}>`, true)
                  .addField('Salud:', vida_1.toFixed(2), true)
                  .addField('Escudo: ', escudo_1.toFixed(2), true)
                  .addField("**----------------------------------**", "---------------------------------")
                  .addField('Jugador:', `<@${jugador_2}>`, true)
                  .addField('Salud:', vida_2.toFixed(2), true)
                  .addField('Escudo: ', escudo_2.toFixed(2), true)
                  .addField("**----------------------------------**", "---------------------------------")
                  .addField('Jugador:', `<@${jugador_3}>`, true)
                  .addField('Salud:', vida_3.toFixed(2), true)
                  .addField('Escudo: ', escudo_3.toFixed(2), true)
                  .setImage(imagen);
                message.channel.send(exploracioninfo)
                db_discordhunter.run(`UPDATE usuarios SET vida = ${vida_1} WHERE id = '${jugador_1}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #2 asalto de DH`)
                })
                db_discordhunter.run(`UPDATE usuarios SET vida = ${vida_2} WHERE id = '${jugador_2}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #2 asalto de DH`)
                })
                db_discordhunter.run(`UPDATE usuarios SET vida = ${vida_3} WHERE id = '${jugador_3}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #2 asalto de DH`)
                })
                setTimeout(async function() {
                  if(client.config.ronda_incursion[message.author.id]<10) message.channel.send(`**:wc: TIEMPO DE DESCANSO :cyclone:\n\nTENEIS 15 SEGUNDOS PARA REPONER VUESTRA**`)
                  if(client.config.ronda_incursion[message.author.id]===10)
                  {
                    message.channel.send(new Discord.MessageEmbed().setDescription(`**:confetti_ball: :confetti_ball: HABEIS COMPLETADO LA INCURSIÓN AL COMPLETO :confetti_ball: :confetti_ball:**\n\n Por ello, ahora en vuestras estadísticas aparecerá una copa **dorada** como muestra de vuestra hazaña (y una recompensa en experiencia y coins)\n\n:tada: **FELICIDADES** `))

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas4) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #15 incursion de 3 de DH`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas4.coins+(10000*bonificacion)}, xp = ${filas4.xp+(5000*bonificacion)}, logro_incursion = ':trophy:', estado_incursion = 0 WHERE id = '${jugador_1}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #16 incursion de 3 de DH`)
                      })
                    })

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_2}'`, (err, filas4) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #17 incursion de 3 de DH`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas4.coins+(10000*bonificacion)}, xp = ${filas4.xp+(5000*bonificacion)}, logro_incursion = ':trophy:', estado_incursion = 0 WHERE id = '${jugador_2}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #18 incursion de 3 de DH`)
                      })
                    })

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_3}'`, (err, filas4) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #19 incursion de 3 de DH`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas4.coins+(10000*bonificacion)}, xp = ${filas4.xp+(5000*bonificacion)}, logro_incursion = ':trophy:', estado_incursion = 0 WHERE id = '${jugador_3}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #20 incursion de 3 de DH`)
                      })
                    })

                    db_discordhunter.run(`DELETE FROM incursiones WHERE numero = ${client.config.identificador_incursion[message.author.id]}`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #21 incursion de 3 de DH`)
                      return clearInterval(fase_niveles)
                    })
                  }
                }, 1500);
              }
              else{
                let exploracioninfo = new Discord.MessageEmbed()
                  .setDescription(`**:no_entry: INCURSION (ENEMIGO NIVEL ${client.config.ronda_incursion[message.author.id]+1}) :crossed_swords:**`)
                  .setColor("#ff6161")
                  .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                  .addField("**Region explorada:** ", `${regiones_niveles_dh[client.config.ronda_incursion[message.author.id]]}`, true)
                  .addField("**Enemigo:** ", `${enemigo}`, true)
                  .addField("**Nivel enemigo:** ", `${client.config.ronda_incursion[message.author.id]+1}`, true)
                  .addField("**----------------------------------**", "---------------------------------")
                  .addField('Jugador:', `<@${jugador_1}>`, true)
                  .addField('Salud:', vida_1, true)
                  .addField('Escudo: ', escudo_1, true)
                  .addField("**----------------------------------**", "---------------------------------")
                  .addField('Jugador:', `<@${jugador_2}>`, true)
                  .addField('Salud:', vida_2, true)
                  .addField('Escudo: ', escudo_2, true)
                  .addField("**----------------------------------**", "---------------------------------")
                  .addField('Jugador:', `<@${jugador_3}>`, true)
                  .addField('Salud:', vida_3, true)
                  .addField('Escudo: ', escudo_3, true)
                  .setImage(imagen);
                message.channel.send(exploracioninfo);
                db_discordhunter.run(`UPDATE usuarios SET vida = ${vida_1} WHERE id = '${jugador_1}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #2 asalto de DH`)
                })
                db_discordhunter.run(`UPDATE usuarios SET vida = ${vida_2} WHERE id = '${jugador_2}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #2 asalto de DH`)
                })
                db_discordhunter.run(`UPDATE usuarios SET vida = ${vida_3} WHERE id = '${jugador_3}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #2 asalto de DH`)
                })
                setTimeout(async function() {
                  if(client.config.ronda_incursion[message.author.id]<7)
                  {
                    db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 0 WHERE id = '${jugador_1}'`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #22 incursion de 3 de DH`)
                    })
                    db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 0 WHERE id = '${jugador_2}'`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #23 incursion de 3 de DH`)
                    })
                    db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 0 WHERE id = '${jugador_3}'`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #24 incursion de 3 de DH`)
                    })
                    db_discordhunter.run(`DELETE FROM incursiones WHERE numero = ${client.config.identificador_incursion[message.author.id]}`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #25 incursion de 3 de DH`)
                      clearInterval(fase_niveles)
                    })
                    message.channel.send(`**MEJOR SUERTE LA PROXIMA VEZ :pensive:**`)
                    return clearInterval(fase_niveles)
                  }
                  if(client.config.ronda_incursion[message.author.id]===7 || client.config.ronda_incursion[message.author.id]===8)
                  {
                    message.channel.send(new Discord.MessageEmbed().setDescription(`:face_with_raised_eyebrow: **HABEIS LLEGADO LEJOS, POR LO QUE, AUN HABIENDO PERDIDO, SE OS CONCEDE LA MEDALLA DE BRONCE, Y UNA PEQUEÑA RECOMPENSA. MIRADLO EN VUESTRO ESTADO** :scroll:`))

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas4) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #25 incursion de 3 de DH`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas4.coins+(500*bonificacion)}, xp = ${filas4.xp+(1500*bonificacion)}, estado_incursion = 0 WHERE id = '${jugador_1}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #26 incursion de 3 de DH`)
                        if(recon_1===':x:')
                        {
                          db_discordhunter.run(`UPDATE usuarios SET logro_incursion = ':third_place:' WHERE id = '${jugador_1}'`, function(err) {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #27 incursion de 3 de DH`)
                          })
                        }
                      })
                    })

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_2}'`, (err, filas4) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #28 incursion de 3 de DH`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas4.coins+(500*bonificacion)}, xp = ${filas4.xp+(1500*bonificacion)}, estado_incursion = 0 WHERE id = '${jugador_2}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #29 incursion de 3 de DH`)
                        if(recon_2===':x:')
                        {
                          db_discordhunter.run(`UPDATE usuarios SET logro_incursion = ':third_place:' WHERE id = '${jugador_2}'`, function(err) {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #30 incursion de 3 de DH`)
                          })
                        }
                      })
                    })

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_3}'`, (err, filas4) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #31 incursion de 3 de DH`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas4.coins+(500*bonificacion)}, xp = ${filas4.xp+(1500*bonificacion)}, estado_incursion = 0 WHERE id = '${jugador_3}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #32 incursion de 3 de DH`)
                        if(recon_3===':x:')
                        {
                          db_discordhunter.run(`UPDATE usuarios SET logro_incursion = ':third_place:' WHERE id = '${jugador_3}'`, function(err) {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #33 incursion de 3 de DH`)
                          })
                        }
                      })

                      db_discordhunter.run(`DELETE FROM incursiones WHERE numero = ${client.config.identificador_incursion[message.author.id]}`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #34 incursion de 3 de DH`)
                        return clearInterval(fase_niveles)
                      })
                    })
                  }
                  if(client.config.ronda_incursion[message.author.id]===9 || client.config.ronda_incursion[message.author.id]===10)
                  {
                    message.channel.send(new Discord.MessageEmbed().setDescription(`:face_with_raised_eyebrow: **HABEIS LLEGADO MUY LEJOS, POR LO QUE, AUN HABIENDO PERDIDO, SE OS CONCEDE LA MEDALLA DE PLATA, Y UNA RECOMPENSA CUANTIOSA. MIRADLO EN VUESTRO ESTADO** :scroll:`))

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas4) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #35 incursion de 3 de DH`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas4.coins+(1500*bonificacion)}, xp = ${filas4.xp+(3000*bonificacion)}, estado_incursion = 0 WHERE id = '${jugador_1}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #36 incursion de 3 de DH`)
                        if(recon_1===':x:' || recon_1===':third_place:')
                        {
                          db_discordhunter.run(`UPDATE usuarios SET logro_incursion = ':second_place:' WHERE id = '${jugador_1}'`, function(err) {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #37 incursion de 3 de DH`)
                          })
                        }
                      })
                    })

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_2}'`, (err, filas4) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #38 incursion de 3 de DH`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas4.coins+(1500*bonificacion)}, xp = ${filas4.xp+(3000*bonificacion)}, estado_incursion = 0 WHERE id = '${jugador_2}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #39 incursion de 3 de DH`)
                        if(recon_2===':x:' || recon_2===':third_place:')
                        {
                          db_discordhunter.run(`UPDATE usuarios SET logro_incursion = ':second_place:' WHERE id = '${jugador_2}'`, function(err) {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #40 incursion de 3 de DH`)
                          })
                        }
                      })
                    })

                    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_3}'`, (err, filas4) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #41 incursion de 3 de DH`)
                      db_discordhunter.run(`UPDATE usuarios SET coins = ${filas4.coins+(1500*bonificacion)}, xp = ${filas4.xp+(3000*bonificacion)}, estado_incursion = 0 WHERE id = '${jugador_3}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #42 incursion de 3 de DH`)
                        if(recon_3===':x:' || recon_3===':third_place:')
                        {
                          db_discordhunter.run(`UPDATE usuarios SET logro_incursion = ':second_place:' WHERE id = '${jugador_3}'`, function(err) {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #43 incursion de 3 de DH`)
                          })
                        }
                      })

                      db_discordhunter.run(`DELETE FROM incursiones WHERE numero = ${client.config.identificador_incursion[message.author.id]}`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #44 incursion de 3 de DH`)
                        return clearInterval(fase_niveles)
                      })
                    })
                  }
                }, 1500);
              }
              client.config.ronda_incursion[message.author.id] += 1;
              db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas4) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #45 incursion de 3 de DH`)
                coins_1 = filas4.coins;
                xp_1 = filas4.xp;
                nivel_1 = filas4.nivel;
                vida_1 = filas4.vida;

                arma_1 = filas4.arma;
                recon_1 = filas4.logro_incursion;
                prestigio_1 = filas4.prestigio;
              })
              db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_2}'`, (err, filas4) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #46 incursion de 3 de DH`)
                coins_2 = filas4.coins;
                xp_2 = filas4.xp;
                nivel_2 = filas4.nivel;
                vida_2 = filas4.vida;

                arma_2 = filas4.arma;
                recon_2 = filas4.logro_incursion;
                prestigio_2 = filas4.prestigio;
              })
              db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_3}'`, (err, filas4) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #47 incursion de 3 de DH`)
                coins_3 = filas4.coins;
                xp_3 = filas4.xp;
                nivel_3 = filas4.nivel;
                vida_3 = filas4.vida;

                arma_3 = filas4.arma;
                recon_3 = filas4.logro_incursion;
                prestigio_3 = filas4.prestigio;
              })
            }, 1500)
          }, 15000)
        })
      }, 60000);
    })
  }
  else if(tipo==="heroica" || tipo==="Heroica" || tipo==="HEROICA" || tipo==="heroico" || tipo==="Heroico" || tipo==="HEROICO"){
    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 de incursiones de 1 de DH`)
      if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
      if(filas.estado_incursion===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: YA ESTÁS PARTICIPANDO EN UNA **INCURSIÓN**.\n\nCUANDO ACABES, PODRÁS APUNTARTE A OTRA.")).then(m => m.delete({ timeout: 7000}))
      if(filas.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud**\n\nCúrate en la tienda`).setColor(`#9262FF`))

      let bonificacion;
      if(message.guild.id===client.config.servidor_soporte) bonificacion = client.config.dh_plus;
      else bonificacion = 1;

      db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 1 WHERE id = '${message.author.id}'`, function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
      })

      let jugador_1 = message.author.id;
      // ----------------------------------------------------------------------------------------------
      let coins_1;
      let xp_1;
      let nivel_1;
      let vida_1;
      let escudo_1;
      let arma_1;
      let prestigio_1;
      let recon_1;
      client.config.ronda_incursion[message.author.id] = 0;
      // ----------------------------------------------------------------------------------------------
      db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas4) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #9 de incursiones de 1 de DH`)
        coins_1 = filas4.coins;
        xp_1 = filas4.xp;
        nivel_1 = filas4.nivel;
        vida_1 = filas4.vida;
        escudo_1 = filas4.escudo;
        if(escudo_1===":x:") escudo_1 = 0;
        if(escudo_1==="Madera") escudo_1 = 100;
        if(escudo_1==="Acero") escudo_1 = 500;
        if(escudo_1==="Bronce") escudo_1 = 1000;
        if(escudo_1==="Plata") escudo_1 = 6000;
        if(escudo_1==="Oro") escudo_1 = 20000;
        if(escudo_1==="Platino") escudo_1 = 50000;
        if(escudo_1==="Diamante") escudo_1 = 100000;
        if(escudo_1==="Divina") escudo_1 = 500000;
        arma_1 = filas4.arma;
        prestigio_1 = filas4.prestigio;
        recon_1 = filas4.logro_incursion;
      })
      message.channel.send(new Discord.MessageEmbed().setDescription("**:crossed_swords: LA INCURSIÓN HEROICA COMENZARÁ EN 15 SEGUNDOS. PREPÁRATE . . .**"))
      let fase_niveles = setInterval(async function() {
        let enemigo;
        let imagen;
        let vida_enemigo;
        let lugar = `${regiones_niveles_dh[client.config.ronda_incursion[message.author.id]-1]}`;
        let random;

        if(client.config.ronda_incursion[message.author.id]===0) random = await Math.round(Math.random()*(monstruos_nivel_1.length-1)), enemigo = `${monstruos_nivel_1[random]}`, imagen = `${imagenes_nivel_1[random]}`, vida_enemigo = 500*(Math.pow(prestigio_1, 2));
        if(client.config.ronda_incursion[message.author.id]===1) random = await Math.round(Math.random()*(monstruos_nivel_2.length-1)), enemigo = `${monstruos_nivel_2[random]}`, imagen = `${imagenes_nivel_2[random]}`, vida_enemigo = 3000*(Math.pow(prestigio_1, 2));
        if(client.config.ronda_incursion[message.author.id]===2) random = await Math.round(Math.random()*(monstruos_nivel_3.length-1)), enemigo = `${monstruos_nivel_3[random]}`, imagen = `${imagenes_nivel_3[random]}`, vida_enemigo = 6500*(Math.pow(prestigio_1, 2));
        if(client.config.ronda_incursion[message.author.id]===3) random = await Math.round(Math.random()*(monstruos_nivel_4.length-1)), enemigo = `${monstruos_nivel_4[random]}`, imagen = `${imagenes_nivel_4[random]}`, vida_enemigo = 10500*(Math.pow(prestigio_1, 2));
        if(client.config.ronda_incursion[message.author.id]===4) random = await Math.round(Math.random()*(monstruos_nivel_5.length-1)), enemigo = `${monstruos_nivel_5[random]}`, imagen = `${imagenes_nivel_5[random]}`, vida_enemigo = 13000*(Math.pow(prestigio_1, 2));
        if(client.config.ronda_incursion[message.author.id]===5) random = await Math.round(Math.random()*(monstruos_nivel_6.length-1)), enemigo = `${monstruos_nivel_6[random]}`, imagen = `${imagenes_nivel_6[random]}`, vida_enemigo = 17500*(Math.pow(prestigio_1, 2));
        if(client.config.ronda_incursion[message.author.id]===6) random = await Math.round(Math.random()*(monstruos_nivel_7.length-1)), enemigo = `${monstruos_nivel_7[random]}`, imagen = `${imagenes_nivel_7[random]}`, vida_enemigo = 21000*(Math.pow(prestigio_1, 2));
        if(client.config.ronda_incursion[message.author.id]===7) random = await Math.round(Math.random()*(monstruos_nivel_8.length-1)), enemigo = `${monstruos_nivel_8[random]}`, imagen = `${imagenes_nivel_8[random]}`, vida_enemigo = 25000*(Math.pow(prestigio_1, 2));
        if(client.config.ronda_incursion[message.author.id]===8) random = await Math.round(Math.random()*(monstruos_nivel_9.length-1)), enemigo = `${monstruos_nivel_9[random]}`, imagen = `${imagenes_nivel_9[random]}`, vida_enemigo = 30000*(Math.pow(prestigio_1, 2));
        if(client.config.ronda_incursion[message.author.id]===9) random = await Math.round(Math.random()*(monstruos_nivel_10.length-1)), enemigo = `${monstruos_nivel_10[random]}`, imagen = `${imagenes_nivel_10[random]}`, vida_enemigo = 35000*(Math.pow(prestigio_1, 2));

        db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas4) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #12 de incursiones de 1 de DH`)
          coins_1 = filas4.coins;
          xp_1 = filas4.xp;
          nivel_1 = filas4.nivel;
          vida_1 = filas4.vida;
          arma_1 = filas4.arma;
          recon_1 = filas4.logro_incursion_heroica;

          let golpe_1;
          let golpe_2;
          let golpe_3;
          let golpeenemigo;
          let xpganados;
          let coinsganados;
          let limitexp;
          let sumadexp;

          do{
            if(arma_1===1) golpe_1 = Math.round(Math.random()*(50-40))+40;
            if(arma_1===2) golpe_1 = Math.round(Math.random()*(70-60))+60;
            if(arma_1===3) golpe_1 = Math.round(Math.random()*(120-100))+100;
            if(arma_1===4) golpe_1 = Math.round(Math.random()*(190-140))+140;
            if(arma_1===5) golpe_1 = Math.round(Math.random()*(240-200))+200;
            if(arma_1===6) golpe_1 = Math.round(Math.random()*(340-280))+280;
            if(arma_1===7) golpe_1 = Math.round(Math.random()*(400-350))+350;
            if(arma_1===8) golpe_1 = Math.round(Math.random()*(480-420))+420;
            if(arma_1===9) golpe_1 = Math.round(Math.random()*(600-500))+500;
            if(arma_1===10) golpe_1 = Math.round(Math.random()*(750-650))+650;
            if(arma_1===11) golpe_1 = Math.round(Math.random()*(900-800))+800;
            if(arma_1===12) golpe_1 = Math.round(Math.random()*(1150-980))+980;
            if(arma_1===13) golpe_1 = Math.round(Math.random()*(2500-1500))+1500;
            if(arma_1===14) golpe_1 = Math.round(Math.random()*(4500-3000))+3000;
            if(arma_1===15) golpe_1 = Math.round(Math.random()*(7000-5000))+5000;
            if(arma_1===16) golpe_1 = Math.round(Math.random()*(7000-5000))+5000;
            if(arma_1===17) golpe_1 = Math.round(Math.random()*(11000-7000))+7000;
            if(arma_1===18) golpe_1 = Math.round(Math.random()*(11000-7000))+7000;
            if(arma_1===19) golpe_1 = Math.round(Math.random()*(11000-7000))+7000;
            if(arma_1===20) golpe_1 = Math.round(Math.random()*(15000-10000))+10000;
            if(arma_1===21) golpe_1 = Math.round(Math.random()*(18000-14000))+14000;
            if(arma_1===22) golpe_1 = Math.round(Math.random()*(25000-20000))+20000;
            if(arma_1===23) golpe_1 = Math.round(Math.random()*(30000-20000))+20000;
            if(arma_1===24) golpe_1 = Math.round(Math.random()*(40000-30000))+30000;
            if(arma_1===25) golpe_1 = Math.round(Math.random()*(50000-45000))+45000;

            if(client.config.ronda_incursion[message.author.id]===0) golpeenemigo = (Math.round(Math.random()*(200-100))+100)*(Math.pow(prestigio_1, 2));
            if(client.config.ronda_incursion[message.author.id]===1) golpeenemigo = (Math.round(Math.random()*(400-200))+200)*(Math.pow(prestigio_1, 2));
            if(client.config.ronda_incursion[message.author.id]===2) golpeenemigo = (Math.round(Math.random()*(600-400))+400)*(Math.pow(prestigio_1, 2));
            if(client.config.ronda_incursion[message.author.id]===3) golpeenemigo = (Math.round(Math.random()*(800-600))+600)*(Math.pow(prestigio_1, 2));
            if(client.config.ronda_incursion[message.author.id]===4) golpeenemigo = (Math.round(Math.random()*(1000-800))+800)*(Math.pow(prestigio_1, 2));
            if(client.config.ronda_incursion[message.author.id]===5) golpeenemigo = (Math.round(Math.random()*(1200-1000))+1000)*(Math.pow(prestigio_1, 2));
            if(client.config.ronda_incursion[message.author.id]===6) golpeenemigo = (Math.round(Math.random()*(1400-1200))+1200)*(Math.pow(prestigio_1, 2));
            if(client.config.ronda_incursion[message.author.id]===7) golpeenemigo = (Math.round(Math.random()*(1600-1400))+1400)*(Math.pow(prestigio_1, 2));
            if(client.config.ronda_incursion[message.author.id]===8) golpeenemigo = (Math.round(Math.random()*(1800-1600))+1600)*(Math.pow(prestigio_1, 2));
            if(client.config.ronda_incursion[message.author.id]===9) golpeenemigo = (Math.round(Math.random()*(2000-1800))+1800)*(Math.pow(prestigio_1, 2));

            if(vida_1>0) vida_enemigo = vida_enemigo-golpe_1

            if(vida_enemigo<=0){
              vida_enemigo = 0;
              break;
            }

            if(escudo_1<=0){
              vida_1 = vida_1-golpeenemigo;
              if(vida_1<0) vida_1 = 0
            }

            if(escudo_1>0){
              escudo_1 = escudo_1-golpeenemigo
              if(escudo_1<=0) escudo_1 = 0;
            }
          }
          while(vida_1>0 && vida_enemigo>0);
          if(vida_enemigo<=0){
            let exploracioninfo = new Discord.MessageEmbed()
              .setDescription(`**:white_check_mark: INCURSION HEROICA (ENEMIGO NIVEL ${client.config.ronda_incursion[message.author.id]+1}) :crossed_swords:**`)
              .setColor("#61ff8e")
              .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
              .addField("**Region explorada:** ", `${regiones_niveles_dh[client.config.ronda_incursion[message.author.id]]}`, true)
              .addField("**Enemigo:** ", `${enemigo}`, true)
              .addField("**Nivel enemigo:** ", `${client.config.ronda_incursion[message.author.id]+1}`, true)
              .addField("**----------------------------------**", "---------------------------------")
              .addField('Jugador:', `<@${jugador_1}>`, true)
              .addField('Salud:', vida_1.toFixed(2), true)
              .addField('Escudo: ', escudo_1.toFixed(2), true)
              .setImage(imagen);
            message.channel.send(exploracioninfo)
            db_discordhunter.run(`UPDATE usuarios SET vida = ${vida_1} WHERE id = '${jugador_1}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 asalto de DH`)
            })
            setTimeout(async function() {
              if(client.config.ronda_incursion[message.author.id]<10) message.channel.send(`**:wc: TIEMPO DE DESCANSO :cyclone:\n\nTIENES 15 SEGUNDOS PARA REPONER TU SALUD**`)
              if(client.config.ronda_incursion[message.author.id]===10){
                message.channel.send(new Discord.MessageEmbed().setDescription(`**:confetti_ball: :confetti_ball: HAS COMPLETADO LA INCURSIÓN HEROICA AL COMPLETO :confetti_ball: :confetti_ball:**\n\n Por ello, ahora en tus estadísticas aparecerá una copa **dorada** como muestra de tu hazaña (y una recompensa en experiencia y coins)\n\n:tada: **FELICIDADES** `))
                db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas6) => {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #15 de incursiones de 1 de DH`)
                  db_discordhunter.run(`UPDATE usuarios SET coins = ${filas6.coins+(50000*bonificacion)}, xp = ${filas6.xp+(15000*bonificacion)}, logro_incursion_heroica = ':trophy:', estado_incursion = 0 WHERE id = '${jugador_1}'`, function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #16 de incursiones de 1 de DH`)
                  })
                })
                return clearInterval(fase_niveles)
              }
            }, 1500);
          }
          else{
            let exploracioninfo = new Discord.MessageEmbed()
              .setDescription(`**:no_entry: INCURSION HEROICA (ENEMIGO NIVEL ${client.config.ronda_incursion[message.author.id]+1}) :crossed_swords:**`)
              .setColor("#ff6161")
              .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
              .addField("**Region explorada:** ", `${regiones_niveles_dh[client.config.ronda_incursion[message.author.id]]}`, true)
              .addField("**Enemigo:** ", `${enemigo}`, true)
              .addField("**Nivel enemigo:** ", `${client.config.ronda_incursion[message.author.id]+1}`, true)
              .addField("**----------------------------------**", "---------------------------------")
              .addField('Jugador:', `<@${jugador_1}>`, true)
              .addField('Salud:', vida_1, true)
              .addField('Escudo: ', escudo_1, true)
              .setImage(imagen);
            message.channel.send(exploracioninfo);
            db_discordhunter.run(`UPDATE usuarios SET vida = ${vida_1} WHERE id = '${jugador_1}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 asalto de DH`)
            })
            setTimeout(async function() {
              if(client.config.ronda_incursion[message.author.id]<7){
                db_discordhunter.run(`UPDATE usuarios SET estado_incursion = 0 WHERE id = '${jugador_1}'`, function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #18 de incursiones de 1 de DH`)
                })
                message.channel.send(`**MEJOR SUERTE LA PROXIMA VEZ :pensive:**`)
                return clearInterval(fase_niveles)
              }
              if(client.config.ronda_incursion[message.author.id]===7 || client.config.ronda_incursion[message.author.id]===8){
                message.channel.send(new Discord.MessageEmbed().setDescription(`:face_with_raised_eyebrow: **HAS LLEGADO LEJOS, POR LO QUE, AUN HABIENDO PERDIDO, SE TE CONCEDE LA MEDALLA DE BRONCE, Y UNA PEQUEÑA RECOMPENSA. MIRALO EN TU ESTADO** :scroll:`))
                db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas6) => {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #20 de incursiones de 1 de DH`)
                  db_discordhunter.run(`UPDATE usuarios SET coins = ${filas6.coins+(15000*bonificacion)}, xp = ${filas6.xp+(4500*bonificacion)}, estado_incursion = 0 WHERE id = '${jugador_1}'`, function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #21 de incursiones de 1 de DH`)
                    if(recon_1===':x:')
                    {
                      db_discordhunter.run(`UPDATE usuarios SET logro_incursion_heroica = ':third_place:' WHERE id = '${jugador_1}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #22 de incursiones de 1 de DH`)
                      })
                    }
                  })
                })
                return clearInterval(fase_niveles)
              }
              if(client.config.ronda_incursion[message.author.id]===9 || client.config.ronda_incursion[message.author.id]===10){
                message.channel.send(new Discord.MessageEmbed().setDescription(`:face_with_raised_eyebrow: **HAS LLEGADO MUY LEJOS, POR LO QUE, AUN HABIENDO PERDIDO, SE TE CONCEDE LA MEDALLA DE PLATA, Y UNA RECOMPENSA CUANTIOSA. MIRALO EN TU ESTADO** :scroll:`))
                db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas6) => {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #24 de incursiones de 1 de DH`)
                  db_discordhunter.run(`UPDATE usuarios SET coins = ${filas6.coins+(30000*bonificacion)}, xp = ${filas6.xp+(9000*bonificacion)}, estado_incursion = 0 WHERE id = '${jugador_1}'`, function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #25 de incursiones de 1 de DH`)
                    if(recon_1===':x:' || recon_1===':third_place:')
                    {
                      db_discordhunter.run(`UPDATE usuarios SET logro_incursion_heroica = ':second_place:' WHERE id = '${jugador_1}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #26 de incursiones de 1 de DH`)
                      })
                    }
                  })
                })
                return clearInterval(fase_niveles)
              }
            }, 1500);
          }
          client.config.ronda_incursion[message.author.id] += 1;
          db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas6) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #28 de incursiones de 1 de DH`)
            coins_1 = filas6.coins;
            xp_1 = filas6.xp;
            nivel_1 = filas6.nivel;
            vida_1 = filas6.vida;
            arma_1 = filas6.arma;
            recon_1 = filas6.logro_incursion_heroica;
            prestigio_1 = filas4.prestigio;
          })
        })
      }, 15000)
    })
  }
  else return message.channel.send(new Discord.MessageEmbed().setDescription(":woozy_face: **DEBES ELEGIR UN MODO DE INCURSIÓN VÁLIDO.**\n\n**Tipos:**\n:one: `"+client.config.prefijos[message.guild.id]+"dh.incursion normal`\n:two: `"+client.config.prefijos[message.guild.id]+"dh.incursion heroica`")).then(m => m.delete({ timeout: 10000}))
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
