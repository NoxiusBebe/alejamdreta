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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "cliente`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    db_pizzeria.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 comprando pizza`)
      let contador = 0;
      message.delete();
      if(filas2){
        if(filas2.dinero<50) return message.channel.send(new Discord.MessageEmbed().setDescription(`:moneybag: **Sin dinero, no hay pizza. ¿Así que cocínalas para ganar más dinero, y poder comprarlas!**`).setColor(`#FBACAC`))
        if(filas2.estado===0 && (filas2.ocupado===0 || filas2.ocupado===1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pizza: **A ver, de una en una, que si no te atragantas. Termina con tu pedido y después si eso, pide otra**`).setColor(`#FBACAC`))
        else if(filas2.estado===1 && (filas2.ocupado===0 || filas2.ocupado===1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pizza: **Por muy buen pizzero que seas, que no se te amontonen los pedidos. Termina el que tienes, y ya después ponte con otro**`).setColor(`#FBACAC`))
        let mensaje = await message.channel.send(new Discord.MessageEmbed().setAuthor("Llamando a la pizzeria...", `https://cdn.discordapp.com/attachments/523268901719769088/783651927333273630/AgreeableSoupyChanticleer-max-1mb.gif`).setThumbnail(message.author.avatarURL())).then(m => {
          db_pizzeria.run(`UPDATE usuarios SET estado = 0, ocupado = 0, entrega = NULL, canal = '${message.channel.id}', mensaje = '${m.id}', pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #2 comprando pizza`)
            let intervalo = setInterval(async function() {
              db_pizzeria.all(`SELECT * FROM usuarios`, async (err, filas3) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 comprando pizza`)
                for(var i=0 ; i<filas3.length ; i++){
                  if(filas3[i].estado===1 && filas3[i].ocupado===0){
                    clearInterval(intervalo)
                    db_pizzeria.run(`UPDATE usuarios SET ocupado = 1 WHERE id = '${filas3[i].id}'`, async function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #4 comprando pizza`)
                    });
                    db_pizzeria.run(`UPDATE usuarios SET ocupado = 1, pareja = ${filas3[i].id} WHERE id = '${message.author.id}'`, async function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #5 comprando pizza`)
                      m.edit(new Discord.MessageEmbed().setAuthor(`¿Pizzeria al habla? ¿Qué pizza desea?`, `https://cdn.discordapp.com/attachments/523268901719769088/783672848009920512/giphy_1.gif`).setDescription(`:one: Margarita\n:two: Cuatro Quesos\n:three: Carbonara\n:four: Barbacoa\n:five: Patanegra\n:six: Cremozza BBQ\n:seven: Pecado Carnal\n:eight: Hawaiana\n:nine: Extravaganzza\n:keycap_ten: Pepperoni`).setThumbnail(message.author.avatarURL()))
                      var respuestas = new Map([
                        ["1️⃣", 1],
                        ["2️⃣", 2],
                        ["3️⃣", 3],
                        ["4️⃣", 4],
                        ["5️⃣", 5],
                        ['6️⃣', 6],
                        ['7️⃣', 7],
                        ['8️⃣', 8],
                        ['9️⃣', 9],
                        ['🔟', 10]
                      ]);
                      var numeros = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
                      for(var j = 0; j<numeros.length; j++) await m.react(numeros[j]);
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
                          if(err) return console.log(err.message + ` ${message.content} ERROR #6 comprando pizza`)
                          m.edit(new Discord.MessageEmbed().setAuthor("Veo que no tienes muchas ganas de pizza. Vuelve a dormir", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`).setThumbnail(message.author.avatarURL()))
                          return clearInterval(intervalo)
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas3[i].id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #7 comprando pizza`)
                          try{client.channels.resolve(filas3[i].canal).messages.fetch(filas3[i].mensaje, true).edit(new Discord.MessageEmbed().setAuthor("Tu cliente se ha dormido al teléfono. Déjalo descansar", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`))}catch(err){}
                          return clearInterval(intervalo)
                        });
                        return;
                      }
                      let respuesta_num_1 = respuestas.get(respuesta1);
                      db_pizzeria.run(`UPDATE usuarios SET entrega = ${respuesta_num_1} WHERE id = '${message.author.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #8 comprando pizza`)
                      });
                      m.edit(new Discord.MessageEmbed().setAuthor("¡El pizzero ha sido informado! Te llegará cuando esté lista.", `https://c.tenor.com/kwkIuLUZLUsAAAAi/cook-meal.gif`).setThumbnail(message.author.avatarURL()))
                      m.reactions.removeAll()
                      let entrega = 0;
                      let contX = 0;
                      const respuesta2 = await new Promise((resolve, reject) => {
                        let intervalo2 = setInterval(async function() {
                          if(contX===30){
                            db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #9 comprando pizza`)
                              m.edit(new Discord.MessageEmbed().setAuthor("Creo que al pizzero se le olvidó tu pizza. Perdon por las molestias", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`).setThumbnail(message.author.avatarURL()))
                              clearInterval(intervalo2)
                            });
                            db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas3[i].id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #10 comprando pizza`)
                              try{client.channels.resolve(filas3[i].canal).messages.fetch(filas3[i].mensaje, true).edit(new Discord.MessageEmbed().setAuthor("¿Acabas de dejar escapar un pedido? Vaya tela...", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`))}catch(err){}
                              clearInterval(intervalo2)
                            });
                            return clearInterval(intervalo)
                          }
                          db_pizzeria.get(`SELECT * FROM usuarios WHERE id = '${filas3[i].id}'`, async (err, filas4) => {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #11 comprando pizza`)
                            entrega = filas4.entrega
                            if(entrega>=1 && entrega<=10){
                              resolve(entrega)
                              clearInterval(intervalo2)
                            }
                          })
                          contX++;
                        }, 2000)
                      })
                      if(!respuesta2){
                        let parejita = filas3[i].id;
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #12 comprando pizza`)
                          m.edit(new Discord.MessageEmbed().setAuthor("Creo que al pizzero se le olvidó tu pizza. Perdon por las molestias", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`).setThumbnail(message.author.avatarURL()))
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${parejita}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #13 comprando pizza`)
                          try{client.channels.resolve(filas3[i].canal).messages.fetch(filas3[i].mensaje, true).edit(new Discord.MessageEmbed().setAuthor("¿Acabas de dejar escapar un pedido? Vaya tela...", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`))}catch(err){}
                        });
                        return clearInterval(intervalo)
                      }
                      else{
                        db_pizzeria.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas35) => {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #4 siendo pizzero`)

                          let envio = await client.channels.resolve(filas35.canal).messages.fetch(filas35.mensaje, true)
                          await envio.edit(new Discord.MessageEmbed().setAuthor(`Aqui tienes tu Pizza ${pizzas[respuesta2-1]}, lista y calentita`, `https://tetranoodle.com/wp-content/uploads/2018/07/tick-gif.gif`).setImage(fotos_pizzas[respuesta2-1]))
                          let numero_suerte = Math.round(Math.random()*100)
                          if(numero_suerte<6){
                            db_gourmet.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas9) => {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #1 dando pizza de lujo`)
                              if(!filas9){
                                db_gourmet.run(`INSERT INTO usuarios(id, pizza_${numero_suerte+1}) VALUES('${message.author.id}', '${pizzas_lujo[numero_suerte]}')`, async function(err) {
                                  if(err) return console.log(err.message + ` ${message.content} ERROR #2 dando pizza de lujo`)
                                  client.channels.resolve(filas35.canal).send(new Discord.MessageEmbed().setAuthor(`¡GUAU! Parece que le has caido bien al pizzero, porque te acaba de regalar una ${pizzas_lujo[numero_suerte]}`, `https://i.giphy.com/l4FGGzDc4iDfgog2A.gif`).setImage(imagenes_lujo[numero_suerte]))
                                })
                              }
                              else{
                                db_gourmet.run(`UPDATE usuarios SET pizza_${numero_suerte+1} = '${pizzas_lujo[numero_suerte]}' WHERE id = '${message.author.id}'`, async function(err) {
                                  if(err) return console.log(err.message + ` ${message.content} ERROR #3 dando pizza de lujo`)
                                  client.channels.resolve(filas35.canal).send(new Discord.MessageEmbed().setAuthor(`¡GUAU! Parece que le has caido bien al pizzero, porque te acaba de regalar una ${pizzas_lujo[numero_suerte]}`, `https://i.giphy.com/l4FGGzDc4iDfgog2A.gif`).setImage(imagenes_lujo[numero_suerte]))
                                })
                              }
                            })
                          }

                        })
                        return clearInterval(intervalo)
                      }
                    });
                    break;
                  }
                }
                if(contador>=24){
                  db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #16 comprando pizza`)
                    m.edit(new Discord.MessageEmbed().setAuthor("No hay pizzeros trabajando ahora mismo", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`).setThumbnail(message.author.avatarURL()))
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
        let mensaje = await message.channel.send(new Discord.MessageEmbed().setAuthor("Llamando a la pizzeria...", `https://cdn.discordapp.com/attachments/523268901719769088/783651927333273630/AgreeableSoupyChanticleer-max-1mb.gif`).setThumbnail(message.author.avatarURL())).then(m => {
          db_pizzeria.run(`INSERT INTO usuarios(id, estado, ocupado, canal, mensaje, dinero) VALUES('${message.author.id}', 0, 0, '${message.channel.id}', '${m.id}', 50)`, async function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #17 comprando pizza`)
            let intervalo = setInterval(async function() {
              db_pizzeria.all(`SELECT * FROM usuarios`, async (err, filas3) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #18 comprando pizza`)
                for(var i=0 ; i<filas3.length ; i++){
                  if(filas3[i].estado===1 && filas3[i].ocupado===0){
                    clearInterval(intervalo)
                    db_pizzeria.run(`UPDATE usuarios SET ocupado = 1 WHERE id = '${filas3[i].id}'`, async function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #19 comprando pizza`)
                    });
                    db_pizzeria.run(`UPDATE usuarios SET ocupado = 1, pareja = ${filas3[i].id} WHERE id = '${message.author.id}'`, async function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #20 comprando pizza`)
                      m.edit(new Discord.MessageEmbed().setAuthor(`¿Pizzeria al habla? ¿Qué pizza desea?`, `https://cdn.discordapp.com/attachments/523268901719769088/783672848009920512/giphy_1.gif`).setDescription(`:one: Margarita\n:two: Cuatro Quesos\n:three: Carbonara\n:four: Barbacoa\n:five: Patanegra\n:six: Cremozza BBQ\n:seven: Pecado Carnal\n:eight: Hawaiana\n:nine: Extravaganzza\n:keycap_ten: Pepperoni`).setThumbnail(message.author.avatarURL()))
                      var respuestas = new Map([
                        ["1️⃣", 1],
                        ["2️⃣", 2],
                        ["3️⃣", 3],
                        ["4️⃣", 4],
                        ["5️⃣", 5],
                        ['6️⃣', 6],
                        ['7️⃣', 7],
                        ['8️⃣', 8],
                        ['9️⃣', 9],
                        ['🔟', 10]
                      ]);
                      var numeros = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
                      for(var j = 0; j<numeros.length; j++) await m.react(numeros[j]);
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
                          if(err) return console.log(err.message + ` ${message.content} ERROR #21 comprando pizza`)
                          m.edit(new Discord.MessageEmbed().setAuthor("Veo que no tienes muchas ganas de pizza. Vuelve a dormir", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`).setThumbnail(message.author.avatarURL()))
                          return clearInterval(intervalo)
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas3[i].id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #22 comprando pizza`)
                          try{client.channels.resolve(filas3[i].canal).messages.fetch(filas3[i].mensaje, true).edit(new Discord.MessageEmbed().setAuthor("Tu cliente se ha dormido al teléfono. Déjalo descansar", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`))}catch(err){}
                          return clearInterval(intervalo)
                        });
                        return;
                      }
                      let respuesta_num_1 = respuestas.get(respuesta1);
                      db_pizzeria.run(`UPDATE usuarios SET entrega = ${respuesta_num_1} WHERE id = '${message.author.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #23 comprando pizza`)
                      });
                      m.edit(new Discord.MessageEmbed().setAuthor("¡El pizzero ha sido informado! Te llegará cuando esté lista.", `https://c.tenor.com/kwkIuLUZLUsAAAAi/cook-meal.gif`).setThumbnail(message.author.avatarURL()))
                      m.reactions.removeAll()
                      let entrega = 0;
                      let contX = 0;
                      const respuesta2 = await new Promise((resolve, reject) => {
                        let intervalo2 = setInterval(async function() {
                          if(contX===30){
                            db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #24 comprando pizza`)
                              m.edit(new Discord.MessageEmbed().setAuthor("Creo que al pizzero se le olvidó tu pizza. Perdon por las molestias", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`).setThumbnail(message.author.avatarURL()))
                              clearInterval(intervalo2)
                            });
                            db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${filas3[i].id}'`, async function(err) {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #25 comprando pizza`)
                              try{client.channels.resolve(filas3[i].canal).messages.fetch(filas3[i].mensaje, true).edit(new Discord.MessageEmbed().setAuthor("¿Acabas de dejar escapar un pedido? Vaya tela...", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`))}catch(err){}
                              clearInterval(intervalo2)
                            });
                            return clearInterval(intervalo)
                          }
                          db_pizzeria.get(`SELECT * FROM usuarios WHERE id = '${filas3[i].id}'`, async (err, filas4) => {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #26 comprando pizza`)
                            entrega = filas4.entrega
                            if(entrega>=1 && entrega<=10){
                              resolve(entrega)
                              clearInterval(intervalo2)
                            }
                          })
                          contX++;
                        }, 2000)
                      })
                      if(!respuesta2){
                        let parejita = filas3[i].id;
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #27 comprando pizza`)
                          m.edit(new Discord.MessageEmbed().setAuthor("Creo que al pizzero se le olvidó tu pizza. Perdon por las molestias", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`).setThumbnail(message.author.avatarURL()))
                        });
                        db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${parejita}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #28 comprando pizza`)
                          try{client.channels.resolve(filas3[i].canal).messages.fetch(filas3[i].mensaje, true).edit(new Discord.MessageEmbed().setAuthor("¿Acabas de dejar escapar un pedido? Vaya tela...", `https://cdn.discordapp.com/attachments/523268901719769088/783762085812895794/giphy_2.gif`))}catch(err){}
                        });
                        return clearInterval(intervalo)
                      }
                      else{
                        db_pizzeria.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas35) => {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #4 siendo pizzero`)

                          let envio = await client.channels.resolve(filas35.canal).messages.fetch(filas35.mensaje, true)
                          await envio.edit(new Discord.MessageEmbed().setAuthor(`Aqui tienes tu Pizza ${pizzas[respuesta2-1]}, lista y calentita`, `https://tetranoodle.com/wp-content/uploads/2018/07/tick-gif.gif`).setImage(fotos_pizzas[respuesta2-1]))
                          let numero_suerte = Math.round(Math.random()*100)
                          if(numero_suerte<6){
                            db_gourmet.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas9) => {
                              if(err) return console.log(err.message + ` ${message.content} ERROR #1 dando pizza de lujo`)
                              if(!filas9){
                                db_gourmet.run(`INSERT INTO usuarios(id, pizza_${numero_suerte+1}) VALUES('${message.author.id}', '${pizzas_lujo[numero_suerte]}')`, async function(err) {
                                  if(err) return console.log(err.message + ` ${message.content} ERROR #2 dando pizza de lujo`)
                                  client.channels.resolve(filas35.canal).send(new Discord.MessageEmbed().setAuthor(`¡GUAU! Parece que le has caido bien al pizzero, porque te acaba de regalar una ${pizzas_lujo[numero_suerte]}`, `https://i.giphy.com/l4FGGzDc4iDfgog2A.gif`).setImage(imagenes_lujo[numero_suerte]))
                                })
                              }
                              else{
                                db_gourmet.run(`UPDATE usuarios SET pizza_${numero_suerte+1} = '${pizzas_lujo[numero_suerte]}' WHERE id = '${message.author.id}'`, async function(err) {
                                  if(err) return console.log(err.message + ` ${message.content} ERROR #3 dando pizza de lujo`)
                                  client.channels.resolve(filas35.canal).send(new Discord.MessageEmbed().setAuthor(`¡GUAU! Parece que le has caido bien al pizzero, porque te acaba de regalar una ${pizzas_lujo[numero_suerte]}`, `https://i.giphy.com/l4FGGzDc4iDfgog2A.gif`).setImage(imagenes_lujo[numero_suerte]))
                                })
                              }
                            })
                          }

                        })
                        return clearInterval(intervalo)
                      }
                    });
                    break;
                  }
                }
                if(contador>=24){
                  db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL WHERE id = '${message.author.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #31 comprando pizza`)
                    m.edit(new Discord.MessageEmbed().setAuthor("No hay pizzeros trabajando ahora mismo", `https://cdn.discordapp.com/attachments/523268901719769088/783672322716467240/giphy.gif`).setThumbnail(message.author.avatarURL()))
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
