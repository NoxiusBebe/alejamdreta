/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_pizzeria = new sqlite3.Database("./memoria/db_pizzeria.sqlite");
const db_gourmet = new sqlite3.Database("./memoria/db_gourmet.sqlite");

const pizzas_lujo = require("../../../archivos/Documentos/Juegos/pizzasdelujo_nombres.json")
const imagenes_lujo = require("../../../archivos/Documentos/Juegos/pizzasdelujo_imagenes.json")

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"

}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "ADD_REACTIONS": "✅",
  "MANAGE_MESSAGES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "pizzero`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FBACAC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FBACAC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.juegos===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-juegos.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#FBACAC`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    db_pizzeria.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 siendo pizzero`)
      let contador = 0;
      message.delete();
      if(filas2){
        if(filas2.dinero>=500) return message.channel.send(new Discord.MessageEmbed().setDescription(`:moneybag: **¡Tu cartera ya no da para más! Empieza a comprar pizzas ya, y gasta un poco**`).setColor(`#FBACAC`))
        if(filas2.estado===0 && (filas2.ocupado===0 || filas2.ocupado===1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pizza: **A ver, de una en una, que si no te atragantas. Termina con tu pedido y después si eso, pide otra**`).setColor(`#FBACAC`))
        else if(filas2.estado===1 && (filas2.ocupado===0 || filas2.ocupado===1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pizza: **Por muy buen pizzero que seas, que no se te amontonen los pedidos. Termina el que tienes, y ya después ponte con otro**`).setColor(`#FBACAC`))
        let mensaje = await message.channel.send(new Discord.MessageEmbed().setAuthor("Esperando que suene el telefono...", `https://cdn.discordapp.com/attachments/523268901719769088/783651927333273630/AgreeableSoupyChanticleer-max-1mb.gif`).setThumbnail(message.author.avatarURL())).then(m => {
          db_pizzeria.run(`UPDATE usuarios SET estado = 1, ocupado = 0, entrega = NULL, canal = '${message.channel.id}', mensaje = '${m.id}', pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 siendo pizzero`)
            let intervalo = setInterval(async function() {
              db_pizzeria.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas3) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 siendo pizzero`)
                if(filas3.ocupado===1){
                  db_pizzeria.get(`SELECT * FROM usuarios WHERE pareja = '${message.author.id}'`, async (err, filas5) => {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #4 siendo pizzero`)
                    clearInterval(intervalo)
                    db_pizzeria.run(`UPDATE usuarios SET ocupado = 1 WHERE id = '${message.author.id}'`, async function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #5 siendo pizzero`)
                      m.edit(new Discord.MessageEmbed().setAuthor(`¡Está sonando el telefono! Un cliente quiere pedir una pizza.`, `https://thumbs.gfycat.com/CompetentWindingFrigatebird-small.gif`).setThumbnail(message.author.avatarURL()))
                      let entrega = 0;
                      let contX = 0;
                      const respuesta2 = await new Promise((resolve, reject) => {
                        let intervalo2 = setInterval(async function() {
                          if(contX===30){
                            db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #6 siendo pizzero`)
                              m.edit(new Discord.MessageEmbed().setAuthor("Tu cliente se ha dormido al teléfono. Déjalo descansar", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`).setThumbnail(message.author.avatarURL()))
                              clearInterval(intervalo2)
                            });
                            db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas5.id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #7 siendo pizzero`)
                              try{client.channels.resolve(filas5.canal).messages.fetch(filas5.mensaje, true).edit(new Discord.MessageEmbed().setAuthor("Veo que no tienes muchas ganas de pizza. Vuelve a dormir", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`))}catch(err){}
                              clearInterval(intervalo2)
                            });
                            return clearInterval(intervalo)
                          }
                          db_pizzeria.get(`SELECT * FROM usuarios WHERE pareja = '${message.author.id}'`, async (err, filas4) => {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #8 siendo pizzero`)
                            entrega = filas4.entrega
                            if(entrega===1 || entrega===2 || entrega===3 || entrega===4 || entrega===5 || entrega===6 || entrega===7 || entrega===8 || entrega===9 || entrega===10){
                              resolve(entrega)
                              clearInterval(intervalo2)
                            }
                          })
                          contX++;
                        }, 2000)
                      })
                      if(!respuesta2){
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #9 siendo pizzero`)
                          m.edit(new Discord.MessageEmbed().setAuthor("Tu cliente se ha dormido al teléfono. Déjalo descansar", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`).setThumbnail(message.author.avatarURL()))
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas5.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #10 siendo pizzero`)
                          try{client.channels.resolve(filas5.canal).messages.fetch(filas5.mensaje, true).edit(new Discord.MessageEmbed().setAuthor("Veo que no tienes muchas ganas de pizza. Vuelve a dormir", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`))}catch(err){}
                        });
                        return clearInterval(intervalo)
                      }
                      let pizzas = ['Margarita', 'Cuatro Quesos', 'Carbonara', 'Barbacoa', 'Patanegra', 'Cremozza BBQ', 'Pecado Carnal', 'Hawaiana', 'Extravaganzza', 'Pepperoni']
                      let fotos_pizzas = ['https://cdn.discordapp.com/attachments/488739239287062538/783826887629078610/image-removebg-preview_4.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783827089483759626/image-removebg-preview_5.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783827327481544724/image-removebg-preview_7.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783827546499317780/image-removebg-preview_8.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783827683539812352/image-removebg-preview_9.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828048024829982/image-removebg-preview_10.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828218637451274/image-removebg-preview_11.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828421481594901/image-removebg-preview_12.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828613274796072/image-removebg-preview_13.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828793341116436/image-removebg-preview_14.png']
                      m.edit(new Discord.MessageEmbed().setAuthor(`Tu cliente acaba de pedirte una pizza. ¿Aceptas el pedido?`, `https://cdn.discordapp.com/attachments/523268901719769088/783672848009920512/giphy_1.gif`).setDescription(`Encargo: **Pizza ${pizzas[respuesta2-1]}**`).setThumbnail(message.author.avatarURL()))
                      await m.react("✅");
                      const respuesta1 = await new Promise((resolve, reject) => {
                        const collector = m.createReactionCollector((reaction, user) => !user.bot && user.id === message.author.id && reaction.message.channel.id === m.channel.id, { time: 60000 });
                        collector.on('collect', r => {
                          resolve(r.emoji.name);
                          r.users.remove(message.author);
                          collector.stop();
                        });
                        collector.on('end', () => resolve(null));
                      });
                      if(!respuesta1){
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #11 siendo pizzero`)
                          m.edit(new Discord.MessageEmbed().setAuthor("¿Acabas de dejar escapar un pedido? Vaya tela...", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`).setThumbnail(message.author.avatarURL()))
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas5.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #12 siendo pizzero`)
                          try{client.channels.resolve(filas5.canal).messages.fetch(filas5.mensaje, true).edit(new Discord.MessageEmbed().setAuthor("Creo que al pizzero se le olvidó tu pizza. Perdon por las molestias", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`))}catch(err){}
                        });
                        return clearInterval(intervalo)
                      }
                      else{
                        let parejita = filas5.id;
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, entrega = 1, dinero = ${filas3.dinero+50}, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #13 siendo pizzero`)
                          m.edit(new Discord.MessageEmbed().setAuthor("Horneando, espera un momentín...", `https://media2.giphy.com/media/33HqleoNUwfV1CvIz4/source.gif`).setThumbnail(message.author.avatarURL()))
                          m.reactions.removeAll()
                          setTimeout(async function(){
                            m.edit(new Discord.MessageEmbed().setAuthor("Pedido completado, siéntete orgulloso", `https://tetranoodle.com/wp-content/uploads/2018/07/tick-gif.gif`).setImage(fotos_pizzas[respuesta2-1]).setThumbnail(message.author.avatarURL()))
                          }, 5000);
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, dinero = ${filas5.dinero-50}, pareja = NULL WHERE id = '${parejita}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #14 siendo pizzero`)
                        });
                        return clearInterval(intervalo)
                      }
                    });
                  })
                }
                if(contador>=24){
                  db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #15 siendo pizzero`)
                    m.edit(new Discord.MessageEmbed().setAuthor("Nadie quiere pizza hoy...", `https://cdn.discordapp.com/attachments/523268901719769088/783655152929603584/TorielHomescreem.gif`).setThumbnail(message.author.avatarURL()))
                    return clearInterval(intervalo)
                  });
                }
              })
              contador++;
            }, 5000)
          })
        })
      }
      else{
        let mensaje = await message.channel.send(new Discord.MessageEmbed().setAuthor("Esperando que suene el telefono...", `https://cdn.discordapp.com/attachments/523268901719769088/783651927333273630/AgreeableSoupyChanticleer-max-1mb.gif`)).then(m => {
          db_pizzeria.run(`INSERT INTO usuarios(id, estado, ocupado, canal, mensaje, dinero) VALUES('${message.author.id}', 1, 0, '${message.channel.id}', '${m.id}', 50)`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #16 siendo pizzero`)
            let intervalo = setInterval(async function() {
              db_pizzeria.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas3) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #17 siendo pizzero`)
                if(filas3.ocupado===1){
                  db_pizzeria.get(`SELECT * FROM usuarios WHERE pareja = '${message.author.id}'`, async (err, filas5) => {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #18 siendo pizzero`)
                    clearInterval(intervalo)
                    db_pizzeria.run(`UPDATE usuarios SET ocupado = 1 WHERE id = '${message.author.id}'`, async function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #19 siendo pizzero`)
                      m.edit(new Discord.MessageEmbed().setAuthor(`¡Está sonando el telefono! Un cliente quiere pedir una pizza.`, `https://thumbs.gfycat.com/CompetentWindingFrigatebird-small.gif`).setThumbnail(message.author.avatarURL()))
                      let entrega = 0;
                      let contX = 0;
                      const respuesta2 = await new Promise((resolve, reject) => {
                        let intervalo2 = setInterval(async function() {
                          if(contX===30){
                            db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #20 siendo pizzero`)
                              m.edit(new Discord.MessageEmbed().setAuthor("Tu cliente se ha dormido al teléfono. Déjalo descansar", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`).setThumbnail(message.author.avatarURL()))
                              clearInterval(intervalo2)
                            });
                            db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas5.id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #21 siendo pizzero`)
                              try{client.channels.resolve(filas5.canal).messages.fetch(filas5.mensaje, true).edit(new Discord.MessageEmbed().setAuthor("Veo que no tienes muchas ganas de pizza. Vuelve a dormir", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`))}catch(err){}
                              clearInterval(intervalo2)
                            });
                            return clearInterval(intervalo)
                          }
                          db_pizzeria.get(`SELECT * FROM usuarios WHERE pareja = '${message.author.id}'`, async (err, filas4) => {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #22 siendo pizzero`)
                            entrega = filas4.entrega
                            if(entrega===1 || entrega===2 || entrega===3 || entrega===4 || entrega===5 || entrega===6 || entrega===7 || entrega===8 || entrega===9 || entrega===10){
                              resolve(entrega)
                              clearInterval(intervalo2)
                            }
                          })
                          contX++;
                        }, 2000)
                      })
                      if(!respuesta2){
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #23 siendo pizzero`)
                          m.edit(new Discord.MessageEmbed().setAuthor("Tu cliente se ha dormido al teléfono. Déjalo descansar", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`).setThumbnail(message.author.avatarURL()))
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas5.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #24 siendo pizzero`)
                          try{client.channels.resolve(filas5.canal).messages.fetch(filas5.mensaje, true).edit(new Discord.MessageEmbed().setAuthor("Veo que no tienes muchas ganas de pizza. Vuelve a dormir", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`))}catch(err){}
                        });
                        return clearInterval(intervalo)
                      }
                      let pizzas = ['Margarita', 'Cuatro Quesos', 'Carbonara', 'Barbacoa', 'Patanegra', 'Cremozza BBQ', 'Pecado Carnal', 'Hawaiana', 'Extravaganzza', 'Pepperoni']
                      let fotos_pizzas = ['https://cdn.discordapp.com/attachments/488739239287062538/783826887629078610/image-removebg-preview_4.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783827089483759626/image-removebg-preview_5.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783827327481544724/image-removebg-preview_7.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783827546499317780/image-removebg-preview_8.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783827683539812352/image-removebg-preview_9.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828048024829982/image-removebg-preview_10.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828218637451274/image-removebg-preview_11.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828421481594901/image-removebg-preview_12.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828613274796072/image-removebg-preview_13.png', 'https://cdn.discordapp.com/attachments/488739239287062538/783828793341116436/image-removebg-preview_14.png']
                      m.edit(new Discord.MessageEmbed().setAuthor(`Tu cliente acaba de pedirte una pizza. ¿Aceptas el pedido?`, `https://cdn.discordapp.com/attachments/523268901719769088/783672848009920512/giphy_1.gif`).setDescription(`Encargo: **Pizza ${pizzas[respuesta2-1]}**`).setThumbnail(message.author.avatarURL()))
                      await m.react("✅");
                      const respuesta1 = await new Promise((resolve, reject) => {
                        const collector = m.createReactionCollector((reaction, user) => !user.bot && user.id === message.author.id && reaction.message.channel.id === m.channel.id, { time: 60000 });
                        collector.on('collect', r => {
                          resolve(r.emoji.name);
                          r.users.remove(message.author);
                          collector.stop();
                        });
                        collector.on('end', () => resolve(null));
                      });
                      if(!respuesta1){
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #25 siendo pizzero`)
                          m.edit(new Discord.MessageEmbed().setAuthor("¿Acabas de dejar escapar un pedido? Vaya tela...", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`).setThumbnail(message.author.avatarURL()))
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas5.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #26 siendo pizzero`)
                          try{client.channels.resolve(filas5.canal).messages.fetch(filas5.mensaje, true).edit(new Discord.MessageEmbed().setAuthor("Creo que al pizzero se le olvidó tu pizza. Perdon por las molestias", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`))}catch(err){}
                        });
                        return clearInterval(intervalo)
                      }
                      else{
                        let parejita = filas5.id;
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, entrega = 1, dinero = ${filas3.dinero+50}, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #13 siendo pizzero`)
                          m.edit(new Discord.MessageEmbed().setAuthor("Horneando, espera un momentín...", `https://media2.giphy.com/media/33HqleoNUwfV1CvIz4/source.gif`).setThumbnail(message.author.avatarURL()))
                          m.reactions.removeAll()
                          setTimeout(async function(){
                            m.edit(new Discord.MessageEmbed().setAuthor("Pedido completado, siéntete orgulloso", `https://tetranoodle.com/wp-content/uploads/2018/07/tick-gif.gif`).setImage(fotos_pizzas[respuesta2-1]).setThumbnail(message.author.avatarURL()))
                          }, 5000);
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, dinero = ${filas5.dinero-50}, pareja = NULL WHERE id = '${parejita}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #14 siendo pizzero`)
                          try{
                            let envio = await client.channels.resolve(filas5.canal).messages.fetch(filas5.mensaje, true)
                            await envio.edit(new Discord.MessageEmbed().setAuthor(`Aqui tienes tu Pizza ${pizzas[respuesta2-1]}, lista y calentita`, `https://tetranoodle.com/wp-content/uploads/2018/07/tick-gif.gif`).setImage(fotos_pizzas[respuesta2-1]).setThumbnail(client.users.resolve(filas5.id).avatarURL()))
                              let numero_suerte = Math.round(Math.random()*100)
                              if(numero_suerte<6){
                                db_gourmet.get(`SELECT * FROM usuarios WHERE id = '${parejita}'`, async (err, filas9) => {
                                  if(err) return console.log(err.message + ` ${message.content} ERROR #1 dando pizza de lujo`)
                                  if(!filas9){
                                    db_gourmet.run(`INSERT INTO usuarios(id, pizza_${numero_suerte+1}) VALUES('${parejita}', '${pizzas_lujo[numero_suerte]}')`, async function(err) {
                                      if(err) return console.log(err.message + ` ${message.content} ERROR #2 dando pizza de lujo`)
                                      client.channels.resolve(filas5.canal).send(new Discord.MessageEmbed().setAuthor(`¡GUAU! Parece que le has caido bien al pizzero, porque te acaba de regalar una ${pizzas_lujo[numero_suerte]}`, `https://i.giphy.com/l4FGGzDc4iDfgog2A.gif`).setImage(imagenes_lujo[numero_suerte]))
                                    })
                                  }
                                  else{
                                    db_gourmet.run(`UPDATE usuarios SET pizza_${numero_suerte+1} = '${pizzas_lujo[numero_suerte]}' WHERE id = '${parejita}'`, async function(err) {
                                      if(err) return console.log(err.message + ` ${message.content} ERROR #3 dando pizza de lujo`)
                                      client.channels.resolve(filas5.canal).send(new Discord.MessageEmbed().setAuthor(`¡GUAU! Parece que le has caido bien al pizzero, porque te acaba de regalar una ${pizzas_lujo[numero_suerte]}`, `https://i.giphy.com/l4FGGzDc4iDfgog2A.gif`).setImage(imagenes_lujo[numero_suerte]))
                                    })
                                  }
                                })
                              }
                          }catch(err){}
                        });
                        return clearInterval(intervalo)
                      }
                    });
                  })
                }
                if(contador>=24){
                  db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #29 siendo pizzero`)
                    m.edit(new Discord.MessageEmbed().setAuthor("Nadie quiere pizza hoy...", `https://cdn.discordapp.com/attachments/523268901719769088/783655152929603584/TorielHomescreem.gif`).setThumbnail(message.author.avatarURL()))
                    return clearInterval(intervalo)
                  });
                }
              })
              contador++;
            }, 5000)
          })
        })
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
