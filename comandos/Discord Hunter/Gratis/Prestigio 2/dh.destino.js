/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.destino [elige: facil, normal o dificl]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(filas.estado_destino===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: Ya estás jugándote tu **DESTINO**.\n\nCuando acabes, podrás hacerlo otra vez").setColor(`#9262FF`))
    if(filas.prestigio<2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:cd: **Necesitas ascender a Prestigio 2 para realizar esta actividad**`).setColor(`#9262FF`))

    let elegir_modo = args.join(" ");
    if(!elegir_modo || (elegir_modo!="facil" && elegir_modo!="normal" && elegir_modo!="dificil")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Modo de dificultado incorrecto**\n\n${estructura}`).setColor(`#9262FF`))

    let nivel_limite;
    if(elegir_modo === "facil") nivel_limite = 5;
    else if(elegir_modo === "normal") nivel_limite = 7;
    else if(elegir_modo === "dificil") nivel_limite = 10;

    let escudo = filas.escudo;
    if(escudo===":x:") escudo = 0;
    if(escudo==="Madera") escudo = 100;
    if(escudo==="Acero") escudo = 500;
    if(escudo==="Bronce") escudo = 1000;
    if(escudo==="Plata") escudo = 6000;
    if(escudo==="Oro") escudo = 20000;
    if(escudo==="Platino") escudo = 50000;
    if(escudo==="Diamante") escudo = 100000;
    if(escudo==="Divina") escudo = 500000;

    let vida_jugador = filas.vida+escudo;
    let coins_jugador = 0;
    let xp_jugador = 0;
    let pieza_arma_mistica = 0;

    let bonificacion;
    if(message.guild.id!='378197663629443083') bonificacion = 1;
    else bonificacion = 2;

    db_discordhunter.run(`UPDATE usuarios SET estado_destino = 1 WHERE id = '${message.author.id}'`, function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
    })

    let level = {};

    level['1'] = [01,85,90,100];
    level['2'] = [02,85,91,100];
    level['3'] = [03,80,92,100];
    level['4'] = [04,75,93,100];
    level['5'] = [05,75,94,100];
    level['6'] = [06,60,95,100];
    level['7'] = [07,80,96,100];
    level['8'] = [08,60,97,100];
    level['9'] = [09,66,98,100];
    level['10'] = [10,45,99,100];

    let inicio = new Discord.MessageEmbed()
      .setTitle(`:raised_hands: TU DESTINO PENDE DE UN HILO :raised_hands:`)
      .setDescription(`**Bienvenido al sendero que marcará tu destino al final del camino.**\n\nEn cada nivel, deberás elegir atravesar 1 puerta a elegir entre 4. Cada puerta esconde un final distinto, desde conseguir monedas, hasta morir frente a una bestia voraz.\n\n:warning: La sanación de vida y escudo están desactivadas.\n\nTodas las recompensas que consigas, solo las ganarás si logras llegar al final.\n\n**¡Sigue las indicaciones, y mucha suerte!**`)
      .setColor(`#FFFCDD`)
      .setThumbnail(message.author.avatarURL())
      .addField(`Vida: `, vida_jugador, true)
      .addField(`Coins: `, coins_jugador.toFixed(2), true)
      .addField(`XP: `, xp_jugador.toFixed(2), true)
      .setFooter(`Empezarás en breve...`)
    message.channel.send(inicio)


    setTimeout(async function() {

      for(var i=1 ; i<=nivel_limite ; i++){
        let embed = new Discord.MessageEmbed()
          .setTitle(`:raised_hands: TU DESTINO PENDE DE UN HILO (NIVEL ${i}) :raised_hands:`)
          .setDescription(`**Cada puerta conduce a un destino diferente. Decide bien por dónde quieres cruzar, tu vida depende de ello...**\n\n`+
          `Reacciona al color de la puerta que desees atravesar:`)
          .setThumbnail(message.author.avatarURL())
          .setColor(`#FFFCDD`)
          .setImage(`https://cdn.discordapp.com/attachments/823263020246761523/867382786024669184/Presentacio123123n1.png`)
          .addField(`Vida: `, vida_jugador, true)
          .addField(`Coins: `, coins_jugador.toFixed(2), true)
          .addField(`XP: `, xp_jugador.toFixed(2), true)
          .setFooter(`Tienes 60 segundos para elegir...`)
        let msg = await message.channel.send(embed)

        await msg.react('🟥')
        await msg.react('🟦')
        await msg.react('🟩')
        await msg.react('🟨')

        let aleatorio = Math.round(Math.random()*100);

        const decision = await new Promise((resolve, reject) => {
          const collector = msg.createReactionCollector((reaction, user) => !user.bot && user.id === message.author.id && reaction.message.channel.id === msg.channel.id, { time: 60000 });
          collector.on('collect', r => {
            if(r.emoji.name==="🟥" || r.emoji.name==="🟦" || r.emoji.name==="🟩" || r.emoji.name==="🟨"){
              resolve(r.emoji.name);
              r.users.remove(message.author);
              collector.stop();
            }
            else resolve(null)
          });
          collector.on('end', () => resolve(null));
        });

        if(decision === null){
          msg.edit(embed.setTitle(`:raised_hands: ABANDONO (NIVEL ${i}) :raised_hands:`).setDescription(`**¡NO ME LO CREO! Has dejado tu destino en mis manos, y he decidido que has llegado al final**\n\nEs lo que tiene no responder a tiempo...`).setColor(`#010014`))
          vida_jugador = -5000;
        }
        else{
          if(aleatorio <= level[`${i}`][0]){

            let aleatorio2 = Math.round(Math.random()*10);

            if(aleatorio2>7){
              msg.edit(embed.setTitle(`:raised_hands: EL MANTERISTA (NIVEL ${i}) :raised_hands:`).setDescription(`**¡BIENVENIDO A DOBLE O NADA!**\n\n¿Quieres probar suerte para doblar tus recompensas? ¡Recuerda que si no te toca, perderás todo lo que tienes!\n\n👍 Si\n👎 No`).setFooter(`Tienes 60 segundos para elegir...`))
              await msg.react('👍')
              await msg.react('👎')

              const decision2 = await new Promise((resolve, reject) => {
                const collector2 = msg.createReactionCollector((reaction, user) => !user.bot && user.id === message.author.id && reaction.message.channel.id === msg.channel.id, { time: 60000 });
                collector2.on('collect', r => {
                  if(r.emoji.name==="👍" || r.emoji.name==="👎"){
                    resolve(r.emoji.name);
                    r.users.remove(message.author);
                    collector.stop();
                  }
                  else resolve(null)
                });
                collector2.on('end', () => resolve(null));
              });

              if(decision2 === "👍"){
                let aleatorio3 = Math.round(Math.random());

                if(aleatorio3 === 0){
                  coins_jugador = 0
                  xp_jugador = 0
                  msg.edit(embed.setDescription(`**¡NOOOOO! Lo perdiste todo**\n\nMás suerte la próxima vez...`).setFooter(`Niveles superados: ${i} || Niveles restantes: ${nivel_limite-i}`))
                }
                else{
                  coins_jugador = coins_jugador*2
                  xp_jugador = xp_jugador*2
                  msg.edit(embed.setDescription(`**¡SIIIII! Obtuviste el doble**\n\nTu suerte es mayor de lo que pensaba...`).setFooter(`Niveles superados: ${i} || Niveles restantes: ${nivel_limite-i}`))
                }
              }
              else msg.edit(embed.setDescription(`**No pasa nada, podemos hacerlo en cualquier otro momento**`).setFooter(`Niveles superados: ${i} || Niveles restantes: ${nivel_limite-i}`))
            }
            else{
              msg.edit(embed.setTitle(`:raised_hands: EL GRAN VACÍO (NIVEL ${i}) :raised_hands:`).setDescription(`**¡NO PUEDE SER! Caiste en la trampa del sendero maligno, y caíste al vacío**\n\nHas muerto en un bucle infinito de sufrimiento. No hay nada que hacer. Se acabó.`).setColor(`#010014`))
              vida_jugador = -5000;
            }
          }
          else if(aleatorio <= level[`${i}`][1]){
            coins_jugador = coins_jugador + (Math.pow(i,i/5)*1000*filas.prestigio)
            xp_jugador = xp_jugador + (Math.pow(i,i/5)*1000*filas.prestigio)
            vida_jugador = vida_jugador - (i*i*2500/2)
            if(vida_jugador<0) vida_jugador = 0;
            msg.edit(embed.setTitle(`:raised_hands: CUARTO DE LUCHA (NIVEL ${i}) :raised_hands:`).setDescription(`**¡OH NO! Un enemigo te ha atacado, y has perdido ${(i*i*2500/2)} puntos de vida**\n\nTe queda: ${vida_jugador} de vida. Debes tener cuidado la próxima vez...`).setFooter(`Niveles superados: ${i} || Niveles restantes: ${nivel_limite-i}`))
          }
          else if(aleatorio <= level[`${i}`][2]){
            coins_jugador = coins_jugador + (Math.pow(i,i/5)*1000*filas.prestigio)
            xp_jugador = xp_jugador + (Math.pow(i,i/5)*1000*filas.prestigio)
            vida_jugador = vida_jugador - (i*i*2500)
            if(vida_jugador<0) vida_jugador = 0;
            msg.edit(embed.setTitle(`:raised_hands: HABITACIÓN DEL PÁNICO (NIVEL ${i}) :raised_hands:`).setDescription(`**¡OH NO! Un enemigo supremo te ha atacado, y has perdido ${(i*i*2500)} puntos de vida**\n\nTe queda: ${vida_jugador} de vida. Debes tener mucho más cuidado la próxima vez...`).setFooter(`Niveles superados: ${i} || Niveles restantes: ${nivel_limite-i}`))
          }
          else if(aleatorio <= level[`${i}`][3]){
            let aleatorio2;
            if(vida_jugador>=10000) aleatorio2 = Math.round(Math.random()*1);
            else aleatorio2 = Math.round(Math.random()*2);

            if(aleatorio === 0){
              coins_jugador = coins_jugador + (Math.pow(i,i/4.5)*10000*filas.prestigio)
              msg.edit(embed.setTitle(`:raised_hands: SALA DEL TESORO (NIVEL ${i}) :raised_hands:`).setDescription(`**¡GENIAL! No solo superaste el nivel, sino que ganaste ${Math.pow(i,i/4.5)*10000*filas.prestigio} coins**\n\nDebes dar gracias por la suerte que tienes, que no es poca...`).setFooter(`Niveles superados: ${i} || Niveles restantes: ${nivel_limite-i}`))
            }
            else if(aleatorio === 1){
              xp_jugador = xp_jugador + (Math.pow(i,i/4.5)*10000*filas.prestigio)
              msg.edit(embed.setTitle(`:raised_hands: SALA DEL TESORO (NIVEL ${i}) :raised_hands:`).setDescription(`**¡GENIAL! No solo superaste el nivel, sino que ganaste ${Math.pow(i,i/4.5)*10000*filas.prestigio} xp**\n\nDebes dar gracias por la suerte que tienes, que no es poca...`).setFooter(`Niveles superados: ${i} || Niveles restantes: ${nivel_limite-i}`))
            }
            else{
              vida_jugador = vida_jugador+((filas.vida+escudo-vida_jugador)/2);
              msg.edit(embed.setTitle(`:raised_hands: CARPA DEL CURANDERO (NIVEL ${i}) :raised_hands:`).setDescription(`**¡GENIAL! No solo superaste el nivel, sino que has recuperado parte de tu vida**\n\nDebes dar gracias por la suerte que tienes, que no es poca...`).setFooter(`Niveles superados: ${i} || Niveles restantes: ${nivel_limite-i}`))
            }
          }
        }

        if(vida_jugador>0 && i===nivel_limite){
          if(vida_jugador>filas.vida) vida_jugador = filas.vida;
          message.channel.send(new Discord.MessageEmbed().setDescription(`:partying_face: __**HAS LOGRADO MANEJAR TU PROPIO DESTINO**__ :raised_hands:\n\nCualquier recompensa que consiguieras a lo largo de tu camino, se te será ingresada de inmediato`).setColor(`#51CD5A`))
          db_discordhunter.run(`UPDATE usuarios SET coins = ${filas.coins+(coins_jugador*bonificacion)}, xp = ${filas.xp+(xp_jugador*bonificacion)}, estado_destino = 0, vida = ${vida_jugador} WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #1 en destino`)
          })
          return;
        }
        else if(vida_jugador<=0){
          message.channel.send(new Discord.MessageEmbed().setDescription(`:sob: __**HAS PERDIDO**__ :raised_hands:\n\nCualquier recompensa que consiguieras a lo largo de tu camino, la has perdido`).setColor(`#C33D3D`))
          db_discordhunter.run(`UPDATE usuarios SET vida = 0, estado_destino = 0 WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 en destino`)
          })
          return;
        }
        await sleep(12000)
      }
    }, 15000);
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
