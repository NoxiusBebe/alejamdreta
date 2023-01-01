/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.batalla [@usuario]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(filas.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud**\n\nCúrate en la tienda`).setColor(`#9262FF`))
    let contrincante = message.mentions.members.first()
    let opcion = args.join(" ")
    if(contrincante){
      if(contrincante.id===message.author.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **No puedes luchar contra ti mismo**`).setColor(`#9262FF`))
      let respuesta = 0;
      let bonificacion;
      if(message.guild.id!='378197663629443083') bonificacion = 1;
      else bonificacion = 4;

      db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${contrincante.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 de batalla en DH`)
        if(!filas2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **Tu oponente no tiene ninguna cuenta creada de Discord Hunter**`).setColor(`#9262FF`))
        if(filas2.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **Tu oponente no tiene salud. Debe curarse antes.**`).setColor(`#9262FF`))

        message.channel.send(new Discord.MessageEmbed().setDescription(`**${contrincante}, ¿aceptas una BATALLA contra ${message.author}?**\n\nResponde: **si** o **no**`).setColor(`#9262FF`))

        const collector = message.channel.createMessageCollector(m => m.author.id === contrincante.id && m.channel.id === message.channel.id, {time : 30000});
        collector.on("collect", async m => {
          if(m.content.toLowerCase()==="si" || m.content.toLowerCase()==="Si" || m.content.toLowerCase()==="SI"){
            respuesta = 1;
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
              // ----------------------------------------------------------------------------------------------
              if(escudo_2<=0){
                escudo_2 = 0
                vida_2 = vida_2-golpe_1;
              }
              if(escudo_2>0){
                escudo_2 = escudo_2-golpe_1
                if(escudo_2<=0) escudo_2 = 0;
              }

              if(vida_2<=0){ // GANA JUGADOR 1
                vida_2 = 0;
                let xp_ganados = (Math.round(Math.random()*(100-50+(nivel_2/2)))+50)*bonificacion;
                let coins_ganados = coins_2*0.1;
                let limit_xp = 100+(20*(nivel_1-1));
                let suma_xp = xp_1+xp_ganados;

                let embed = new Discord.MessageEmbed()
                  .setColor("#2888fc")
                  .setDescription(`**:crossed_swords: ${message.author} VS ${contrincante} :crossed_swords:**\n\n**VENCEDOR:** ${message.author}\n**PREMIO:** ${coins_ganados.toFixed(2)} coins, y ${xp_ganados} xp`)
                  .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                  .addField("**----------------------------------**", "---------------------------------")
                  .addField(`Salud de ${message.author.username}: `, vida_1, true)
                  .addField(`Escudo de ${message.author.username}: `, escudo_1, true)
                  .addField(`Arma de ${message.author.username}: `, nombres_armas_dh[arma_1-1], true)
                  .addField(`Salud de ${message.mentions.users.first().username}: `, vida_2, true)
                  .addField(`Escudo de ${message.mentions.users.first().username}: `, escudo_2, true)
                  .addField(`Arma de ${message.mentions.users.first().username}: `, nombres_armas_dh[arma_2-1], true);
                db_discordhunter.run(`UPDATE usuarios SET vida = 0, coins = ${coins_2*0.9} WHERE id = '${contrincante.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #5 exploracion de DH`)
                })
                if(suma_xp>limit_xp){
                  do{
                    nivel_1 = nivel_1+1;
                    suma_xp = suma_xp - limit_xp
                    limit_xp = 100+(20*(nivel_1-1));
                  }while(suma_xp>limit_xp)
                  let embed2 = new Discord.MessageEmbed()
                    .setDescription(`:high_brightness: **SUBISTES DE NIVEL** :high_brightness:`)
                    .setColor(`#fcd874`)
                    .addField(`Nivel anterior:`, nivel_inicial_1, true)
                    .addField(`Nivel nuevo:`, nivel_1, true)
                    .addField('**ENHORABUENA**: ', message.author);
                  db_discordhunter.run(`UPDATE usuarios SET coins = ${coins_1+coins_ganados}, xp = ${suma_xp}, nivel = ${nivel_1}, vida = ${100+(((nivel_1)-1)*2)} WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 exploracion de DH`)
                    await message.channel.send(embed)
                    await message.channel.send(embed2);
                    if(nivel_1>=50000 && prestigio_1<2){
                      db_discordhunter.run(`UPDATE usuarios SET prestigio = 2 WHERE id = '${message.author.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #10 exploracion de DH`)
                        message.channel.send(new Discord.MessageEmbed().setAuthor(`:cd: ¡ASCENDISTE A PRESTIGIO 2!`, message.author.avatarURL()))
                      })
                    }
                    if(nivel_1>=150000 && prestigio_1<3){
                      db_discordhunter.run(`UPDATE usuarios SET prestigio = 3 WHERE id = '${message.author.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #11 exploracion de DH`)
                        message.channel.send(new Discord.MessageEmbed().setAuthor(`:dvd: ¡ASCENDISTE A PRESTIGIO 3!`, message.author.avatarURL()))
                      })
                    }
                  })
                }
                else{
                  db_discordhunter.run(`UPDATE usuarios SET coins = ${coins_1+coins_ganados}, xp = ${suma_xp}, vida = ${vida_1} WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #5 exploracion de DH`)
                    await message.channel.send(embed)
                  })
                }
                return;
              }
              // ----------------------------------------------------------------------------------------------
              if(escudo_1<=0){
                escudo_1 = 0
                vida_1 = vida_1-golpe_2;
              }
              if(escudo_1>0){
                escudo_1 = escudo_1-golpe_2;
                if(escudo_1<=0) escudo_1 = 0;
              }

              if(vida_1<=0){ // GANA JUGADOR 2
                vida_1 = 0;
                let xp_ganados = (Math.round(Math.random()*(100-50+(nivel_1/2)))+50)*bonificacion;
                let coins_ganados = coins_1*0.1;
                let limit_xp = 100+(20*(nivel_2-1));
                let suma_xp = xp_2+xp_ganados;

                let embed = new Discord.MessageEmbed()
                  .setColor("#2888fc")
                  .setDescription(`**:crossed_swords: ${message.author} VS ${contrincante} :crossed_swords:**\n\n**VENCEDOR:** ${contrincante}\n**PREMIO:** ${coins_ganados.toFixed(2)} coins, y ${xp_ganados} xp`)
                  .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                  .addField("**----------------------------------**", "---------------------------------")
                  .addField(`Salud de ${message.author.username}: `, vida_1, true)
                  .addField(`Escudo de ${message.author.username}: `, escudo_1, true)
                  .addField(`Arma de ${message.author.username}: `, nombres_armas_dh[arma_1-1], true)
                  .addField(`Salud de ${message.mentions.users.first().username}: `, vida_2, true)
                  .addField(`Escudo de ${message.mentions.users.first().username}: `, escudo_2, true)
                  .addField(`Arma de ${message.mentions.users.first().username}: `, nombres_armas_dh[arma_2-1], true);
                db_discordhunter.run(`UPDATE usuarios SET vida = 0, coins = ${coins_1*0.9} WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #5 exploracion de DH`)
                })
                if(suma_xp>limit_xp){
                  do{
                    nivel_2 = nivel_2+1;
                    suma_xp = suma_xp - limit_xp
                    limit_xp = 100+(20*(nivel_2-1));
                  }while(suma_xp>limit_xp)
                  let embed2 = new Discord.MessageEmbed()
                    .setDescription(`:high_brightness: **SUBISTES DE NIVEL** :high_brightness:`)
                    .setColor(`#fcd874`)
                    .addField(`Nivel anterior:`, nivel_inicial_2, true)
                    .addField(`Nivel nuevo:`, nivel_2, true)
                    .addField('**ENHORABUENA**: ', contrincante);
                  db_discordhunter.run(`UPDATE usuarios SET coins = ${coins_2+coins_ganados}, xp = ${suma_xp}, nivel = ${nivel_2}, vida = ${100+(((nivel_2)-1)*2)} WHERE id = '${contrincante.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 exploracion de DH`)
                    await message.channel.send(embed)
                    await message.channel.send(embed2);
                    if(nivel_2>=50000 && prestigio_2<2){
                      db_discordhunter.run(`UPDATE usuarios SET prestigio = 2 WHERE id = '${contrincante.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #10 exploracion de DH`)
                        message.channel.send(new Discord.MessageEmbed().setAuthor(`:cd: ¡ASCENDISTE A PRESTIGIO 2!`, contrincante.avatarURL()))
                      })
                    }
                    if(nivel_2>=150000 && prestigio_2<3){
                      db_discordhunter.run(`UPDATE usuarios SET prestigio = 3 WHERE id = '${contrincante.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #11 exploracion de DH`)
                        message.channel.send(new Discord.MessageEmbed().setAuthor(`:dvd: ¡ASCENDISTE A PRESTIGIO 3!`, contrincante.avatarURL()))
                      })
                    }
                  })
                }
                else{
                  db_discordhunter.run(`UPDATE usuarios SET coins = ${coins_2+coins_ganados}, xp = ${suma_xp}, vida = ${vida_2} WHERE id = '${contrincante.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #5 exploracion de DH`)
                    await message.channel.send(embed)
                  })
                }
                return;
              }
            }
            while(vida_1>0 && vida_2>0);
          }
          else if(m.content.toLowerCase()==="no" || m.content.toLowerCase()==="No" || m.content.toLowerCase()==="NO"){
            respuesta = 1;
            collector.stop();
            return m.channel.send(new Discord.MessageEmbed().setDescription(`**${contrincante} HA RECHAZADO TU BATALLA, ${message.author}**`))
          }
        });
        collector.on("end", collected => {
          if(collected.size === 0) return message.channel.send(new Discord.MessageEmbed().setDescription(`**${message.author}, A ALGUIEN LE HAS DADO TANTO MIEDO QUE NO QUIERE PELEAR CONTIGO... :rolling_eyes:**`));
          if(respuesta===0) return message.channel.send(new Discord.MessageEmbed().setDescription(`**${message.author}, A ALGUIEN LE HAS DADO TANTO MIEDO QUE NO QUIERE PELEAR CONTIGO... :rolling_eyes:**`));
        });
      })
    }
    else if(opcion && opcion!=contrincante && (opcion==="online" || opcion==="Online" || opcion==="ONLINE")){
      if(filas.estado_batalla_1===1) return message.channel.send(new Discord.MessageEmbed().setDescription(`:globe_with_meridians: **YA ESTAS EN MATCHMAKING**.`)).then(m => m.delete({ timeout: 5000}))
      // EN DESARROLLO
      let bonificacion;
      if(message.guild.id!='378197663629443083') bonificacion = 1;
      else bonificacion = 4;

      db_discordhunter.all(`SELECT * FROM batalla_1`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 de batalla en DH`)
        db_discordhunter.run(`INSERT INTO batalla_1(numero, servidor, nombre_servidor, canal, id, nombre, bonificacion, pareja, vida_1) VALUES(${filas2.length}, '${message.guild.id}', '${message.guild.name}', '${message.channel.id}', '${message.author.id}', '${message.author.username}', ${bonificacion}, '---', ${-1})`, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 supervivencia de DH`)
          db_discordhunter.run(`UPDATE usuarios SET estado_batalla_1 = 1 WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
          })
          if((filas2.length%2)===0){
            let mensaje = await message.channel.send(new Discord.MessageEmbed().setAuthor(`Buscando partida...`, `https://www.appfacturainteligente.com/CFDI33/Responsivos/Imagenes/Mantenimiento/loader.gif`).setColor(`#156369`))
            let vueltas = 0;
            let partida = setInterval(async function() {
              db_discordhunter.get(`SELECT * FROM batalla_1 WHERE id = '${message.author.id}'`, async (err, filas3) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 supervivencia de DH`)
                if(filas3.pareja!="---" && filas3.vida_1!=-1){
                  let vencedor;
                  if(filas3.vida_1>0) vencedor = message.author.username;
                  else vencedor = filas3.nombre_pareja;
                  clearInterval(partida);
                  await mensaje.edit(new Discord.MessageEmbed().setDescription(`**¡ PARTIDA ENCONTRADA !**`).setColor(`#ffc219`))
                  setTimeout(async function() {
                    let embed = new Discord.MessageEmbed()
                      .setColor("#2888fc")
                      .setDescription(`**:crossed_swords: ${message.author.username} VS ${filas3.nombre_pareja} :crossed_swords:**\n\n**VENCEDOR:** ${vencedor}\n**PREMIO:** ${filas3.coins} coins, y ${filas3.xp} xp`)
                      .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                      .addField("**----------------------------------**", "---------------------------------")
                      .addField(`Salud de ${message.author.username}: `, filas3.vida_1, true)
                      .addField(`Escudo de ${message.author.username}: `, filas3.escudo_1, true)
                      .addField(`Arma de ${message.author.username}: `, nombres_armas_dh[filas3.arma_1-1], true)
                      .addField(`Salud de ${filas3.nombre_pareja}: `, filas3.vida_2, true)
                      .addField(`Escudo de ${filas3.nombre_pareja}: `, filas3.escudo_2, true)
                      .addField(`Arma de ${filas3.nombre_pareja}: `, nombres_armas_dh[filas3.arma_2-1], true);
                    if(filas3.canal_pareja!=filas3.canal) await mensaje.edit(embed)
                    else await mensaje.delete();
                    db_discordhunter.run(`DELETE FROM batalla_1 WHERE id = '${message.author.id}'`, function(err) {
                      if(err) return console.log(err.message + ` ERROR #3 actualizando sorteos`)
                    })
                    db_discordhunter.run(`UPDATE usuarios SET estado_batalla_1 = 0 WHERE id = '${message.author.id}'`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                    })
                    if(vencedor===message.author.username){
                      let arma_1 = filas.arma;
                      let nivel_inicial_1 = filas.nivel;
                      let nivel_1 = filas.nivel;
                      let xp_1 = filas.xp;
                      let coins_1 = filas.coins;
                      let prestigio_1 = filas.prestigio;

                      let limit_xp = 100+(20*(filas.nivel-1));
                      let suma_xp = filas.xp+filas3.xp;
                      if(suma_xp>limit_xp){
                        do{
                          nivel_1 = nivel_1+1;
                          suma_xp = suma_xp - limit_xp
                          limit_xp = 100+(20*(nivel_1-1));
                        }while(suma_xp>limit_xp)
                        let embed2 = new Discord.MessageEmbed()
                          .setDescription(`:high_brightness: **SUBISTES DE NIVEL** :high_brightness:`)
                          .setColor(`#fcd874`)
                          .addField(`Nivel anterior:`, nivel_inicial_1, true)
                          .addField(`Nivel nuevo:`, nivel_1, true)
                          .addField('**ENHORABUENA**: ', message.author);
                        db_discordhunter.run(`UPDATE usuarios SET coins = ${coins_1+filas3.coins}, xp = ${suma_xp}, nivel = ${nivel_1}, vida = ${100+(((nivel_1)-1)*2)} WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #2 exploracion de DH`)
                          await message.channel.send(embed2);
                          if(nivel_1>=50000 && prestigio_1<2){
                            db_discordhunter.run(`UPDATE usuarios SET prestigio = 2 WHERE id = '${message.author.id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #10 exploracion de DH`)
                              message.channel.send(new Discord.MessageEmbed().setAuthor(`:cd: ¡ASCENDISTE A PRESTIGIO 2!`, message.author.avatarURL()))
                            })
                          }
                          if(nivel_1>=150000 && prestigio_1<3){
                            db_discordhunter.run(`UPDATE usuarios SET prestigio = 3 WHERE id = '${message.author.id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #11 exploracion de DH`)
                              message.channel.send(new Discord.MessageEmbed().setAuthor(`:dvd: ¡ASCENDISTE A PRESTIGIO 3!`, message.author.avatarURL()))
                            })
                          }
                        })
                      }
                      else{
                        db_discordhunter.run(`UPDATE usuarios SET coins = ${coins_1+filas3.coins}, xp = ${suma_xp}, vida = ${filas3.vida_1} WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #5 exploracion de DH`)
                        })
                      }
                    }
                    db_discordhunter.run(`DELETE FROM batalla_1 WHERE id = '${message.author.id}'`, function(err) {
                      if(err) return console.log(err.message + ` ERROR #3 actualizando sorteos`)
                    })
                    db_discordhunter.run(`UPDATE usuarios SET estado_batalla_1 = 0 WHERE id = '${message.author.id}'`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                    })
                    return;
                  }, 3000);
                }
                else{
                  vueltas++;
                  if(vueltas===24){
                    clearInterval(partida);
                    await mensaje.edit(new Discord.MessageEmbed().setDescription(`**¡ NO SE HAN ENCONTRADO PARTIDAS DISPONIBLES !**`).setColor(`#6e0b0b`))
                    db_discordhunter.run(`DELETE FROM batalla_1 WHERE id = '${message.author.id}'`, function(err) {
                      if(err) return console.log(err.message + ` ERROR #3 actualizando sorteos`)
                    })
                    db_discordhunter.run(`UPDATE usuarios SET estado_batalla_1 = 0 WHERE id = '${message.author.id}'`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                    })
                    return;
                  }
                }
              })
            }, 3000)
          }
          else{
            let mensaje = await message.channel.send(new Discord.MessageEmbed().setAuthor(`Buscando partida...`, `https://www.appfacturainteligente.com/CFDI33/Responsivos/Imagenes/Mantenimiento/loader.gif`).setColor(`#156369`))
            let vueltas = 0;
            let partida = setInterval(async function() {
              db_discordhunter.all(`SELECT * FROM batalla_1`, async (err, filas3) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 supervivencia de DH`)
                for(var i=0 ; i<=filas3.length ; i=i+2){
                  if(filas3[i].pareja==="---"){
                    db_discordhunter.run(`UPDATE batalla_1 SET pareja = '${filas3[i].id}', nombre_pareja = '${filas3[i].nombre}', canal_pareja = '${filas3[i].canal}' WHERE id = '${message.author.id}'`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                    })
                    db_discordhunter.run(`UPDATE batalla_1 SET pareja = '${message.author.id}', nombre_pareja = '${message.author.username}', canal_pareja = '${message.channel.id}' WHERE id = '${filas3[i].id}'`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                    })
                    let contrincante = filas3[i].id;
                    clearInterval(partida);
                    await mensaje.edit(new Discord.MessageEmbed().setDescription(`**¡ PARTIDA ENCONTRADA !**`).setColor(`#ffc219`))
                    setTimeout(async function() {
                      db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${contrincante}'`, async (err, filas4) => {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #2 de batalla en DH`)
                        // ----------------------------------------------------------------------------------------------
                        let vida_1 = filas4.vida;
                        let escudo_1 = filas4.escudo
                        if(escudo_1===":x:") escudo_1 = 0;
                        if(escudo_1==="Madera") escudo_1 = 100;
                        if(escudo_1==="Acero") escudo_1 = 500;
                        if(escudo_1==="Bronce") escudo_1 = 1000;
                        if(escudo_1==="Plata") escudo_1 = 6000;
                        if(escudo_1==="Oro") escudo_1 = 20000;
                        if(escudo_1==="Platino") escudo_1 = 50000;
                        if(escudo_1==="Diamante") escudo_1 = 100000;
                        if(escudo_1==="Divina") escudo_1 = 500000;
                        let arma_1 = filas4.arma;
                        let golpe_1;
                        let nivel_inicial_1 = filas4.nivel;
                        let nivel_1 = filas4.nivel;
                        let xp_1 = filas4.xp;
                        let coins_1 = filas4.coins;
                        let prestigio_1 = filas4.prestigio;
                        // ----------------------------------------------------------------------------------------------
                        let vida_2 = filas.vida;
                        let escudo_2 = filas.escudo
                        if(escudo_2===":x:") escudo_2 = 0;
                        if(escudo_2==="Madera") escudo_2 = 100;
                        if(escudo_2==="Acero") escudo_2 = 500;
                        if(escudo_2==="Bronce") escudo_2 = 1000;
                        if(escudo_2==="Plata") escudo_2 = 6000;
                        if(escudo_2==="Oro") escudo_2 = 20000;
                        if(escudo_2==="Platino") escudo_2 = 50000;
                        if(escudo_2==="Diamante") escudo_2 = 100000;
                        if(escudo_2==="Divina") escudo_2 = 500000;
                        let arma_2 = filas.arma;
                        let golpe_2;
                        let nivel_inicial_2 = filas.nivel;
                        let nivel_2 = filas.nivel;
                        let xp_2 = filas.xp;
                        let coins_2 = filas.coins;
                        let prestigio_2 = filas.prestigio;
                        // ----------------------------------------------------------------------------------------------
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
                          // ----------------------------------------------------------------------------------------------
                          if(escudo_2<=0){
                            escudo_2 = 0
                            vida_2 = vida_2-golpe_1;
                          }
                          if(escudo_2>0){
                            escudo_2 = escudo_2-golpe_1
                            if(escudo_2<=0) escudo_2 = 0;
                          }

                          if(vida_2<=0){ // GANA JUGADOR 1
                            vida_2 = 0;
                            let xp_ganados = (Math.round(Math.random()*(100-50+(nivel_2/2)))+50)*filas3[i].bonificacion;
                            let coins_ganados = coins_2*0.1;
                            let limit_xp = 100+(20*(nivel_1-1));
                            let suma_xp = xp_1+xp_ganados;

                            let embed = new Discord.MessageEmbed()
                              .setColor("#2888fc")
                              .setDescription(`**:crossed_swords: ${filas3[i].nombre} VS ${message.author.username} :crossed_swords:**\n\n**VENCEDOR:** ${filas3[i].nombre}\n**PREMIO:** ${coins_ganados} coins, y ${xp_ganados} xp`)
                              .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                              .addField("**----------------------------------**", "---------------------------------")
                              .addField(`Salud de ${filas3[i].nombre}: `, vida_1, true)
                              .addField(`Escudo de ${filas3[i].nombre}: `, escudo_1, true)
                              .addField(`Arma de ${filas3[i].nombre}: `, nombres_armas_dh[arma_1-1], true)
                              .addField(`Salud de ${message.author.username}: `, vida_2, true)
                              .addField(`Escudo de ${message.author.username}: `, escudo_2, true)
                              .addField(`Arma de ${message.author.username}: `, nombres_armas_dh[arma_2-1], true);
                            mensaje.edit(embed)
                            db_discordhunter.run(`UPDATE usuarios SET vida = 0, coins = ${coins_2*0.9} WHERE id = '${message.author.id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #5 exploracion de DH`)
                            })
                            db_discordhunter.run(`UPDATE batalla_1 SET vida_1 = ${vida_1}, escudo_1 = ${escudo_1}, arma_1 = ${arma_1}, vida_2 = ${vida_2}, escudo_2 = ${escudo_2}, arma_2 = ${arma_2}, coins = ${coins_ganados}, xp = ${xp_ganados} WHERE id = '${message.author.id}'`, function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                            })
                            db_discordhunter.run(`UPDATE batalla_1 SET vida_1 = ${vida_1}, escudo_1 = ${escudo_1}, arma_1 = ${arma_1}, vida_2 = ${vida_2}, escudo_2 = ${escudo_2}, arma_2 = ${arma_2}, coins = ${coins_ganados}, xp = ${xp_ganados} WHERE id = '${contrincante}'`, function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                            })
                            db_discordhunter.run(`DELETE FROM batalla_1 WHERE id = '${message.author.id}'`, function(err) {
                              if(err) return console.log(err.message + ` ERROR #3 actualizando sorteos`)
                            })
                            db_discordhunter.run(`UPDATE usuarios SET estado_batalla_1 = 0 WHERE id = '${message.author.id}'`, function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                            })
                            return;
                          }
                          // ----------------------------------------------------------------------------------------------
                          if(escudo_1<=0){
                            escudo_1 = 0
                            vida_1 = vida_1-golpe_2;
                          }
                          if(escudo_1>0){
                            escudo_1 = escudo_1-golpe_2;
                            if(escudo_1<=0) escudo_1 = 0;
                          }

                          if(vida_1<=0){ // GANA JUGADOR 2
                            vida_1 = 0;
                            let xp_ganados = (Math.round(Math.random()*(100-50+(nivel_1/2)))+50)*bonificacion;
                            let coins_ganados = coins_1*0.1;
                            let limit_xp = 100+(20*(nivel_2-1));
                            let suma_xp = xp_2+xp_ganados;

                            let embed = new Discord.MessageEmbed()
                              .setColor("#2888fc")
                              .setDescription(`**:crossed_swords: ${filas3[i].nombre} VS ${message.author.username} :crossed_swords:**\n\n**VENCEDOR:** ${message.author.username}\n**PREMIO:** ${coins_ganados} coins, y ${xp_ganados} xp`)
                              .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
                              .addField("**----------------------------------**", "---------------------------------")
                              .addField(`Salud de ${filas3[i].nombre}: `, vida_1, true)
                              .addField(`Escudo de ${filas3[i].nombre}: `, escudo_1, true)
                              .addField(`Arma de ${filas3[i].nombre}: `, nombres_armas_dh[arma_1-1], true)
                              .addField(`Salud de ${message.author.username}: `, vida_2, true)
                              .addField(`Escudo de ${message.author.username}: `, escudo_2, true)
                              .addField(`Arma de ${message.author.username}: `, nombres_armas_dh[arma_2-1], true);
                            await mensaje.edit(embed)
                            db_discordhunter.run(`UPDATE usuarios SET vida = 0, coins = ${coins_1*0.9} WHERE id = '${contrincante}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #5 exploracion de DH`)
                            })
                            db_discordhunter.run(`UPDATE batalla_1 SET vida_1 = ${vida_1}, escudo_1 = ${escudo_1}, arma_1 = ${arma_1}, vida_2 = ${vida_2}, escudo_2 = ${escudo_2}, arma_2 = ${arma_2}, coins = ${coins_ganados}, xp = ${xp_ganados} WHERE id = '${message.author.id}'`, function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                            })
                            db_discordhunter.run(`UPDATE batalla_1 SET vida_1 = ${vida_1}, escudo_1 = ${escudo_1}, arma_1 = ${arma_1}, vida_2 = ${vida_2}, escudo_2 = ${escudo_2}, arma_2 = ${arma_2}, coins = ${coins_ganados}, xp = ${xp_ganados} WHERE id = '${contrincante}'`, function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                            })
                            if(suma_xp>limit_xp){
                              do{
                                nivel_2 = nivel_2+1;
                                suma_xp = suma_xp - limit_xp
                                limit_xp = 100+(20*(nivel_2-1));
                              }while(suma_xp>limit_xp)
                              let embed2 = new Discord.MessageEmbed()
                                .setDescription(`:high_brightness: **SUBISTES DE NIVEL** :high_brightness:`)
                                .setColor(`#fcd874`)
                                .addField(`Nivel anterior:`, nivel_inicial_2, true)
                                .addField(`Nivel nuevo:`, nivel_2, true)
                                .addField('**ENHORABUENA**: ', message.author);
                              db_discordhunter.run(`UPDATE usuarios SET coins = ${coins_2+coins_ganados}, xp = ${suma_xp}, nivel = ${nivel_2}, vida = ${100+(((nivel_2)-1)*2)} WHERE id = '${message.author.id}'`, async function(err) {
                                if(err) return console.log(err.message + ` ${message.content} ERROR #2 exploracion de DH`)
                                await message.channel.send(embed2);
                                if(nivel_2>=50000 && prestigio_2<2){
                                  db_discordhunter.run(`UPDATE usuarios SET prestigio = 2 WHERE id = '${message.author.id}'`, async function(err) {
                                    if(err) return console.log(err.message + ` ${message.content} ERROR #10 exploracion de DH`)
                                    message.channel.send(new Discord.MessageEmbed().setAuthor(`:cd: ¡ASCENDISTE A PRESTIGIO 2!`, message.author.avatarURL()))
                                  })
                                }
                                if(nivel_2>=150000 && prestigio_2<3){
                                  db_discordhunter.run(`UPDATE usuarios SET prestigio = 3 WHERE id = '${message.author.id}'`, async function(err) {
                                    if(err) return console.log(err.message + ` ${message.content} ERROR #11 exploracion de DH`)
                                    message.channel.send(new Discord.MessageEmbed().setAuthor(`:dvd: ¡ASCENDISTE A PRESTIGIO 3!`, message.author.avatarURL()))
                                  })
                                }
                              })
                            }
                            else{
                              db_discordhunter.run(`UPDATE usuarios SET coins = ${coins_2+coins_ganados}, xp = ${suma_xp}, vida = ${vida_2} WHERE id = '${message.author.id}'`, async function(err) {
                                if(err) return console.log(err.message + ` ${message.content} ERROR #5 exploracion de DH`)
                              })
                            }
                            db_discordhunter.run(`DELETE FROM batalla_1 WHERE id = '${message.author.id}'`, function(err) {
                              if(err) return console.log(err.message + ` ERROR #3 actualizando sorteos`)
                            })
                            db_discordhunter.run(`UPDATE usuarios SET estado_batalla_1 = 0 WHERE id = '${message.author.id}'`, function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                            })
                            return;
                          }
                        }
                        while(vida_1>0 && vida_2>0);
                      });
                    }, 3000);
                    break;
                  }
                  else if(i>=filas3.length){
                    vueltas++;
                    if(vueltas===24){
                      clearInterval(partida);
                      await mensaje.edit(new Discord.MessageEmbed().setDescription(`**¡ NO SE HAN ENCONTRADO PARTIDAS DISPONIBLES !**`).setColor(`#6e0b0b`))
                      db_discordhunter.run(`DELETE FROM batalla_1 WHERE id = '${message.author.id}'`, function(err) {
                        if(err) return console.log(err.message + ` ERROR #3 actualizando sorteos`)
                      })
                      db_discordhunter.run(`UPDATE usuarios SET estado_batalla_1 = 0 WHERE id = '${message.author.id}'`, function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #2 sanando en DH`)
                      })
                      return;
                    }
                  }
                }
              })
            }, 3000)
          }
        })
      })
    }
    else return message.channel.send(new Discord.MessageEmbed().setDescription(":woozy_face: **DEBES ELEGIR UN MODO DE BATALLA VÁLIDO.**\n\n**Tipos:**\n:one: `"+client.config.prefijos[message.guild.id]+"dh.batalla @usuario`\n:two: `"+client.config.prefijos[message.guild.id]+"dh.batalla online`")).then(m => m.delete({ timeout: 10000}))
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
