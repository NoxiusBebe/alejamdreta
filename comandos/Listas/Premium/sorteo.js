/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_sorteos = new sqlite3.Database("./memoria/db_sorteos.sqlite");
const db_sorteos_todos = new sqlite3.Database("./memoria/db_sorteos_todos.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅",
  "ADMINISTRATOR": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "sorteo [título del sorteo] | [duración con su unidad: s {segundos}, m {minutos}, h {horas}, d {días}] | [nº de ganadores]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#A9FF3D`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#A9FF3D`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.listas===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-listas.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#A9FF3D`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/

    const texto = args.join(" ").split(" | ")
    let descripcion = texto[0];
    let tiempo = texto[1];
    let ganadores = texto[2];
    if(!descripcion) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Se te olvidó el mensaje**\n\n${estructura}`).setColor(`#A9FF3D`))
    if(!tiempo) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Se te olvidó la duración**\n\n${estructura}`).setColor(`#A9FF3D`))
    if(!ganadores) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Se te olvidó la cantidad de ganadores\n\n${estructura}`).setColor(`#A9FF3D`))
    if(parseInt(ganadores)<=0 || ganadores<=0 || ganadores==='0') return message.channel.send(new Discord.MessageEmbed().setDescription(`:expressionless: **Un poco raro que el número de ganadores sea 0, ¿no?**\n\n${estructura}`).setColor(`#A9FF3D`))
    let tiempo_duracion = await getNumbersInString(tiempo)
    let tiempo_unidad = await getCharactersInString(tiempo)
    if(!tiempo_duracion) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes poner la duración del muteo junto con su unidad**\n\n${estructura}`).setColor(`#A9FF3D`))
    if(tiempo_unidad==='s') tiempo_unidad = 1000;
    else if(tiempo_unidad==='m') tiempo_unidad = 60*1000;
    else if(tiempo_unidad==='h') tiempo_unidad = 60*60*1000;
    else if(tiempo_unidad==='d') tiempo_unidad = 24*60*60*1000;
    else return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes poner la duración junto con su unidad**\n\n${estructura}`).setColor(`#A9FF3D`))
    if(isNaN(tiempo_duracion)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Debes poner la duración junto con su unidad**\n\n${estructura}`).setColor(`#A9FF3D`))
    tiempo_duracion = parseFloat(tiempo_duracion);
    ganadores = parseInt(ganadores);

    let fecha_actual = Date.now();
    let fecha_final = Date.now()+(tiempo_duracion*tiempo_unidad);

    if(message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete();

    db_sorteos.run(`CREATE TABLE IF NOT EXISTS '${message.guild.id}' (canal TEXT, mensaje TEXT, descripcion TEXT, fecha TEXT, ganadores INTEGER, participantes INTEGER, user_0 TEXT)`, function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 creando sorteos en ${message.guild.id}`)
      mensaje = message.channel.send(new Discord.MessageEmbed()
          .setDescription(`:tada: __**SORTEO:**__ (Participantes ⥤ **0** : **${ganadores}** ⥢ Ganadores)\n\n**${descripcion}**\n\n⏳ Finaliza en: ${T_convertor((fecha_final-fecha_actual))}`)
          .addField(`Apúntate: `, `🎉`, true)
          .addField(`Bórrate: `, `❌`, true)
          .addField(`Participantes: `, `📃`, true)
          .setColor(`#E77BDF`)
          .setFooter(`Este mensaje se actualiza cada minuto`)).then(m => {
        m.react("🎉");
        setTimeout(function() {
          m.react("❌");
        }, 400);
        setTimeout(function() {
          m.react("📃");
        }, 800);
        db_sorteos.run(`INSERT INTO '${message.guild.id}'(canal, mensaje, descripcion, fecha, ganadores, participantes) VALUES('${message.channel.id}', '${m.id}', '${descripcion}', '${fecha_final}', ${ganadores}, 0)`, function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 creando sorteos en ${message.guild.id}`)
          db_sorteos_todos.run(`INSERT INTO servidores(servidor, canal, mensaje, descripcion, fecha, ganadores, participantes) VALUES('${message.guild.id}', '${message.channel.id}', '${m.id}', '${descripcion}', '${fecha_final}', ${ganadores}, 0)`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 creando sorteos en ${message.guild.id}`)
          })
        })
      });
    });
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

function T_convertor(ms){
  let años = Math.floor((ms) / (1000 * 60 * 60 * 24 * 365));
  let meses = Math.floor(((ms) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  let dias = Math.floor(((ms) % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
	let horas = Math.floor(((ms) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutos = Math.floor(((ms) % (1000 * 60 * 60)) / (1000 * 60));
  let segundos = Math.floor(((ms) % (1000 * 60)) / 1000);

	let final = ""
  if(años > 0) final += años > 1 ? `${años} años, ` : `${años} año, `
  if(meses > 0) final += meses > 1 ? `${meses} meses, ` : `${meses} mes, `
  if(dias > 0) final += dias > 1 ? `${dias} dias, ` : `${dias} dia, `
  if(horas > 0) final += horas > 1 ? `${horas} horas, ` : `${horas} hora, `
  if(minutos > 0) final += minutos > 1 ? `${minutos} minutos ` : `${minutos} minuto `
  if(segundos > 0) final += segundos > 1 ? `${segundos} segundos.` : `${segundos} segundo.`
  return final
};
function getNumbersInString(string){
  var tmp = string.split("");
  var map = tmp.map(function(current) {
    if (!isNaN(parseInt(current))) {
      return current;
    }
  });
  var numbers = map.filter(function(value) {
    return value != undefined;
  });
  return numbers.join("");
}
function getCharactersInString(string){
  var tmp = string.split("");
  var map = tmp.map(function(current) {
    if (isNaN(parseInt(current))) {
      return current;
    }
  });
  var numbers = map.filter(function(value) {
    return value != undefined;
  });
  return numbers.join("");
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
