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
  "EMBED_LINKS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.desafio [nivel del 1 al 5]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(filas.estado_desafios===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: Ya estás dentro de un **DESAFÍO**.\n\nCuando acabes, podrás iniciar otro.").setColor(`#9262FF`))
    if(filas.prestigio<2) return message.channel.send(new Discord.MessageEmbed().setDescription(`:cd: **Necesitas ascender a Prestigio 2 para realizar esta actividad**`).setColor(`#9262FF`))

    let bonificacion;
    if(message.guild.id!='378197663629443083') bonificacion = 1;
    else bonificacion = 2;

    let nivel_elegido = args.join(" ");
    if(!nivel_elegido || (nivel_elegido!="1" && nivel_elegido!="2" && nivel_elegido!="3" && nivel_elegido!="4" && nivel_elegido!="5")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:1234: **Debes elegir un nivel**\n\n${estructura}`).setColor(`#9262FF`));

    db_discordhunter.run(`UPDATE usuarios SET estado_desafios = 1 WHERE id = '${message.author.id}'`, function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
    })

    let vidaactual = 100000;
    let dañoactual = 10000;
    client.config.recarga_desafio[message.author.id] = 0;

    let tiempo_collector;

    let nombreenemigo;
    let vidaenemigo;
    let dañoenemigo;
    let recargaenemigo = 0;

    if(nivel_elegido==="1"){
      vidaenemigo = vidaactual/2;
      dañoenemigo = dañoactual/2;
      nombreenemigo = 'Anguirus';
      tiempo_collector = 2000;
      nivel_elegido = 1;
    }
    if(nivel_elegido==="2"){
      vidaenemigo = vidaactual*1;
      dañoenemigo = dañoactual*1;
      nombreenemigo = 'Radon';
      tiempo_collector = 1750;
      nivel_elegido = 2;
    }
    if(nivel_elegido==="3"){
      vidaenemigo = vidaactual*3/2;
      dañoenemigo = dañoactual*3/2;
      nombreenemigo = 'King Ghidorah';
      tiempo_collector = 1500;
      nivel_elegido = 3;
    }
    if(nivel_elegido==="4"){
      vidaenemigo = vidaactual*2;
      dañoenemigo = dañoactual*2;
      nombreenemigo = 'Mothra';
      tiempo_collector = 1250;
      nivel_elegido = 4;
    }
    if(nivel_elegido==="5"){
      vidaenemigo = vidaactual*3;
      dañoenemigo = dañoactual*3;
      nombreenemigo = 'Godzilla';
      tiempo_collector = 1000;
      nivel_elegido = 5;
    }

    let descripcion_dinamica = `**EN PREPARACION...**`;
    let author_dinamica = `CARGANDO ACCION ENEMIGA...`;
    let img_charge = `https://especiales2.cooperativa.cl/2017/pruebas/fhuerta/modulos/iconos/gif/loading.gif`;
    let color_embed = `#6e7cff`;

    let embed_desafio = new Discord.MessageEmbed()
    .setAuthor(author_dinamica, img_charge)
    .setTitle(`🗡️ **DESAFIO PVE (NIVEL ${nivel_elegido})** 🗡️\n------------------------------------------`)
    .setDescription(`${descripcion_dinamica}`)
    .setColor(color_embed)
    .setThumbnail(message.author.avatarURL())
    .addField(`Enemigo:`, `${nombreenemigo}`)
    .addField(`Vida enemigo:`, `${vidaenemigo}`, true)
    .addField(`Daño enemigo:`, `${dañoenemigo}`, true)
    .addField("**----------------------------------**", "---------------------------------")
    .addField(`Jugador:`, `${message.author}`, true)
    .addField(`Vida:`, `${vidaactual}`, true)
    .addField(`Daño:`, `${dañoactual}`, true)
    .addField(`Cargas:`, `${client.config.recarga_desafio[message.author.id]}`, true);

    let numaleatorio;
    let information;
    let collector;
    message.channel.send(new Discord.MessageEmbed().setDescription(`**🎯 DESAFIO PVE PREPARADO ${message.author}. EMPIEZAS EN 30 SEGUNDOS ...**\n\nEste modo es interactivo. Cuando se te indique, escribe en el chat:\n- **1**: si quieres atacar\n- **2**: si quieres protegerte\n- **3**: si quieres recargar\n\nAcumula 3 recargas para realizar un ataque **supremo**, y eludir la defensa del enemigo. Mucha suerte!`))

    setTimeout(async function() {
      information = await message.channel.send(embed_desafio);
      let fase_pelea = setInterval(async function() {
        if(!information)
        {
          clearInterval(fase_pelea);
          return;
        }
        collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.channel.id === message.channel.id, {time : tiempo_collector});
        numaleatorio = Math.round(Math.random()*(3-1))+1;
        if(numaleatorio===1 && recargaenemigo===0) numaleatorio = 3;
        if(numaleatorio===3 && recargaenemigo===1) numaleatorio = 1;
        if(numaleatorio===1){
          author_dinamica = `¡ EL ENEMIGO ATACA !`;
          img_charge = `https://cdn.jsdelivr.net/emojione/assets/4.0/png/128/1f4a5.png`;
          recargaenemigo = 0;
        }
        if(numaleatorio===2){
          author_dinamica = `EL ENEMIGO SE PROTEGE`;
          img_charge = `https://mir-s3-cdn-cf.behance.net/project_modules/disp/803ab140043667.5606ce4e3ee6a.jpg`;
        }
        if(numaleatorio===3){
          author_dinamica = `EL ENEMIGO RECARGA SU ATAQUE...`;
          recargaenemigo = 1;
          img_charge = `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/emoji-one/104/battery_1f50b.png`;
        }
        descripcion_dinamica = `**¿QUÉ HACES TÚ?**`;
        color_embed = `#ffffff`;
        embed_desafio = new Discord.MessageEmbed()
        .setAuthor(author_dinamica, img_charge)
        .setTitle(`🗡️ **DESAFIO PVE (NIVEL ${nivel_elegido})** 🗡️\n------------------------------------------`)
        .setDescription(`${descripcion_dinamica}`)
        .setColor(color_embed)
        .setThumbnail(message.author.avatarURL())
        .addField(`Enemigo:`, `${nombreenemigo}`)
        .addField(`Vida enemigo:`, `${vidaenemigo}`, true)
        .addField(`Daño enemigo:`, `${dañoenemigo}`, true)
        .addField("**----------------------------------**", "---------------------------------")
        .addField(`Jugador:`, `${message.author}`, true)
        .addField(`Vida:`, `${vidaactual}`, true)
        .addField(`Daño:`, `${dañoactual}`, true)
        .addField(`Cargas:`, `${client.config.recarga_desafio[message.author.id]}`, true);
        information.edit(embed_desafio);
        collector.on("collect", async m => {
          if(m.content.toLowerCase()==="1") // ataque
          {
            if(!client.config.recarga_desafio[message.author.id] || client.config.recarga_desafio[message.author.id]===0 || client.config.recarga_desafio[message.author.id]===null) descripcion_dinamica = `Has atacado sin haber cargado tu ataque :persevere:`;
            else if(client.config.recarga_desafio[message.author.id]>=1){
              if(client.config.recarga_desafio[message.author.id]<3){
                if(numaleatorio===2) descripcion_dinamica = `Realizaste un ataque basico, pero el enemigo se defendió`;
                else if(numaleatorio===1){
                  vidaenemigo = vidaenemigo-dañoactual;
                  descripcion_dinamica = `Realizaste un ataque basico, pero tu enemigo también`;
                }
                else{
                  vidaenemigo = vidaenemigo-dañoactual;
                  descripcion_dinamica = `Realizaste un ataque basico`;
                }
              }
              if(client.config.recarga_desafio[message.author.id]>=3){
                vidaenemigo = vidaenemigo-dañoactual*3;
                descripcion_dinamica = `¡Realizaste un SUPERATAQUE!`;
              }
            }
            if(numaleatorio===1 && vidaenemigo>0) vidaactual = vidaactual-dañoenemigo;
            client.config.recarga_desafio[message.author.id] = 0;
            collector.stop();
          }
          else if(m.content.toLowerCase()==="2") // defensa
          {
            if(numaleatorio===1) descripcion_dinamica = `Te protegiste, y evitaste el ataque del enemigo`;
            if(numaleatorio===2) descripcion_dinamica = `Te protegiste del enemigo`;
            if(numaleatorio===3) descripcion_dinamica = `Te protegiste del enemigo`;
            collector.stop();
          }
          else if(m.content.toLowerCase()==="3") // recarga
          {
            if(numaleatorio===1){
              vidaactual = vidaactual-dañoenemigo;
              descripcion_dinamica = `Recargaste, pero el enemigo te atacó`;
              client.config.recarga_desafio[message.author.id] = client.config.recarga_desafio[message.author.id]+1;
            }
            if(numaleatorio===2){
              descripcion_dinamica = `Realizaste una recarga`;
              client.config.recarga_desafio[message.author.id] = client.config.recarga_desafio[message.author.id]+1;
            }
            if(numaleatorio===3){
              descripcion_dinamica = `Realizaste una recarga`;
              client.config.recarga_desafio[message.author.id] = client.config.recarga_desafio[message.author.id]+1;
            }
            if(client.config.recarga_desafio[message.author.id]>=3){
              descripcion_dinamica = `Realizaste una recarga, y cargaste el **SUPERATAQUE**`;
              if(numaleatorio===1) descripcion_dinamica = `Realizaste una recarga, y aunque el enemigo te atacó, cargaste el **SUPERATAQUE**`;
            }
            collector.stop();
          }
        });

        collector.on("end", async collected => {
          if(collected.size === 0){
            descripcion_dinamica = `¡No te dio tiempo a realizar ninguna accion! Debes ser mas veloz.`;
            if(numaleatorio===1) vidaactual = vidaactual-dañoenemigo;
          }
          if(vidaenemigo>0 && vidaactual>0){
            color_embed = `#e3e6ff`;
            author_dinamica = `CARGANDO ACCION ENEMIGA...`;
            img_charge = `https://especiales2.cooperativa.cl/2017/pruebas/fhuerta/modulos/iconos/gif/loading.gif`;
            embed_desafio = new Discord.MessageEmbed()
            .setAuthor(author_dinamica, img_charge)
            .setTitle(`🗡️ **DESAFIO PVE (NIVEL ${nivel_elegido})** 🗡️\n------------------------------------------`)
            .setDescription(`${descripcion_dinamica}`)
            .setColor(color_embed)
            .setThumbnail(message.author.avatarURL())
            .addField(`Enemigo:`, `${nombreenemigo}`)
            .addField(`Vida enemigo:`, `${vidaenemigo}`, true)
            .addField(`Daño enemigo:`, `${dañoenemigo}`, true)
            .addField("**----------------------------------**", "---------------------------------")
            .addField(`Jugador:`, `${message.author}`, true)
            .addField(`Vida:`, `${vidaactual}`, true)
            .addField(`Daño:`, `${dañoactual}`, true)
            .addField(`Cargas:`, `${client.config.recarga_desafio[message.author.id]}`, true);
            information = await message.channel.send(embed_desafio);
          }
          if(vidaenemigo<=0){
            clearInterval(fase_pelea);
            vidaenemigo = 0;
            color_embed = `#96db27`;
            author_dinamica = `¡ VICTORIA !`;
            img_charge = `https://www.emoji.co.uk/files/emoji-one/smileys-people-emoji-one/1342-victory-hand.png`;
            embed_desafio = new Discord.MessageEmbed()
            .setAuthor(author_dinamica, img_charge)
            .setTitle(`🗡️ **DESAFIO PVE (NIVEL ${nivel_elegido})** 🗡️\n------------------------------------------`)
            .setDescription(`${descripcion_dinamica}`)
            .setColor(color_embed)
            .setThumbnail(message.author.avatarURL())
            .addField(`Enemigo:`, `${nombreenemigo}`)
            .addField(`Vida enemigo:`, `${vidaenemigo}`, true)
            .addField(`Daño enemigo:`, `${dañoenemigo}`, true)
            .addField("**----------------------------------**", "---------------------------------")
            .addField(`Jugador:`, `${message.author}`, true)
            .addField(`Vida:`, `${vidaactual}`, true)
            .addField(`Daño:`, `${dañoactual}`, true)
            .addField(`Cargas:`, `${client.config.recarga_desafio[message.author.id]}`, true);
            message.channel.send(embed_desafio);
            db_discordhunter.run(`UPDATE usuarios SET coins = ${filas.coins+(10000*nivel_elegido*nivel_elegido*bonificacion)}, xp = ${filas.xp+(10000*nivel_elegido*nivel_elegido*bonificacion)}, estado_desafios = 0 WHERE id = '${message.author.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #489`)
            })
            let ayuda_trofeo = filas.logro_desafio;
            if(ayuda_trofeo===':x:'){
              if(nivel_elegido===3){
                db_discordhunter.run(`UPDATE usuarios SET logro_desafio = ':third_place:' WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #490`)
                })
              }
              if(nivel_elegido===4){
                db_discordhunter.run(`UPDATE usuarios SET logro_desafio = ':second_place:' WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #491`)
                })
              }
              if(nivel_elegido===5){
                db_discordhunter.run(`UPDATE usuarios SET logro_desafio = ':trophy:' WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #492`)
                })
              }
            }
            if(ayuda_trofeo===':third_place:'){
              if(nivel_elegido===4){
                db_discordhunter.run(`UPDATE usuarios SET logro_desafio = ':second_place:' WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #493`)
                })
              }
              if(nivel_elegido===5){
                db_discordhunter.run(`UPDATE usuarios SET logro_desafio = ':trophy:' WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #494`)
                })
              }
            }
            if(ayuda_trofeo===':second_place:'){
              if(nivel_elegido===5){
                db_discordhunter.run(`UPDATE usuarios SET logro_desafio = ':trophy:' WHERE id = '${message.author.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #495`)
                })
              }
            }

            if(nivel_elegido===1 && vidaactual===100000 && filas.contrato_casco===0){
              db_discordhunter.run(`UPDATE usuarios SET contrato_casco = 1 WHERE id = '${message.author.id}'`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
              })
            }
            else if(nivel_elegido===2 && vidaactual===100000 && filas.contrato_casco===1){
              db_discordhunter.run(`UPDATE usuarios SET contrato_casco = 2 WHERE id = '${message.author.id}'`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
              })
            }
            else if(nivel_elegido===3 && vidaactual===100000 && filas.contrato_casco===2){
              db_discordhunter.run(`UPDATE usuarios SET contrato_casco = 3 WHERE id = '${message.author.id}'`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
              })
            }
            else if(nivel_elegido===4 && vidaactual===100000 && filas.contrato_casco===3){
              db_discordhunter.run(`UPDATE usuarios SET contrato_casco = 4 WHERE id = '${message.author.id}'`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
              })
            }
            else if(nivel_elegido===5 && vidaactual===100000 && filas.contrato_casco===4 && filas.casco===":x:"){
              db_discordhunter.run(`UPDATE usuarios SET contrato_casco = 5, casco = ':white_check_mark:' WHERE id = '${message.author.id}'`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
                message.channel.send(new Discord.MessageEmbed().setAuthor(`¡HAS ENCONTRADO UN ARMA MÍSTICA!`, message.author.avatarURL()).setDescription(`**CASCO DE HADES**`).setImage("https://cdn.discordapp.com/attachments/523268901719769088/793504510064590858/erww.png"))
              })
            }
            else{
              db_discordhunter.run(`UPDATE usuarios SET contrato_casco = 0 WHERE id = '${message.author.id}'`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 de incursiones de 1 de DH`)
              })
            }
          }
          else if(vidaactual<=0){
            clearInterval(fase_pelea);
            vidaactual = 0;
            color_embed = `#eb5a3d`;
            author_dinamica = `¡ DERROTA !`;
            img_charge = `https://conteudo.imguol.com.br/blogs/62/files/2018/01/evitar-choro.png`;
            embed_desafio = new Discord.MessageEmbed()
            .setAuthor(author_dinamica, img_charge)
            .setTitle(`🗡️ **DESAFIO PVE (NIVEL ${nivel_elegido})** 🗡️\n------------------------------------------`)
            .setDescription(`${descripcion_dinamica}`)
            .setColor(color_embed)
            .setThumbnail(message.author.avatarURL())
            .addField(`Enemigo:`, `${nombreenemigo}`)
            .addField(`Vida enemigo:`, `${vidaenemigo}`, true)
            .addField(`Daño enemigo:`, `${dañoenemigo}`, true)
            .addField("**----------------------------------**", "---------------------------------")
            .addField(`Jugador:`, `${message.author}`, true)
            .addField(`Vida:`, `${vidaactual}`, true)
            .addField(`Daño:`, `${dañoactual}`, true)
            .addField(`Cargas:`, `${client.config.recarga_desafio[message.author.id]}`, true);
            message.channel.send(embed_desafio);
            db_discordhunter.run(`UPDATE usuarios SET estado_desafios = 0 WHERE id = '${message.author.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #496`)
            })
          }
        });
      }, 11000);
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
