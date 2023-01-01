/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

const monstruos_maestria_1 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_maestria_1.json")
const monstruos_maestria_2 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_maestria_2.json")
const monstruos_maestria_3 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_maestria_3.json")
const monstruos_maestria_4 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_maestria_4.json")
const monstruos_maestria_5 = require("../../../../archivos/Documentos/Discord Hunter/nombres/monstruos_maestria_5.json")

const imagenes_maestria_1 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_maestria_1.json")
const imagenes_maestria_2 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_maestria_2.json")
const imagenes_maestria_3 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_maestria_3.json")
const imagenes_maestria_4 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_maestria_4.json")
const imagenes_maestria_5 = require("../../../../archivos/Documentos/Discord Hunter/imagenes/imagenes_maestria_5.json")

const regiones_maestria_dh = require("../../../../archivos/Documentos/Discord Hunter/regiones/maestria5-1.json")

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.ascension`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 de DH`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
    if(filas.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud**\n\nCúrate en la tienda`).setColor(`#9262FF`))
    if(filas.estado_ascension===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: Ya estás participando en una **ASCENSIÓN**.\n\nCuando acabes, podrás iniciar otra.").setColor(`#9262FF`))
    if(filas.prestigio<2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:cd: **Necesitas ascender a Prestigio 2 para realizar esta actividad**`).setColor(`#9262FF`))

    let bonificacion;
    if(message.guild.id===client.config.servidor_soporte) bonificacion = client.config.dh_plus;
    else bonificacion = 1;

    db_discordhunter.run(`UPDATE usuarios SET estado_ascension = 1, contrato_guadaña = 0 WHERE id = '${message.author.id}'`, function(err) {
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
    client.config.ronda_ascension[message.author.id] = 0;
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
    })
    message.channel.send(new Discord.MessageEmbed().setDescription(`:dizzy: **TU ASCENSIÓN DARÁ COMIENZO EN 15 SEGUNDOS. ¿ESTÁS PREPARADO PARA ENFRENTARTE A LOS DIOSES?**`).setColor(`#9262FF`))
    let fase_niveles = setInterval(async function() {
      let enemigo;
      let imagen;
      let vida_enemigo;
      let lugar;
      let random;

      if(client.config.ronda_ascension[message.author.id]===0) enemigo = `${monstruos_maestria_2[1]}`, imagen = `${imagenes_maestria_2[1]}`, vida_enemigo = 12500*(Math.pow(prestigio_1, 4)), lugar = regiones_maestria_dh[3];
      if(client.config.ronda_ascension[message.author.id]===1) enemigo = `${monstruos_maestria_2[2]}`, imagen = `${imagenes_maestria_2[2]}`, vida_enemigo = 12500*(Math.pow(prestigio_1, 4)), lugar = regiones_maestria_dh[3];
      if(client.config.ronda_ascension[message.author.id]===2) enemigo = `${monstruos_maestria_2[0]}`, imagen = `${imagenes_maestria_2[0]}`, vida_enemigo = 12500*(Math.pow(prestigio_1, 4)), lugar = regiones_maestria_dh[3];
      if(client.config.ronda_ascension[message.author.id]===3) enemigo = `${monstruos_maestria_1[3]}`, imagen = `${imagenes_maestria_1[3]}`, vida_enemigo = 15625*(Math.pow(prestigio_1, 4)), lugar = regiones_maestria_dh[4];
      if(client.config.ronda_ascension[message.author.id]===4) enemigo = `${monstruos_maestria_1[2]}`, imagen = `${imagenes_maestria_1[2]}`, vida_enemigo = 15625*(Math.pow(prestigio_1, 4)), lugar = regiones_maestria_dh[4];
      if(client.config.ronda_ascension[message.author.id]===5) enemigo = `${monstruos_maestria_1[0]}`, imagen = `${imagenes_maestria_1[0]}`, vida_enemigo = 18750*(Math.pow(prestigio_1, 4)), lugar = regiones_maestria_dh[4];
      if(client.config.ronda_ascension[message.author.id]===6) enemigo = `${monstruos_maestria_1[1]}`, imagen = `${imagenes_maestria_1[1]}`, vida_enemigo = 18750*(Math.pow(prestigio_1, 4)), lugar = regiones_maestria_dh[4];

      db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas4) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #12 de incursiones de 1 de DH`)
        coins_1 = filas4.coins;
        xp_1 = filas4.xp;
        nivel_1 = filas4.nivel;
        vida_1 = filas4.vida;
        arma_1 = filas4.arma;

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

          if(client.config.ronda_ascension[message.author.id]===0) golpeenemigo = (Math.round(Math.random()*(812.5-750))+750)*(Math.pow(prestigio_1, 4));
          if(client.config.ronda_ascension[message.author.id]===1) golpeenemigo = (Math.round(Math.random()*(812.5-750))+750)*(Math.pow(prestigio_1, 4));
          if(client.config.ronda_ascension[message.author.id]===2) golpeenemigo = (Math.round(Math.random()*(812.5-750))+750)*(Math.pow(prestigio_1, 4));
          if(client.config.ronda_ascension[message.author.id]===3) golpeenemigo = (Math.round(Math.random()*(850-812.5))+812.5)*(Math.pow(prestigio_1, 4));
          if(client.config.ronda_ascension[message.author.id]===4) golpeenemigo = (Math.round(Math.random()*(850-812.5))+812.5)*(Math.pow(prestigio_1, 4));
          if(client.config.ronda_ascension[message.author.id]===5) golpeenemigo = (Math.round(Math.random()*(875-850))+850)*(Math.pow(prestigio_1, 4));
          if(client.config.ronda_ascension[message.author.id]===6) golpeenemigo = (Math.round(Math.random()*(875-850))+850)*(Math.pow(prestigio_1, 4));

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
          if(client.config.ronda_ascension[message.author.id]===0 && arma_1===17){
            db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas6) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #15 de incursiones de 1 de DH`)
              if(filas6.contrato_guadaña===0){
                db_discordhunter.run(`UPDATE usuarios SET contrato_guadaña = 1 WHERE id = '${jugador_1}'`, function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #16 de incursiones de 1 de DH`)
                })
              }
            })
          }
          if(client.config.ronda_ascension[message.author.id]===1 && arma_1===18){
            db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas6) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #15 de incursiones de 1 de DH`)
              if(filas6.contrato_guadaña===1){
                db_discordhunter.run(`UPDATE usuarios SET contrato_guadaña = 2 WHERE id = '${jugador_1}'`, function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #16 de incursiones de 1 de DH`)
                })
              }
            })
          }
          let exploracioninfo = new Discord.MessageEmbed()
            .setDescription(`**:white_check_mark: ASCENSIÓN (NIVEL ${client.config.ronda_ascension[message.author.id]+1}) :crossed_swords:**`)
            .setColor("#61ff8e")
            .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
            .addField("**Lugar místico:** ", `${lugar}`, true)
            .addField("**Enemigo:** ", `${enemigo}`, true)
            .addField("**----------------------------------**", "---------------------------------")
            .addField('Jugador:', `<@${jugador_1}>`, true)
            .addField('Salud:', vida_1.toFixed(2), true)
            .addField('Escudo: ', escudo_1.toFixed(2), true)
            .setFooter("El jugador ha podido superar esta fase | Enhorabuena", client.user.displayAvatarURL())
            .setImage(imagen);
          message.channel.send(exploracioninfo)
          setTimeout(async function() {
            if(client.config.ronda_ascension[message.author.id]===2 && arma_1===19){
              db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas6) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #15 de incursiones de 1 de DH`)
                if(filas6.contrato_guadaña===2){
                  db_discordhunter.run(`UPDATE usuarios SET guadaña = ':white_check_mark:' WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #4 exploracion de DH`)
                    message.channel.send(new Discord.MessageEmbed().setAuthor(`¡HAS ENCONTRADO UN ARMA MÍSTICA!`, message.author.avatarURL()).setDescription(`**GUADAÑA DE CRONOS**`).setImage("https://cdn.discordapp.com/attachments/523268901719769088/793504510064590858/erww.png"))
                  })
                }
              })
            }
            if(client.config.ronda_ascension[message.author.id]<7) message.channel.send(`**:wc: TIEMPO DE DESCANSO :cyclone:\n\nTIENES 15 SEGUNDOS PARA REPONER TU SALUD**`)
            if(client.config.ronda_ascension[message.author.id]===7){
              message.channel.send(new Discord.MessageEmbed().setDescription(`**:confetti_ball: :confetti_ball: HAS VENCIDO A TODOS LOS DIOSES :confetti_ball: :confetti_ball:**\n\n Por ello, ahora en tus estadísticas aparecerá una copa **dorada** como muestra de tu hazaña (y una recompensa en experiencia y coins)\n\n:tada: **FELICIDADES** `))
              db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas6) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #15 de incursiones de 1 de DH`)
                db_discordhunter.run(`UPDATE usuarios SET coins = ${filas6.coins+(150000*bonificacion)}, xp = ${filas6.xp+(45000*bonificacion)}, logro_ascension = ':trophy:', estado_ascension = 0 WHERE id = '${jugador_1}'`, function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #16 de incursiones de 1 de DH`)
                })
              })
              return clearInterval(fase_niveles)
            }
          }, 1500);
        }
        else{
          let exploracioninfo = new Discord.MessageEmbed()
            .setDescription(`**:no_entry: ASCENSIÓN (ENEMIGO NIVEL ${client.config.ronda_ascension[message.author.id]+1}) :crossed_swords:**`)
            .setColor("#ff6161")
            .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
            .addField("**Lugar místico:** ", `${lugar}`, true)
            .addField("**Enemigo:** ", `${enemigo}`, true)
            .addField("**----------------------------------**", "---------------------------------")
            .addField('Jugador:', `<@${jugador_1}>`, true)
            .addField('Salud:', vida_1, true)
            .addField('Escudo: ', escudo_1, true)
            .setFooter("El jugador no ha podido superar esta fase | Una ascensión no es para débiles", client.user.displayAvatarURL())
            .setImage(imagen);
          message.channel.send(exploracioninfo);
          setTimeout(async function() {
            db_discordhunter.run(`UPDATE usuarios SET estado_ascension = 0 WHERE id = '${jugador_1}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #18 de incursiones de 1 de DH`)
            })
            message.channel.send(`**MEJOR SUERTE LA PROXIMA VEZ :pensive:**`)
            return clearInterval(fase_niveles)
          }, 1500);
        }
        client.config.ronda_ascension[message.author.id] += 1;
        db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${jugador_1}'`, (err, filas6) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #28 de incursiones de 1 de DH`)
          coins_1 = filas6.coins;
          xp_1 = filas6.xp;
          nivel_1 = filas6.nivel;
          vida_1 = filas6.vida;
          arma_1 = filas6.arma;
          recon_1 = filas6.logro_incursion;
        })
      })
    }, 15000)
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
