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

  return message.channel.send(new Discord.MessageEmbed().setAuthor(`Este comando se encuentra en mantenimiento. Perdón por las molestias.`, `https://cdn.discordapp.com/attachments/823263020246761523/872257035633328179/OIP.png`).setColor(`#9262FF`))

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.auto.asalto [nivel del 1 al 10]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  if(stop_farmear.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 3 segundos** ⛔`).setColor(`#9262FF`))
  stop_farmear.add(message.author.id);
  setTimeout(() => {
    stop_farmear.delete(message.author.id);
  }, 3000);

  db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas25) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 exploracion de DH`)
    if(!filas25) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
    if(filas25.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud**\n\nCúrate en la tienda`).setColor(`#9262FF`))
    if(filas25.auto_farmear===1) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **EL SISTEMA DE AUTO FARMEO YA ESTÁ ACTIVADO**\n\nDesactívalo usando ${client.config.prefijos[message.guild.id]}dh.auto.parar`).setColor(`#9262FF`))
    let dificultad = parseInt(args.join(" "))
    if(!dificultad) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **¿Y el nivel de dificultad?**\n\n${estructura}`).setColor(`#9262FF`))
    if(dificultad<=0 || dificultad>=11) return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **Nivel incorrecto**\n\n${estructura}`).setColor(`#9262FF`))

    db_discordhunter.run(`UPDATE usuarios SET auto_farmear = 1, actividad_auto_farmear = 'Asalto', coins_auto_farmear = 0, xp_auto_farmear = 0, cantidad_auto_farmeo = 0 WHERE id = '${message.author.id}'`, async function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #4 exploracion de DH`)
    })
    message.channel.send(new Discord.MessageEmbed().setAuthor(`Activando sistema automático de farmeo...`, 'https://cdn.discordapp.com/attachments/823263020246761523/832295235936976896/Pico_de_piedra_encantado.gif'))
    client.config.sesion_auto_farmeo[message.author.id] = setInterval(async function() {
      db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 asalto de DH`)

        if(filas.auto_farmear===0){
          clearInterval(client.config.sesion_auto_farmeo[filas.id]);
          return;
        }

        let bonificacion;
        if(message.guild.id===client.config.servidor_soporte) bonificacion = client.config.dh_plus;
        else bonificacion = 1;

        // DATOS DEL JUGADOR
        let vida = filas.vida;
        if(vida===0 || vida==="0" || vida===null) vida = 0;
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

        let cc_coins = filas.coins_auto_farmear;
        let cc_xp = filas.xp_auto_farmear;
        let cc_cantidad = filas.cantidad_auto_farmeo;

        // DATOS DEL ENEMIGO
        let random;
        let enemigo;
        let lista_enemigos = [];
        let imagen;
        let vida_enemigo_pelea;
        let daño_enemigo;
        let nivel_enemigo;

        if(dificultad>0 && dificultad<11) nivel_enemigo = dificultad;
        else return message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **Nivel incorrecto**\n\n${estructura}`).setColor(`#9262FF`))

        let lugar = regiones_niveles_dh[nivel_enemigo-1];

        if(nivel_enemigo===1) imagen = imagenes_nivel_1, random = monstruos_nivel_1, vida_enemigo_pelea = 90*(Math.pow(prestigio, 2));
        if(nivel_enemigo===2) imagen = imagenes_nivel_2, random = monstruos_nivel_2, vida_enemigo_pelea = 1000*(Math.pow(prestigio, 2));
        if(nivel_enemigo===3) imagen = imagenes_nivel_3, random = monstruos_nivel_3, vida_enemigo_pelea = 2500*(Math.pow(prestigio, 2));
        if(nivel_enemigo===4) imagen = imagenes_nivel_4, random = monstruos_nivel_4, vida_enemigo_pelea = 4000*(Math.pow(prestigio, 2));
        if(nivel_enemigo===5) imagen = imagenes_nivel_5, random = monstruos_nivel_5, vida_enemigo_pelea = 6000*(Math.pow(prestigio, 2));
        if(nivel_enemigo===6) imagen = imagenes_nivel_6, random = monstruos_nivel_6, vida_enemigo_pelea = 9000*(Math.pow(prestigio, 2));
        if(nivel_enemigo===7) imagen = imagenes_nivel_7, random = monstruos_nivel_7, vida_enemigo_pelea = 12000*(Math.pow(prestigio, 2));
        if(nivel_enemigo===8) imagen = imagenes_nivel_8, random = monstruos_nivel_8, vida_enemigo_pelea = 15000*(Math.pow(prestigio, 2));
        if(nivel_enemigo===9) imagen = imagenes_nivel_9, random = monstruos_nivel_9, vida_enemigo_pelea = 20000*(Math.pow(prestigio, 2));
        if(nivel_enemigo===10) imagen = imagenes_nivel_10, random = monstruos_nivel_10, vida_enemigo_pelea = 25000*(Math.pow(prestigio, 2));

        let vida_enemigo;

        // PELEA
        for(var i=0 ; i<random.length ; i++){
          vida_enemigo = vida_enemigo_pelea;
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
            if(vida===0) golpe = 0;

            if(nivel_enemigo===1) daño_enemigo = (Math.round(Math.random()*(30-20))+20)*(Math.pow(prestigio, 2));
            if(nivel_enemigo===2) daño_enemigo = (Math.round(Math.random()*(120-100))+100)*(Math.pow(prestigio, 2));
            if(nivel_enemigo===3) daño_enemigo = (Math.round(Math.random()*(240-200))+200)*(Math.pow(prestigio, 2));
            if(nivel_enemigo===4) daño_enemigo = (Math.round(Math.random()*(400-350))+350)*(Math.pow(prestigio, 2));
            if(nivel_enemigo===5) daño_enemigo = (Math.round(Math.random()*(480-420))+420)*(Math.pow(prestigio, 2));
            if(nivel_enemigo===6) daño_enemigo = (Math.round(Math.random()*(600-500))+500)*(Math.pow(prestigio, 2));
            if(nivel_enemigo===7) daño_enemigo = (Math.round(Math.random()*(700-600))+600)*(Math.pow(prestigio, 2));
            if(nivel_enemigo===8) daño_enemigo = (Math.round(Math.random()*(800-700))+700)*(Math.pow(prestigio, 2));
            if(nivel_enemigo===9) daño_enemigo = (Math.round(Math.random()*(900-800))+800)*(Math.pow(prestigio, 2));
            if(nivel_enemigo===10) daño_enemigo = (Math.round(Math.random()*(1000-900))+900)*(Math.pow(prestigio, 2));

            vida_enemigo = vida_enemigo-golpe;

            if(vida_enemigo<=0){
              lista_enemigos.push(`~~${random[i]}~~`)
              if(i===random.length-1){
                let xp_ganados = ((Math.round(Math.random()*(100-50+(nivel/(12-nivel_enemigo))))+(50*nivel_enemigo))*bonificacion*random.length)/5;
                let coins_ganados = ((Math.round(Math.random()*(nivel_enemigo*20))+(50*nivel_enemigo))*bonificacion*random.length)/5;
                let limit_xp = 100+(20*(nivel-1));
                let suma_xp = xp+xp_ganados;

                if(suma_xp>limit_xp){
                  do{
                    nivel = nivel+1;
                    suma_xp = suma_xp - limit_xp
                    limit_xp = 100+(20*(nivel-1));
                  }while(suma_xp>limit_xp)
                  db_discordhunter.run(`UPDATE usuarios SET coins = ${coins+coins_ganados}, xp = ${suma_xp}, nivel = ${nivel}, vida = ${100+(((nivel)-1)*2)}, coins_auto_farmear = ${cc_coins+coins_ganados}, xp_auto_farmear = ${cc_xp+xp_ganados}, cantidad_auto_farmeo = ${cc_cantidad+1}  WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 asalto de DH`)
                    if(nivel>=50000 && filas.prestigio<2){
                      db_discordhunter.run(`UPDATE usuarios SET prestigio = 2 WHERE id = '${message.author.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #10 asaltos de DH`)
                        message.channel.send(new Discord.MessageEmbed().setAuthor(`:cd: ¡ASCENDISTE A PRESTIGIO 2!`, message.author.avatarURL()))
                      })
                    }
                    if(nivel>=150000 && filas.prestigio<3){
                      db_discordhunter.run(`UPDATE usuarios SET prestigio = 3 WHERE id = '${message.author.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #11 asaltos de DH`)
                        message.channel.send(new Discord.MessageEmbed().setAuthor(`:dvd: ¡ASCENDISTE A PRESTIGIO 3!`, message.author.avatarURL()))
                      })
                    }
                  })
                }
                else{
                  db_discordhunter.run(`UPDATE usuarios SET coins = ${coins+coins_ganados}, xp = ${suma_xp}, vida = ${vida}, coins_auto_farmear = ${cc_coins+coins_ganados}, xp_auto_farmear = ${cc_xp+xp_ganados}, cantidad_auto_farmeo = ${cc_cantidad+1}  WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #5 asalto de DH`)
                  })
                }
              }
              break;
            }
            if(escudo<=0){
              vida = vida-daño_enemigo;
              if(vida<=0){
                lista_enemigos.push(`${random[i]}`)
                db_discordhunter.run(`UPDATE usuarios SET vida = 0, auto_farmear = 0 WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #8 asalto de DH`)
                  clearInterval(client.config.sesion_auto_farmeo[filas.id]);
                  await message.channel.send(`${message.author}`)
                  let embed = new Discord.MessageEmbed()
                    .setAuthor(`¡Sistema automático de farmeo finalizado!`, 'https://cdn.discordapp.com/attachments/823263020246761523/832299411375652884/0bd449bf8fd5147c-.gif')
                    .setDescription(`**Actividad:** ${filas.actividad_auto_farmear}\n**Coins ganadas:** ${filas.coins_auto_farmear.toFixed(2)}\n**XP ganado:** ${filas.xp_auto_farmear.toFixed(2)}\n**Veces que se repitió la actividad**: ${filas.cantidad_auto_farmeo}`)
                    .setColor("#FFCE5A")
                    .setThumbnail(message.author.avatarURL());
                  await message.channel.send(embed)
                })
                return;
              }
            }
            else escudo = escudo-daño_enemigo;
          }while(vida>0 && vida_enemigo>0)
        }
      })
    }, 10000);
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
