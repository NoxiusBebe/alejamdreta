/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

let stop_farmear = new Set();

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.duelo [@usuario]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 de batalla en DH`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))
    if(filas.prestigio<2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:cd: **Necesitas ascender a Prestigio 2 para realizar esta actividad**`).setColor(`#9262FF`))
    if(filas.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud**\n\nCúrate en la tienda`).setColor(`#9262FF`))
    if(filas.estado_duelos===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: Ya estás en un **DUELO**.\n\nCuando acabes, podrás iniciar otro.").setColor(`#9262FF`))
    let contrincante = message.mentions.members.first()
    if(!contrincante || contrincante.id===message.author.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`:woozy_face: **Necesitas un oponente (que no seas tu mismo, claro)**\n\n${estructura}`).setColor(`#9262FF`))
    let respuesta = 0;
    let bonificacion;
    if(message.guild.id!='378197663629443083') bonificacion = 1;
    else bonificacion = 2;

    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${contrincante.id}'`, async (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 de batalla en DH`)
      if(!filas2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **Tu oponente no tiene cuenta en Discord Hunter**`).setColor(`#9262FF`))
      if(filas2.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **Tu oponente no tiene salud. Debe curarse antes.**`).setColor(`#9262FF`))
      if(filas2.estado_duelos===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: Tu oponente ya está dentro de un **DUELO**.\n\nCuando acabe, podrás retarlo.").setColor(`#9262FF`))

      db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 1 WHERE id = '${message.author.id}'`, async function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
      })

      message.channel.send(new Discord.MessageEmbed().setDescription(`**${contrincante}, ¿aceptas un DUELO contra ${message.author}?**\n\nResponde: **si** o **no**`))

      const collector = message.channel.createMessageCollector(m => m.author.id === contrincante.id && m.channel.id === message.channel.id, {time : 30000});
      collector.on("collect", async m => {
        if(m.content.toLowerCase()==="si" || m.content.toLowerCase()==="Si" || m.content.toLowerCase()==="SI"){
          db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 1 WHERE id = '${contrincante.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
          })
          respuesta = 1;
          client.config.ronda_duelos[message.author.id] = 1;
          collector.stop();
          // ----------------------------------------------------------------------------------------------
          let vida_1 = filas.vida;
          let escudo_1 = filas.escudo
          if(escudo_1===":x:") escudo_1 = 0;
          if(escudo_1==="Madera") escudo_1 = 100;
          if(escudo_1==="Acero") escudo_1 = 500;
          if(escudo_1==="Bronce") escudo_1 = 1000;
          if(escudo_1==="Plata") escudo_1 = 6000;
          if(escudo_1==="Oro") escudo_1 = 20000;
          if(escudo_1==="Platino") escudo_1 = 50000;
          if(escudo_1==="Diamante") escudo_1 = 100000;
          if(escudo_1==="Divina") escudo_1 = 500000;
          let arma_1 = filas.arma;
          let golpe_1;
          let nivel_inicial_1 = filas.nivel;
          let nivel_1 = filas.nivel;
          let xp_1 = filas.xp;
          let coins_1 = filas.coins;
          let prestigio_1 = filas.prestigio;
          // ----------------------------------------------------------------------------------------------
          let vida_2 = filas2.vida;
          let escudo_2 = filas2.escudo
          if(escudo_2===":x:") escudo_2 = 0;
          if(escudo_2==="Madera") escudo_2 = 100;
          if(escudo_2==="Acero") escudo_2 = 500;
          if(escudo_2==="Bronce") escudo_2 = 1000;
          if(escudo_2==="Plata") escudo_2 = 6000;
          if(escudo_2==="Oro") escudo_2 = 20000;
          if(escudo_2==="Platino") escudo_2 = 50000;
          if(escudo_2==="Diamante") escudo_2 = 100000;
          if(escudo_2==="Divina") escudo_2 = 500000;
          let arma_2 = filas2.arma;
          let golpe_2;
          let nivel_inicial_2 = filas2.nivel;
          let nivel_2 = filas2.nivel;
          let xp_2 = filas2.xp;
          let coins_2 = filas2.coins;
          let prestigio_2 = filas2.prestigio;
          // ----------------------------------------------------------------------------------------------
          let vidaenemigo = 0;
          let golpeenemigo = 0;
          let vidaenemigoT;
          // ----------------------------------------------------------------------------------------------
          let instrucciones = new Discord.MessageEmbed()
            .setDescription(`:crossed_swords: **VUESTRO DUELO TENDRÁ LUGAR EN 30 SEGUNDOS** :crossed_swords:\n\n- **¿Cómo se juega a esto?:** Ambos jugadores debereis enfrentaros a un modo **Supervivencia** solos. Debereis sobrevivir ronda tras ronda y evitar morir. El último superviviente de ambos será el ganador.\n\n- **¿Y qué tiene de especial este modo?:** En rondas aleatorias, aparecerán **Perlas de Luz** que podreis usar para __quitarle vida a vuestro compañero, traicionándolo para que muera antes que ti:__\n\n     1️⃣ Reaccionar aqui para hacer daño a <@${contrincante.id}>\n     2️⃣ Reaccionar aqui para hacer daño a ${message.author}\n     :knife: Quien antes reaccione, será quien pueda usar la **Perla de Luz**. Su daño, incrementa con cada ronda que pase, y solo afecta a la vida del usuario, no al escudo.\n\n**MUCHA SUERTE A AMBOS**`);
          message.channel.send(instrucciones)
          // ----------------------------------------------------------------------------------------------
          setTimeout(async function() {
            let embed = new Discord.MessageEmbed()
              .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
              .setDescription(`Pronto comenzará vuestro duelo contra poderosos enemigos... o contra vosotros mismos...`)
              .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
              .addField(`:one: JUGADOR`, message.author, true)
              .addField(`**EN PREPARACION**`, `\u200b`, true)
              .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
              .addField(`:heart: Vida: `, vida_1, true)
              .addField(`\u200b`, `\u200b`, true)
              .addField(`:heart: Vida: `, vida_2, true)
              .addField(`:shield: Escudo: `, escudo_1, true)
              .addField(`\u200b`, `\u200b`, true)
              .addField(`:shield: Escudo: `, escudo_2, true)
              .addField(`:crossed_swords: Arma: `, arma_1, true)
              .addField(`\u200b`, `\u200b`, true)
              .addField(`:crossed_swords: Arma: `, arma_2, true)
              .setColor("#FFBF00");
            let mensaje = await message.channel.send(embed).then(m => {
              m.react("1️⃣");
              setTimeout(function() {
                m.react("2️⃣");
              }, 400);
              // ----------------------------------------------------------------------------------------------
              let fase_niveles = setInterval(async function() {

                if(client.config.ronda_duelos[message.author.id]>=1) vidaenemigo = vidaenemigo+500, golpeenemigo = golpeenemigo+100;
                if(client.config.ronda_duelos[message.author.id]>=3) vidaenemigo = vidaenemigo+800, golpeenemigo = golpeenemigo+200;
                if(client.config.ronda_duelos[message.author.id]>=6) vidaenemigo = vidaenemigo+1200, golpeenemigo = golpeenemigo+320;
                if(client.config.ronda_duelos[message.author.id]>=9) vidaenemigo = vidaenemigo+1700, golpeenemigo = golpeenemigo+580;
                if(client.config.ronda_duelos[message.author.id]>=12) vidaenemigo = vidaenemigo+2300, golpeenemigo = golpeenemigo+850;
                if(client.config.ronda_duelos[message.author.id]>=15) vidaenemigo = vidaenemigo+3000, golpeenemigo = golpeenemigo+1300;
                if(client.config.ronda_duelos[message.author.id]>=18) vidaenemigo = vidaenemigo+6000, golpeenemigo = golpeenemigo+1800;
                if(client.config.ronda_duelos[message.author.id]>=21) vidaenemigo = vidaenemigo+10000, golpeenemigo = golpeenemigo+2000;
                if(client.config.ronda_duelos[message.author.id]>=24) vidaenemigo = vidaenemigo+15000, golpeenemigo = golpeenemigo+2800;
                if(client.config.ronda_duelos[message.author.id]>=27) vidaenemigo = vidaenemigo+30000, golpeenemigo = golpeenemigo+4000;

                if(arma_1===1) golpe_1 = 50;
                if(arma_1===2) golpe_1 = 70;
                if(arma_1===3) golpe_1 = 120;
                if(arma_1===4) golpe_1 = 190;
                if(arma_1===5) golpe_1 = 240;
                if(arma_1===6) golpe_1 = 340;
                if(arma_1===7) golpe_1 = 400;
                if(arma_1===8) golpe_1 = 480;
                if(arma_1===9) golpe_1 = 600;
                if(arma_1===10) golpe_1 = 750;
                if(arma_1===11) golpe_1 = 900;
                if(arma_1===12) golpe_1 = 1150;
                if(arma_1===13) golpe_1 = 2500;
                if(arma_1===14) golpe_1 = 4500;
                if(arma_1===15) golpe_1 = 7000;
                if(arma_1===16) golpe_1 = 7000;
                if(arma_1===17) golpe_1 = 11000;
                if(arma_1===18) golpe_1 = 11000;
                if(arma_1===19) golpe_1 = 11000;
                if(arma_1===20) golpe_1 = 15000;
                if(arma_1===21) golpe_1 = 18000;
                if(arma_1===22) golpe_1 = 25000;
                if(arma_1===23) golpe_1 = 30000;
                if(arma_1===24) golpe_1 = 40000;
                if(arma_1===25) golpe_1 = 50000;

                if(arma_2===1) golpe_2 = 50;
                if(arma_2===2) golpe_2 = 70;
                if(arma_2===3) golpe_2 = 120;
                if(arma_2===4) golpe_2 = 190;
                if(arma_2===5) golpe_2 = 240;
                if(arma_2===6) golpe_2 = 340;
                if(arma_2===7) golpe_2 = 400;
                if(arma_2===8) golpe_2 = 480;
                if(arma_2===9) golpe_2 = 600;
                if(arma_2===10) golpe_2 = 750;
                if(arma_2===11) golpe_2 = 900;
                if(arma_2===12) golpe_2 = 1150;
                if(arma_2===13) golpe_2 = 2500;
                if(arma_2===14) golpe_2 = 4500;
                if(arma_2===15) golpe_2 = 7000;
                if(arma_2===16) golpe_2 = 7000;
                if(arma_2===17) golpe_2 = 11000;
                if(arma_2===18) golpe_2 = 11000;
                if(arma_2===19) golpe_2 = 11000;
                if(arma_2===20) golpe_2 = 15000;
                if(arma_2===21) golpe_2 = 18000;
                if(arma_2===22) golpe_2 = 25000;
                if(arma_2===23) golpe_2 = 30000;
                if(arma_2===24) golpe_2 = 40000;
                if(arma_2===25) golpe_2 = 50000;

                vidaenemigoT = vidaenemigo
                do{
                  vidaenemigoT = vidaenemigoT-golpe_1-golpe_2
                  if(vidaenemigoT<=0){
                    vidaenemigoT = 0;
                    break;
                  }
                  if(escudo_2<=0){
                    escudo_2 = 0
                    vida_2 = vida_2-golpeenemigo/2;
                    if(vida_2<=0) vida_2 = 0;
                  }
                  if(escudo_1<=0){
                    escudo_1 = 0
                    vida_1 = vida_1-golpeenemigo/2;
                    if(vida_1<=0) vida_1 = 0;
                  }
                  if(vida_1<=0 || vida_2<=0) break;

                  if(escudo_2>0){
                    escudo_2 = escudo_2-golpeenemigo/2;
                    if(escudo_2<=0) escudo_2 = 0;
                  }
                  if(escudo_1>0){
                    escudo_1 = escudo_1-golpeenemigo/2;
                    if(escudo_1<=0) escudo_1 = 0;
                  }
                }while(vida_1>0 && vida_2>0 && vidaenemigoT>0);

                if(vidaenemigoT<=0){
                  let perla = Math.round(Math.random()*50);
                  if(perla<=24) perla = "...PREPARANDO RONDA...";
                  else perla = ":exclamation: :comet: :exclamation:"
                  embed = new Discord.MessageEmbed()
                    .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
                    .setDescription(`:white_check_mark: __Ronda **${client.config.ronda_duelos[message.author.id]}** superada__ :white_check_mark:`)
                    .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                    .addField(`:one: JUGADOR`, message.author, true)
                    .addField(`${perla}`, `\u200b`, true)
                    .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
                    .addField(`:heart: Vida: `, vida_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:heart: Vida: `, vida_2, true)
                    .addField(`:shield: Escudo: `, escudo_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:shield: Escudo: `, escudo_2, true)
                    .addField(`:crossed_swords: Arma: `, arma_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:crossed_swords: Arma: `, arma_2, true)
                    .setColor("#F2F2F2");
                  await m.edit(embed)
                  if(perla===":exclamation: :comet: :exclamation:"){
                    const respuesta1 = await new Promise((resolve, reject) => {
                      const collector2 = m.createReactionCollector((reaction, user) => !user.bot && (user.id===message.author.id || user.id===contrincante.id) && reaction.message.channel.id === m.channel.id, { time: 3000 });
                      collector2.on('collect', r => {
                        if(r.emoji.name==="1️⃣" || r.emoji.name==="2️⃣"){
                          resolve(r.emoji.name);
                          collector2.stop();
                        }
                      });
                      collector2.on('end', () => resolve(null));
                    });
                    if(!respuesta1){
                      embed = new Discord.MessageEmbed()
                        .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
                        .setDescription(`Ronda ${client.config.ronda_duelos[message.author.id]} superada.`)
                        .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                        .addField(`:one: JUGADOR`, message.author, true)
                        .addField(`¡NO USASTEIS LA PERLA!`, `Que despistados :joy:`, true)
                        .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
                        .addField(`:heart: Vida: `, vida_1, true)
                        .addField(`\u200b`, `\u200b`, true)
                        .addField(`:heart: Vida: `, vida_2, true)
                        .addField(`:shield: Escudo: `, escudo_1, true)
                        .addField(`\u200b`, `\u200b`, true)
                        .addField(`:shield: Escudo: `, escudo_2, true)
                        .addField(`:crossed_swords: Arma: `, arma_1, true)
                        .addField(`\u200b`, `\u200b`, true)
                        .addField(`:crossed_swords: Arma: `, arma_2, true)
                        .setColor("#424242");
                      await m.edit(embed)
                    }
                    else if(respuesta1==="1️⃣"){
                      vida_2 = vida_2-golpeenemigo;
                      if(vida_2<=0){
                        vida_2 = 0;
                        clearInterval(fase_niveles)
                        embed = new Discord.MessageEmbed()
                          .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
                          .setDescription(`Y el último superviviente es ${message.author}`)
                          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                          .addField(`:one: JUGADOR`, message.author, true)
                          .addField(`:comet: **PERLAZO** :boom:`, `\u200b`, true)
                          .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
                          .addField(`:heart: Vida: `, vida_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:heart: Vida: `, vida_2, true)
                          .addField(`:shield: Escudo: `, escudo_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:shield: Escudo: `, escudo_2, true)
                          .addField(`:crossed_swords: Arma: `, arma_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:crossed_swords: Arma: `, arma_2, true)
                          .setColor("#81E347");
                        await m.edit(embed)
                        db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, coins = ${filas.coins+(filas2.coins*0.1)}, xp = ${(Math.round(Math.random()*(100-50+(nivel_2/2)))+50)*bonificacion}, vida = ${vida_1} WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                        })
                        db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, coins = ${filas2.coins*0.9}, vida = ${vida_2} WHERE id = '${contrincante.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                        })
                      }
                      else{
                        embed = new Discord.MessageEmbed()
                          .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
                          .setDescription(`:white_check_mark: __Ronda **${client.config.ronda_duelos[message.author.id]}** superada__ :white_check_mark:`)
                          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                          .addField(`:one: JUGADOR`, message.author, true)
                          .addField(`:comet: **PERLAZO** :boom:`, `\u200b`, true)
                          .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
                          .addField(`:heart: Vida: `, vida_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:heart: Vida: `, vida_2, true)
                          .addField(`:shield: Escudo: `, escudo_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:shield: Escudo: `, escudo_2, true)
                          .addField(`:crossed_swords: Arma: `, arma_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:crossed_swords: Arma: `, arma_2, true)
                          .setColor("#81E347");
                        await m.edit(embed)
                      }
                    }
                    else if(respuesta1==="2️⃣"){
                      vida_1 = vida_1-golpeenemigo;
                      if(vida_1<=0){
                        vida_1 = 0;
                        clearInterval(fase_niveles)
                        embed = new Discord.MessageEmbed()
                          .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
                          .setDescription(`Y el último superviviente es <@${contrincante.id}>`)
                          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                          .addField(`:one: JUGADOR`, message.author, true)
                          .addField(`:comet: **PERLAZO** :boom:`, `\u200b`, true)
                          .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
                          .addField(`:heart: Vida: `, vida_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:heart: Vida: `, vida_2, true)
                          .addField(`:shield: Escudo: `, escudo_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:shield: Escudo: `, escudo_2, true)
                          .addField(`:crossed_swords: Arma: `, arma_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:crossed_swords: Arma: `, arma_2, true)
                          .setColor("#81E347");
                        await m.edit(embed)
                        db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, coins = ${filas.coins*0.9}, vida = ${vida_1} WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                        })
                        db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, coins = ${filas2.coins+(filas.coins*0.1)}, xp = ${(Math.round(Math.random()*(100-50+(nivel_1/2)))+50)*bonificacion}, vida = ${vida_2} WHERE id = '${contrincante.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                        })
                      }
                      else{
                        embed = new Discord.MessageEmbed()
                          .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
                          .setDescription(`:white_check_mark: __Ronda **${client.config.ronda_duelos[message.author.id]}** superada__ :white_check_mark:`)
                          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                          .addField(`:one: JUGADOR`, message.author, true)
                          .addField(`:comet: **PERLAZO** :boom:`, `\u200b`, true)
                          .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
                          .addField(`:heart: Vida: `, vida_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:heart: Vida: `, vida_2, true)
                          .addField(`:shield: Escudo: `, escudo_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:shield: Escudo: `, escudo_2, true)
                          .addField(`:crossed_swords: Arma: `, arma_1, true)
                          .addField(`\u200b`, `\u200b`, true)
                          .addField(`:crossed_swords: Arma: `, arma_2, true)
                          .setColor("#81E347");
                        await m.edit(embed)
                      }
                    }
                  }
                }
                else if(vida_1<=0 && vida_2<=0){
                  clearInterval(fase_niveles)
                  embed = new Discord.MessageEmbed()
                    .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
                    .setDescription(`Ambos habeis muerto. Una lástima.`)
                    .addField(`:one: JUGADOR`, message.author, true)
                    .addField(`RONDA FINAL`, client.config.ronda_duelos[message.author.id], true)
                    .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                    .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
                    .addField(`:heart: Vida: `, vida_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:heart: Vida: `, vida_2, true)
                    .addField(`:shield: Escudo: `, escudo_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:shield: Escudo: `, escudo_2, true)
                    .addField(`:crossed_swords: Arma: `, arma_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:crossed_swords: Arma: `, arma_2, true)
                    .setColor("#CC1212");
                  await m.edit(embed)
                  db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, vida = ${vida_1} WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                  })
                  db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, vida = ${vida_2} WHERE id = '${contrincante.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                  })
                }
                else if(vida_2<=0){
                  clearInterval(fase_niveles)
                  embed = new Discord.MessageEmbed()
                    .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
                    .setDescription(`Y el último superviviente es ${message.author}`)
                    .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                    .addField(`:one: JUGADOR`, message.author, true)
                    .addField(`RONDA FINAL`, client.config.ronda_duelos[message.author.id], true)
                    .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
                    .addField(`:heart: Vida: `, vida_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:heart: Vida: `, vida_2, true)
                    .addField(`:shield: Escudo: `, escudo_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:shield: Escudo: `, escudo_2, true)
                    .addField(`:crossed_swords: Arma: `, arma_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:crossed_swords: Arma: `, arma_2, true)
                    .setColor("#81E347");
                  await m.edit(embed)
                  db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, coins = ${filas.coins+(filas2.coins*0.1)}, xp = ${(Math.round(Math.random()*(100-50+(nivel_2/2)))+50)*bonificacion}, vida = ${vida_1} WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                  })
                  db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, coins = ${filas2.coins*0.9}, vida = ${vida_2} WHERE id = '${contrincante.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                  })
                }
                else if(vida_1<=0){
                  clearInterval(fase_niveles)
                  embed = new Discord.MessageEmbed()
                    .setTitle(`:raised_hand: EL DESAFIO DEL HONOR :maple_leaf:`)
                    .setDescription(`Y el último superviviente es <@${contrincante.id}>`)
                    .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                    .addField(`:one: JUGADOR`, message.author, true)
                    .addField(`RONDA FINAL`, client.config.ronda_duelos[message.author.id], true)
                    .addField(`:two: JUGADOR`, `<@${contrincante.id}>`, true)
                    .addField(`:heart: Vida: `, vida_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:heart: Vida: `, vida_2, true)
                    .addField(`:shield: Escudo: `, escudo_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:shield: Escudo: `, escudo_2, true)
                    .addField(`:crossed_swords: Arma: `, arma_1, true)
                    .addField(`\u200b`, `\u200b`, true)
                    .addField(`:crossed_swords: Arma: `, arma_2, true)
                    .setColor("#81E347");
                  await m.edit(embed)
                  db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, coins = ${filas.coins*0.9}, vida = ${vida_1} WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                  })
                  db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0, coins = ${filas2.coins+(filas.coins*0.1)}, xp = ${(Math.round(Math.random()*(100-50+(nivel_1/2)))+50)*bonificacion}, vida = ${vida_2} WHERE id = '${contrincante.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                  })
                }
                client.config.ronda_duelos[message.author.id]++;
              }, 15000)
            })
          }, 30000);
        }
        else if(m.content.toLowerCase()==="no" || m.content.toLowerCase()==="No" || m.content.toLowerCase()==="NO"){
          respuesta = 1;
          db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0 WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
          })
          collector.stop();
          return m.channel.send(new Discord.MessageEmbed().setDescription(`**${contrincante} HA RECHAZADO TU BATALLA, ${message.author}**`))
        }
      });
      collector.on("end", collected => {
        if(collected.size===0 || respuesta===0){
          db_discordhunter.run(`UPDATE usuarios SET estado_duelos = 0 WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
          })
          return message.channel.send(new Discord.MessageEmbed().setDescription(`**${message.author}, A ALGUIEN LE HAS DADO TANTO MIEDO QUE NO QUIERE ENFRENTARSE A TI... :rolling_eyes:**`));
        }
      });
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
