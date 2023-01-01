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
  "EMBED_LINKS": "✅",
  "ADD_REACTIONS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.mezclar`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    if(filas.prestigio<3) return message.channel.send(new Discord.MessageEmbed().setDescription(`:dvd: **Necesitas ascender a Prestigio 3 para realizar esta actividad**`).setColor(`#9262FF`))
    let embed = new Discord.MessageEmbed()
      .setTitle(`:magic_wand: LA MESA DE MEZCLAS :book:`)
      .setDescription(`Al parecer, la esencia mística de estas armas pueden enlazarse en poderosos objetos divinos. Elige 2 de tu posesión para crear un arma divina:\n\n:one: ${filas.baculo} Báculo\n:two: ${filas.misticos} Poderes Místicos\n:three: ${filas.oscuros} Poderes Oscuros\n:four: ${filas.excalibur} Espada de Excalibur\n:five: ${filas.lanza} Lanza de Ares\n:six: ${filas.tridente} Tridente de Poseidón\n:seven: ${filas.casco} Casco de Hades\n:eight: ${filas.rayos} Rayos de Zeus\n:nine: ${filas.guadaña} Guadaña de Cronos\n\n**Armas elegidas:** ...`)
      .setColor(`#9262FF`)
      .setFooter(`Tanto si consigues obtener un arma divina como si no, el coste de realizar un ensayo es de 1.000.000.000 coins`)
    let mensaje = await message.channel.send(embed).then(async m => {
      var respuestas = new Map([
        ["1️⃣", 1],
        ["2️⃣", 2],
        ["3️⃣", 3],
        ["4️⃣", 4],
        ["5️⃣", 5],
        ["6️⃣", 6],
        ["7️⃣", 7],
        ["8️⃣", 8],
        ["9️⃣", 9],
      ]);
      var numeros = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
      let indik;
      let arma_1;
      let arma_2;
      let posesion_1;
      let posesion_2;
      if(filas.coins<1000000000) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **No tienes suficiente dinero PARA HACER MEZCLAS**`)).then(k => k.delete({ timeout: 8000}))
      for(var j = 0; j<numeros.length; j++) await m.react(numeros[j]);
      const respuesta1 = await new Promise((resolve, reject) => {
        const collector = m.createReactionCollector((reaction, user) => !user.bot && message.author.id === message.author.id && reaction.message.channel.id === m.channel.id, { time: 30000 });
        collector.on('collect', r => {
          indik = r.emoji.name;
          resolve(r.emoji.name);
          r.users.remove(message.author);
          collector.stop();
        });
        collector.on('end', () => resolve(null));
      });
      if(!respuesta1) return m.edit(new Discord.MessageEmbed().setDescription(`:x: **Tardas demasiado. Vuelve cuando estés preparado**`).setColor(`#9262FF`))
      else if(respuesta1==="1️⃣") arma_1 = "Báculo", posesion_1 = filas.baculo;
      else if(respuesta1==="2️⃣") arma_1 = "Poderes Místicos", posesion_1 = filas.misticos;
      else if(respuesta1==="3️⃣") arma_1 = "Poderes Oscuros", posesion_1 = filas.oscuros;
      else if(respuesta1==="4️⃣") arma_1 = "Espada de Excalibur", posesion_1 = filas.excalibur;
      else if(respuesta1==="5️⃣") arma_1 = "Lanza de Ares", posesion_1 = filas.lanza;
      else if(respuesta1==="6️⃣") arma_1 = "Tridente de Poseidon", posesion_1 = filas.tridente;
      else if(respuesta1==="7️⃣") arma_1 = "Casco de Hades", posesion_1 = filas.casco;
      else if(respuesta1==="8️⃣") arma_1 = "Rayos de Zeus", posesion_1 = filas.rayos;
      else if(respuesta1==="9️⃣") arma_1 = "Guadaña de Cronos", posesion_1 = filas.guadaña;
      embed = new Discord.MessageEmbed()
        .setTitle(`:magic_wand: LA MESA DE MEZCLAS :book:`)
        .setDescription(`Al parecer, la esencia mística de estas armas pueden enlazarse en poderosos objetos divinos. Elige 2 de tu posesión para crear un arma divina:\n\n:one: ${filas.baculo} Báculo\n:two: ${filas.misticos} Poderes Místicos\n:three: ${filas.oscuros} Poderes Oscuros\n:four: ${filas.excalibur} Espada de Excalibur\n:five: ${filas.lanza} Lanza de Ares\n:six: ${filas.tridente} Tridente de Poseidón\n:seven: ${filas.casco} Casco de Hades\n:eight: ${filas.rayos} Rayos de Zeus\n:nine: ${filas.guadaña} Guadaña de Cronos\n\n**Armas elegidas:** __${arma_1}__ y ...`)
        .setFooter(`Tanto si consigues obtener un arma divina como si no, el coste de realizar un ensayo es de 1.000.000.000 coins`)
      await m.edit(embed)
      const respuesta2 = await new Promise((resolve, reject) => {
        const collector = m.createReactionCollector((reaction, user) => !user.bot && message.author.id === message.author.id && reaction.message.channel.id === m.channel.id, { time: 30000 });
        collector.on('collect', r => {
          if(indik === r.emoji.name) m.channel.send(new Discord.MessageEmbed().setDescription(`**Las dos armas no pueden ser la misma**`).setColor(`#9262FF`))
          else{
            resolve(r.emoji.name);
            r.users.remove(message.author);
            collector.stop();
          }
        });
        collector.on('end', () => resolve(null));
      });
      if(!respuesta2) return m.edit(new Discord.MessageEmbed().setDescription(`:x: **Tardas demasiado. Vuelve cuando estés preparado**`).setColor(`#9262FF`))
      else if(respuesta2==="1️⃣") arma_2 = "Báculo", posesion_2 = filas.baculo;
      else if(respuesta2==="2️⃣") arma_2 = "Poderes Místicos", posesion_2 = filas.misticos;
      else if(respuesta2==="3️⃣") arma_2 = "Poderes Oscuros", posesion_2 = filas.oscuros;
      else if(respuesta2==="4️⃣") arma_2 = "Espada de Excalibur", posesion_2 = filas.excalibur;
      else if(respuesta2==="5️⃣") arma_2 = "Lanza de Ares", posesion_2 = filas.lanza;
      else if(respuesta2==="6️⃣") arma_2 = "Tridente de Poseidon", posesion_2 = filas.tridente;
      else if(respuesta2==="7️⃣") arma_2 = "Casco de Hades", posesion_2 = filas.casco;
      else if(respuesta2==="8️⃣") arma_2 = "Rayos de Zeus", posesion_2 = filas.rayos;
      else if(respuesta2==="9️⃣") arma_2 = "Guadaña de Cronos", posesion_2 = filas.guadaña;

      if(posesion_1===":x:" && posesion_2===":x:") return m.edit(new Discord.MessageEmbed().setDescription(`**No tenías ningún arma de las que has elegido. Debes poseer ambas armas**`).setColor(`#9262FF`))
      else if(posesion_1===":x:") return m.edit(new Discord.MessageEmbed().setDescription(`**No tenías el primer arma de las que has elegido. Debes poseer ambas armas**`).setColor(`#9262FF`))
      else if(posesion_2===":x:") return m.edit(new Discord.MessageEmbed().setDescription(`**No tenías el segundo arma de las que has elegido. Debes poseer ambas armas**`).setColor(`#9262FF`))
      else{
        embed = new Discord.MessageEmbed()
          .setAuthor(`Fusionando ${arma_1} y ${arma_2}...`, 'https://1.bp.blogspot.com/-xAmn6piscdU/XbNd4pEC12I/AAAAAAAAUwY/Q9q5WrB2htQ6wD-hDT5MDAKBfMjWOmj8wCLcBGAsYHQ/s1600/magic%2Bwand.gif')
        await m.edit(embed)
        setTimeout(async function() {
          if((arma_1==="Espada de Excalibur" && arma_2==="Casco de Hades") || (arma_1==="Casco de Hades" && arma_2==="Espada de Excalibur")){
            db_discordhunter.run(`UPDATE usuarios SET arma = 21, coins = ${filas.coins-1000000000}, armazon = ':white_check_mark:' WHERE id = '${message.author.id}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 comprando martillo de DH`)
              return message.channel.send(new Discord.MessageEmbed().setAuthor(`¡UN ARMA DIVINA HA SIDO DESCUBIERTA!`, message.author.avatarURL()).setDescription(`**ARMAZÓN LEGENDARIO**`).setImage("https://cdn.discordapp.com/attachments/523268901719769088/793504510064590858/erww.png").setColor(`#FFD75E`))
            })
          }
          else if((arma_1==="Poderes Místicos" && arma_2==="Poderes Oscuros") || (arma_1==="Poderes Oscuros" && arma_2==="Poderes Místicos")){
            db_discordhunter.run(`UPDATE usuarios SET arma = 22, coins = ${filas.coins-1000000000}, prohibidos = ':white_check_mark:' WHERE id = '${message.author.id}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 comprando martillo de DH`)
              return message.channel.send(new Discord.MessageEmbed().setAuthor(`¡UN ARMA DIVINA HA SIDO DESCUBIERTA!`, message.author.avatarURL()).setDescription(`**PODERES PROHIBIDOS**`).setImage("https://cdn.discordapp.com/attachments/523268901719769088/793504510064590858/erww.png").setColor(`#FFD75E`))
            })
          }
          else if((arma_1==="Espada de Excalibur" && arma_2==="Rayos de Zeus") || (arma_1==="Rayos de Zeus" && arma_2==="Espada de Excalibur")){
            db_discordhunter.run(`UPDATE usuarios SET arma = 23, coins = ${filas.coins-1000000000}, hercules = ':white_check_mark:' WHERE id = '${message.author.id}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 comprando martillo de DH`)
              return message.channel.send(new Discord.MessageEmbed().setAuthor(`¡UN ARMA DIVINA HA SIDO DESCUBIERTA!`, message.author.avatarURL()).setDescription(`**ESPADA DE HÉRCULES**`).setImage("https://cdn.discordapp.com/attachments/523268901719769088/793504510064590858/erww.png").setColor(`#FFD75E`))
            })
          }
          else if((arma_1==="Tridente de Poseidon" && arma_2==="Lanza de Ares") || (arma_1==="Lanza de Ares" && arma_2==="Tridente de Poseidon")){
            db_discordhunter.run(`UPDATE usuarios SET arma = 24, coins = ${filas.coins-1000000000}, cuartente = ':white_check_mark:' WHERE id = '${message.author.id}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 comprando martillo de DH`)
              return message.channel.send(new Discord.MessageEmbed().setAuthor(`¡UN ARMA DIVINA HA SIDO DESCUBIERTA!`, message.author.avatarURL()).setDescription(`**CUARTENTE OSCURO**`).setImage("https://cdn.discordapp.com/attachments/523268901719769088/793504510064590858/erww.png").setColor(`#FFD75E`))
            })
          }
          else if((arma_1==="Báculo" && arma_2==="Guadaña de Cronos") || (arma_1==="Guadaña de Cronos" && arma_2==="Báculo")){
            db_discordhunter.run(`UPDATE usuarios SET arma = 25, coins = ${filas.coins-1000000000}, cetro = ':white_check_mark:' WHERE id = '${message.author.id}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 comprando martillo de DH`)
              return message.channel.send(new Discord.MessageEmbed().setAuthor(`¡UN ARMA DIVINA HA SIDO DESCUBIERTA!`, message.author.avatarURL()).setDescription(`**EL CETRO**`).setImage("https://cdn.discordapp.com/attachments/523268901719769088/793504510064590858/erww.png").setColor(`#FFD75E`))
            })
          }
          else{
            db_discordhunter.run(`UPDATE usuarios SET coins = ${filas.coins-1000000000} WHERE id = '${message.author.id}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 comprando martillo de DH`)
              return message.channel.send(new Discord.MessageEmbed().setDescription(`**COMBINACIÓN FALLIDA**\n\nLa propia esencia ha rechazado la fusión.`).setColor(`#9262FF`))
            })
          }
        }, 4000);
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
