/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "+dh.sup`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 entrando en supervivencia de DH`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))

    if(!client.config.estado_supervivencia[message.guild.id] || client.config.estado_supervivencia[message.guild.id]===0) return message.channel.send(new Discord.MessageEmbed().setDescription(":confused: El modo **Supervivencia** no está activo.\n\nPara activarlo, teclea: *`"+client.config.prefijos[message.guild.id]+"dh.supervivencia`*").setColor(`#9262FF`))
    if(filas.estado_supervivencia===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: Ya estás participando en un modo **Supervivencia**.\n\nCuando acabes, podrás apuntarte a otra.").setColor(`#9262FF`))
    if(filas.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud. Cúrate en la tienda**`).setColor(`#9262FF`))

    let escudo;
    if(filas.escudo===":x:") escudo = 0;
    if(filas.escudo==="Madera") escudo = 100;
    if(filas.escudo==="Acero") escudo = 500;
    if(filas.escudo==="Bronce") escudo = 1000;
    if(filas.escudo==="Plata") escudo = 6000;
    if(filas.escudo==="Oro") escudo = 20000;
    if(filas.escudo==="Platino") escudo = 50000;
    if(filas.escudo==="Diamante") escudo = 100000;
    if(filas.escudo==="Divina") escudo = 500000;

    let golpe;
    if(filas.arma===1) golpe = 50;
    if(filas.arma===2) golpe = 70;
    if(filas.arma===3) golpe = 120;
    if(filas.arma===4) golpe = 190;
    if(filas.arma===5) golpe = 240;
    if(filas.arma===6) golpe = 340;
    if(filas.arma===7) golpe = 400;
    if(filas.arma===8) golpe = 480;
    if(filas.arma===9) golpe = 600;
    if(filas.arma===10) golpe = 750;
    if(filas.arma===11) golpe = 900;
    if(filas.arma===12) golpe = 1150;
    if(filas.arma===13) golpe = 2500;
    if(filas.arma===14) golpe = 4500;
    if(filas.arma===15) golpe = 7000;
    if(filas.arma===16) golpe = 7000;
    if(filas.arma===17) golpe = 11000;
    if(filas.arma===18) golpe = 11000;
    if(filas.arma===19) golpe = 11000;
    if(filas.arma===20) golpe = 15000;
    if(filas.arma===21) golpe = 18000;
    if(filas.arma===22) golpe = 25000;
    if(filas.arma===23) golpe = 30000;
    if(filas.arma===24) golpe = 40000;
    if(filas.arma===25) golpe = 50000;

    db_discordhunter.get(`SELECT * FROM supervivencia WHERE id = '${message.guild.id}'`, async (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 entrando en supervivencia de DH`)
      for(var i=1 ; i<=1800 ; i++){
        if(!filas2[`usuario_${i}`]){
          db_discordhunter.run(`UPDATE usuarios SET estado_supervivencia = 1 WHERE id = '${message.author.id}'`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 entrando en supervivencia de DH`)
            db_discordhunter.get(`SELECT * FROM supervivencia WHERE id = '${message.guild.id}'`, (err, filas3) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 entrando en supervivencia de DH`)
              db_discordhunter.run(`UPDATE supervivencia SET usuario_${i} = '${message.author.id}', vida = ${filas3.vida+filas.vida}, escudo = ${filas3.escudo+escudo}, daño = ${filas3.daño+golpe} WHERE id = '${message.guild.id}'`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #4 entrando en supervivencia de DH`)
                message.channel.send(new Discord.MessageEmbed().setDescription(`:shield: Bienvenido al modo **SUPERVIVENCIA**, ${message.author}`).setColor(`#9262FF`))
                if(!filas2[`usuario_${i+1}`]){
                  db_discordhunter.run(`ALTER TABLE supervivencia ADD usuario_${i+1} TEXT`, function(err) {
                    if(err) return console.log(err.message + ` ERROR #5 entrando en supervivencia de DH`)
                  })
                }
              })
            })
          })
          break;
        }
        else if(i===1800) return message.channel.send(new Discord.MessageEmbed().setDescription(`Este modo **SUPERVIVENCIA** se ha llenado ${message.author}.\n\nMe temo que deberás esperarte a otro para poder participar.`).setColor(`#9262FF`))
      }
    })
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
