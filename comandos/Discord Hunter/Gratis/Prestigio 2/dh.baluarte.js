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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.baluarte`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 exploracion de DH`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
    if(filas.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud**\n\nCúrate en la tienda`).setColor(`#9262FF`))
    if(filas.prestigio<2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:cd: **Necesitas ascender a Prestigio 2 para realizar esta actividad**`).setColor(`#9262FF`))

    if(stop_farmear.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 3 segundos** ⛔`).setColor(`#9262FF`))
    stop_farmear.add(message.author.id);
    setTimeout(() => {
      stop_farmear.delete(message.author.id);
    }, 3000);

    let bonificacion;
    if(message.guild.id===client.config.servidor_soporte) bonificacion = client.config.dh_plus;
    else bonificacion = 1;

    // DATOS DEL JUGADOR
    let vida = filas.vida;
    let escudo = filas.escudo
    if(escudo===":x:") escudo = 0;
    if(escudo==="Madera") escudo = 100;
    if(escudo==="Acero") escudo = 500;
    if(escudo==="Bronce") escudo = 1000;
    if(escudo==="Plata") escudo = 6000;
    if(escudo==="Oro") escudo = 20000;
    if(escudo==="Platino") escudo = 50000;
    if(escudo==="Diamante") escudo = 100000;
    if(escudo==="Divina") escudo = 500000;

    let arma = filas.arma;
    let golpe;

    let nivel_inicial = filas.nivel;
    let nivel = filas.nivel;
    let xp = filas.xp;
    let coins = filas.coins;
    let prestigio = filas.prestigio;

    // DATOS DEL ENEMIGO
    let contador = 0;
    if(nivel>=50000) contador++;
    if(nivel>=56250) contador++;
    if(nivel>=62500) contador++;
    if(nivel>=68750) contador++;
    if(nivel>=75000) contador++;

    let random;
    let enemigo;
    let imagen;
    let vida_enemigo;
    let daño_enemigo;

    let nivel_enemigo = Math.round(Math.random()*(contador-1))+1;
    let lugar = regiones_maestria_dh[nivel_enemigo-1];

    if(nivel_enemigo===1) random = await Math.round(Math.random()*(monstruos_maestria_5.length-1)), enemigo = `${monstruos_maestria_5[random]}`, imagen = `${imagenes_maestria_5[random]}`, vida_enemigo = 7500*(Math.pow(prestigio, 4));
    if(nivel_enemigo===2) random = await Math.round(Math.random()*(monstruos_maestria_4.length-1)), enemigo = `${monstruos_maestria_4[random]}`, imagen = `${imagenes_maestria_4[random]}`, vida_enemigo = 8750*(Math.pow(prestigio, 4));
    if(nivel_enemigo===3) random = await Math.round(Math.random()*(monstruos_maestria_3.length-1)), enemigo = `${monstruos_maestria_3[random]}`, imagen = `${imagenes_maestria_3[random]}`, vida_enemigo = 10000*(Math.pow(prestigio, 4));
    if(nivel_enemigo===4) random = await Math.round(Math.random()*(monstruos_maestria_2.length-1)), enemigo = `${monstruos_maestria_2[random]}`, imagen = `${imagenes_maestria_2[random]}`, vida_enemigo = 11250*(Math.pow(prestigio, 4));
    if(nivel_enemigo===5) random = await Math.round(Math.random()*(monstruos_maestria_1.length-1)), enemigo = `${monstruos_maestria_1[random]}`, imagen = `${imagenes_maestria_1[random]}`, vida_enemigo = 12500*(Math.pow(prestigio, 4));
    // PELEA
    do{
      if(arma===1) golpe = Math.round(Math.random()*(50-40))+40;
      if(arma===2) golpe = Math.round(Math.random()*(70-60))+60;
      if(arma===3) golpe = Math.round(Math.random()*(120-100))+100;
      if(arma===4) golpe = Math.round(Math.random()*(190-140))+140;
      if(arma===5) golpe = Math.round(Math.random()*(240-200))+200;
      if(arma===6) golpe = Math.round(Math.random()*(340-280))+280;
      if(arma===7) golpe = Math.round(Math.random()*(400-350))+350;
      if(arma===8) golpe = Math.round(Math.random()*(480-420))+420;
      if(arma===9) golpe = Math.round(Math.random()*(600-500))+500;
      if(arma===10) golpe = Math.round(Math.random()*(750-650))+650;
      if(arma===11) golpe = Math.round(Math.random()*(900-800))+800;
      if(arma===12) golpe = Math.round(Math.random()*(1150-980))+980;
      if(arma===13) golpe = Math.round(Math.random()*(2500-1500))+1500;
      if(arma===14) golpe = Math.round(Math.random()*(4500-3000))+3000;
      if(arma===15) golpe = Math.round(Math.random()*(7000-5000))+5000;
      if(arma===16) golpe = Math.round(Math.random()*(7000-5000))+5000;
      if(arma===17) golpe = Math.round(Math.random()*(11000-7000))+7000;
      if(arma===18) golpe = Math.round(Math.random()*(11000-7000))+7000;
      if(arma===19) golpe = Math.round(Math.random()*(11000-7000))+7000;
      if(arma===20) golpe = Math.round(Math.random()*(15000-10000))+10000;
      if(arma===21) golpe = Math.round(Math.random()*(18000-14000))+14000;
      if(arma===22) golpe = Math.round(Math.random()*(25000-20000))+20000;
      if(arma===23) golpe = Math.round(Math.random()*(30000-20000))+20000;
      if(arma===24) golpe = Math.round(Math.random()*(40000-30000))+30000;
      if(arma===25) golpe = Math.round(Math.random()*(50000-45000))+45000;

      if(nivel_enemigo===1) daño_enemigo = (Math.round(Math.random()*(2600-2500))+2500)*(Math.pow(prestigio, 2));
      if(nivel_enemigo===2) daño_enemigo = (Math.round(Math.random()*(2700-2600))+2600)*(Math.pow(prestigio, 2));
      if(nivel_enemigo===3) daño_enemigo = (Math.round(Math.random()*(2800-2700))+2700)*(Math.pow(prestigio, 2));
      if(nivel_enemigo===4) daño_enemigo = (Math.round(Math.random()*(2900-2900))+2900)*(Math.pow(prestigio, 2));
      if(nivel_enemigo===5) daño_enemigo = (Math.round(Math.random()*(3000-2900))+2900)*(Math.pow(prestigio, 2));

      vida_enemigo = vida_enemigo-golpe;
      if(vida_enemigo<=0){
        let xp_ganados = (Math.round(Math.random()*(100-50+(nivel/(6-nivel_enemigo))))+(1500*nivel_enemigo))*bonificacion*nivel_enemigo;
        let coins_ganados = (Math.round(Math.random()*(nivel_enemigo*1600))+(3200*nivel_enemigo))*bonificacion;
        let limit_xp = 100+(20*(nivel-1));
        let suma_xp = xp+xp_ganados;

        let embed = new Discord.MessageEmbed()
          .setDescription(`:eight_spoked_asterisk: **BALUARTE: HAS GANADO** :eight_spoked_asterisk:`)
          .setColor("#61FD53")
          .setThumbnail(message.author.avatarURL())
          .addField("Region explorada: ", `${lugar}`, true)
          .addField("Enemigo: ", `${enemigo}`, true)
          .addField("Nivel enemigo: ", `Maestría ${6-nivel_enemigo}`, true)
          .addField('Tu salud:', vida.toFixed(2), true)
          .addField('Coins ganados: ', `${coins_ganados.toFixed(2)}`, true)
          .addField('XP ganados: ', `${xp_ganados.toFixed(2)}`, true)
          .setImage(imagen);
        if(suma_xp>limit_xp){
          do{
            nivel = nivel+1;
            suma_xp = suma_xp - limit_xp
            limit_xp = 100+(20*(nivel-1));
          }while(suma_xp>limit_xp)
          if(prestigio === 2) nivel_inicial=nivel_inicial-50000, nivel=nivel-50000;
          if(prestigio === 3) nivel_inicial=nivel_inicial-150000, nivel=nivel-150000;
          let embed2 = new Discord.MessageEmbed()
            .setDescription(`:high_brightness: **SUBISTES DE NIVEL** :high_brightness:`)
            .setColor(`#fcd874`)
            .addField(`Nivel anterior:`, nivel_inicial, true)
            .addField(`Nivel nuevo:`, nivel, true)
            .addField('**ENHORABUENA**: ', message.author);
          if(prestigio === 2) nivel_inicial=nivel_inicial+50000, nivel=nivel+50000;
          if(prestigio === 3) nivel_inicial=nivel_inicial+150000, nivel=nivel+150000;
          db_discordhunter.run(`UPDATE usuarios SET coins = ${coins+coins_ganados}, xp = ${suma_xp}, nivel = ${nivel}, vida = ${100+(((nivel)-1)*2)} WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 exploracion de DH`)
            await message.channel.send(embed)
            await message.channel.send(embed2);
            if(filas.escudo==='Madera'){

              if(filas.rayos===":x:"){
                db_discordhunter.run(`UPDATE usuarios SET rayos = ':white_check_mark:' WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #4 exploracion de DH`)
                  message.channel.send(new Discord.MessageEmbed().setAuthor(`¡HAS ENCONTRADO UN ARMA MÍSTICA!`, message.author.avatarURL()).setDescription(`**RAYOS DE ZEUS**`).setImage("https://cdn.discordapp.com/attachments/523268901719769088/793504510064590858/erww.png"))
                })
              }
            }
            if(nivel>=50000 && filas.prestigio<2){
              db_discordhunter.run(`UPDATE usuarios SET prestigio = 2 WHERE id = '${message.author.id}'`, async function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #10 exploracion de DH`)
                message.channel.send(new Discord.MessageEmbed().setAuthor(`:cd: ¡ASCENDISTE A PRESTIGIO 2!`, message.author.avatarURL()))
              })
            }
            if(nivel>=150000 && filas.prestigio<3){
              db_discordhunter.run(`UPDATE usuarios SET prestigio = 3 WHERE id = '${message.author.id}'`, async function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #11 exploracion de DH`)
                message.channel.send(new Discord.MessageEmbed().setAuthor(`:dvd: ¡ASCENDISTE A PRESTIGIO 3!`, message.author.avatarURL()))
              })
            }
          })
        }
        else{
          db_discordhunter.run(`UPDATE usuarios SET coins = ${coins+coins_ganados}, xp = ${suma_xp}, vida = ${vida} WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #5 exploracion de DH`)
            await message.channel.send(embed)
          })
        }
        return;
      }
      if(escudo<=0){
        vida = vida-daño_enemigo;
        if(vida<=0){
          let embed = new Discord.MessageEmbed()
            .setDescription(`:no_entry: **BALUARTE: HAS PERDIDO** :no_entry:`)
            .setColor("#FD3D3D")
            .setThumbnail(message.author.avatarURL())
            .addField("Region explorada: ", `${lugar}`, true)
            .addField("Enemigo encontrado: ", `${enemigo}`, true)
            .addField("Nivel enemigo: ", `Maestría ${6-nivel_enemigo}`, true)
            .addField('Tu salud:', 0, true)
            .addField('Salud del enemigo:', vida_enemigo.toFixed(2), true)
            .setImage(imagen);
          db_discordhunter.run(`UPDATE usuarios SET vida = 0 WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 exploracion de DH`)
          })
          return message.channel.send(embed)
        }
      }
      else escudo = escudo-daño_enemigo;
    }while(vida>0 && vida_enemigo>0)
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
