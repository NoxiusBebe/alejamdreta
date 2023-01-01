/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require("fs");
const {Client, MessageAttachment} = require('discord.js');

client.request = new (require("rss-parser"))();

var parser = require('fast-xml-parser');
var he = require('he');

const getYoutubeChannelId = require('get-youtube-channel-id');
var result_ytID = false;

const cheerio = require('cheerio');
const snekfetch = require('snekfetch');
const querystring = require('querystring');

const YouTube = require('youtube-node');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr",
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata",
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false,
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),
    tagValueProcessor : (val, tagName) => he.decode(val),
    stopNodes: ["parse-me-as-string"]
};

const TwitchApi = require("node-twitch").default;

const path = require('path');
const puppeteer = require('puppeteer');

const TikTokScraper = require('tiktok-scraper');

client.config = require('../config.js');

const twitch = new TwitchApi({
	client_id: client.config.id_twitch,
	client_secret: client.config.id_secreto_twitch
});

const sqlite3 = require('sqlite3').verbose();
const db_prefix = new sqlite3.Database("./memoria/db_prefix.sqlite");
const db_bug = new sqlite3.Database("./memoria/db_bug.sqlite");
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");
const db_eventos = new sqlite3.Database("./memoria/db_eventos.sqlite");
const db_roles_todos = new sqlite3.Database("./memoria/db_roles_todos.sqlite");
const db_roles_mod_todos = new sqlite3.Database("./memoria/db_roles_mod_todos.sqlite");
const db_sorteos = new sqlite3.Database("./memoria/db_sorteos.sqlite");
const db_sorteos_todos = new sqlite3.Database("./memoria/db_sorteos_todos.sqlite");
const db_sugerencias = new sqlite3.Database("./memoria/db_sugerencias.sqlite");
const db_regalos_sv = new sqlite3.Database("./memoria/db_regalos_sv.sqlite");
const db_pizzeria = new sqlite3.Database("./memoria/db_pizzeria.sqlite");
const db_tempban = new sqlite3.Database("./memoria/db_tempban.sqlite");
const db_tempmute = new sqlite3.Database("./memoria/db_tempmute.sqlite");
const db_youtube = new sqlite3.Database("./memoria/db_youtube.sqlite");
const db_twitch = new sqlite3.Database("./memoria/db_twitch.sqlite");
const db_twitter = new sqlite3.Database("./memoria/db_twitter.sqlite");
const db_instagram = new sqlite3.Database("./memoria/db_instagram.sqlite");
const db_tiktok = new sqlite3.Database("./memoria/db_tiktok.sqlite");
const db_amazon = new sqlite3.Database("./memoria/db_amazon.sqlite");
const db_periodico = new sqlite3.Database("./memoria/db_periodico.sqlite");
const db_tickets = new sqlite3.Database("./memoria/db_tickets.sqlite");
const db_tickets_mod = new sqlite3.Database("./memoria/db_tickets_mod.sqlite");
const db_servidores = new sqlite3.Database("./memoria/db_servidores.sqlite");
const db_relojes = new sqlite3.Database("./memoria/db_relojes.sqlite");
const db_estadisticas = new sqlite3.Database("./memoria/db_estadisticas.sqlite");
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_bloqueados = new sqlite3.Database("./memoria/db_bloqueados.sqlite");
const db_scammers = new sqlite3.Database("./memoria/db_scammers.sqlite");

const juegos = require("../archivos/Documentos/Estado/juegos.json")

let decoracion_ar = "══════════════════════════════════════════";
let decoracion_ab = "══════════════════════════════════════════";

var guion = 0;
var contador = 0;

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client) => {

  if((client.shard.ids[contador]%10)===0) guion++;
  for(var i=0 ; i<guion ; i++){
    decoracion_ab=decoracion_ab+"═";
    decoracion_ar=decoracion_ab;
  }

  console.log(`╔`+decoracion_ar+`╗`);
  console.log(`║Alejandreta 3.0 > Conectado en el shard nº${client.shard.ids[contador]}║`);
  console.log(`╚`+decoracion_ab+`╝`);
  contador++;

  let embed_shard_reinicio = new Discord.MessageEmbed()
    .setAuthor(`El Shard nº${client.shard.ids[contador-1]} se ha reiniciado`, `https://emojis.wiki/emoji-pics/facebook/clockwise-vertical-arrows-facebook.png`)
    .setColor(`RANDOM`)
    .setTimestamp()
  try{client.shard.broadcastEval(`this.channels.cache.get('862376703385010227').send({ content: "<@822669515354800148>", embed: ${JSON.stringify(embed_shard_reinicio)} });`);}catch{};

  //------------------------------------------------------------------------------------------------------------------

  client.user.setPresence({ status: "online", activity: { name: `${juegos[Math.floor(Math.random()*(juegos.length-1))]}`, type: "STREAMING" } });
  setInterval(async function() { client.user.setPresence({ status: "online", activity: { name: `${juegos[Math.floor(Math.random()*(juegos.length-1))]}`, type: "STREAMING" } }); }, 1800000)

  //------------------------------------------------------------------------------------------------------------------

  let servidores = await client.guilds.cache.map(g => g.id)
  for(var i=0 ; i<servidores.length ; i++) await asignar_prefix(servidores[i])
  setInterval(async function() { servidores = await client.guilds.cache.map(g => g.id) }, 600000)

  //------------------------------------------------------------------------------------------------------------------

  client.config.royale_participantes = {};
  client.config.ronda_incursion = {};
  client.config.identificador_incursion = {};
  client.config.ronda_duelos = {};
  client.config.identificador_batalla_5 = {};
  client.config.ronda_inc_heroico = {};
  client.config.estado_supervivencia = {};
  client.config.ronda_supervivencia = {};
  client.config.miembro_supervivencia = {};
  client.config.ronda_ascension = {};
  client.config.estado_royale = {};
  client.config.estado_server_royale = {};
  client.config.recarga_desafio = {};

  db_bloqueados.all(`SELECT * FROM usuarios`, async (err, filas) => {
    if(err || !filas) return;
    for(var i=0 ; i<filas.length ; i++) client.config.usuarios_bloqueados[filas[i].id] = filas[i].motivo;
  })
  db_bloqueados.all(`SELECT * FROM servidores`, async (err, filas) => {
    if(err || !filas) return;
    for(var i=0 ; i<filas.length ; i++) client.config.servidores_bloqueados[filas[i].id] = filas[i].motivo;
  })
  db_scammers.all(`SELECT * FROM enlaces`, async (err, filas) => {
    if(err || !filas) return;
    for(var i=0 ; i<filas.length ; i++) client.config.enlaces_scam.push(filas[i].scam)
  })

  setInterval(async function() {
    db_bloqueados.all(`SELECT * FROM usuarios`, async (err, filas) => {
      if(err || !filas) return;
      client.config.usuarios_bloqueados = {};
      for(var i=0 ; i<filas.length ; i++) client.config.usuarios_bloqueados[filas[i].id] = filas[i].motivo;
    })
    db_bloqueados.all(`SELECT * FROM servidores`, async (err, filas) => {
      if(err || !filas) return;
      client.config.servidores_bloqueados = {};
      for(var i=0 ; i<filas.length ; i++) client.config.servidores_bloqueados[filas[i].id] = filas[i].motivo;
    })
    db_scammers.all(`SELECT * FROM enlaces`, async (err, filas) => {
      if(err || !filas) return;
      client.config.enlaces_scam = [];
      for(var i=0 ; i<filas.length ; i++) client.config.enlaces_scam.push(filas[i].scam)
    })
  }, 60000);
//------------------------------------------------------------------------------------------------------------------

  db_discordhunter.run(`UPDATE usuarios SET estado_supervivencia = 0, estado_incursion = 0, estado_incursion_heroica = 0, estado_ascension = 0, estado_royale = 0, estado_batalla_1 = 0, estado_duelos = 0, estado_batalla_5 = 0, estado_desafios = 0, estado_destino = 0, macro = 0, estado_publicidad = 1, auto_farmear = 0`, function(err) {
    if(err) return console.log(err.message + ` ERROR #1 reseteando estados de Discord Hunter`)
  })
  db_discordhunter.run(`DELETE FROM battleroyale`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 actualizando sorteos`)
  })
  db_discordhunter.run(`DELETE FROM incursiones`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 actualizando sorteos`)
  })
  db_discordhunter.run(`DELETE FROM supervivencia`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 actualizando sorteos`)
  })
  db_discordhunter.run(`DELETE FROM batalla_1`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 actualizando sorteos`)
  })

//------------------------------------------------------------------------------------------------------------------

  db_canales.all(`SELECT * FROM servidores`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en check`)
    let canal;
    let mensaje;
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].id)){
        if(filas[i].verificacion && filas[i].verificacion_mensaje){
          canal = await filas[i].verificacion;
          mensaje = await filas[i].verificacion_mensaje;
          try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
        }
      }
    }
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].id)){
        if(filas[i].ticket && filas[i].ticket_mensaje){
          canal = await filas[i].ticket;
          mensaje = await filas[i].ticket_mensaje;
          try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
        }
      }
    }
  })
  db_tickets_mod.all(`SELECT * FROM servidores`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en ticket_mod`)
    let canal;
    let mensaje;
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].servidor)){
        if(filas[i].canal && filas[i].mensaje){
          canal = await filas[i].canal;
          mensaje = await filas[i].mensaje;
          try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
        }
      }
    }
  })
  db_eventos.all(`SELECT * FROM eventos`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en eventos`)
    let canal;
    let mensaje;
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].servidor)){
        if(filas[i].mensaje && filas[i].canal){
          canal = await filas[i].canal;
          mensaje = await filas[i].mensaje;
          try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
        }
      }
    }
  })
  db_roles_todos.all(`SELECT * FROM servidores`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en roles`)
    let canal;
    let mensaje;
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].servidor)){
        if(filas[i].mensaje && filas[i].canal){
          canal = await filas[i].canal;
          mensaje = await filas[i].mensaje;
          try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
        }
      }
    }
  });
  db_roles_mod_todos.all(`SELECT * FROM servidores`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en roles`)
    let canal;
    let mensaje;
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].servidor)){
        if(filas[i].mensaje && filas[i].canal){
          canal = await filas[i].canal;
          mensaje = await filas[i].mensaje;
          try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
        }
      }
    }
  });
  db_sorteos_todos.all(`SELECT * FROM servidores`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en sorteos`)
    let canal;
    let mensaje;
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].servidor)){
        if(filas[i].mensaje && filas[i].canal){
          canal = await filas[i].canal;
          mensaje = await filas[i].mensaje;
          try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
        }
      }
    }
  });
  db_sugerencias.all(`SELECT * FROM sugerencias`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en sugerencias`)
    let canal;
    let mensaje;
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].servidor)){
        if(filas[i].mensaje && filas[i].canal){
          canal = await filas[i].canal;
          mensaje = await filas[i].mensaje;
          try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
        }
      }
    }
  });
  db_tickets.all(`SELECT * FROM tickets`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en tickets`)
    let canal;
    let mensaje;
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].servidor)){
        if(filas[i].mensaje && filas[i].canal){
          canal = await filas[i].canal;
          mensaje = await filas[i].mensaje;
          try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
        }
      }
    }
  });
  db_regalos_sv.all(`SELECT * FROM servidores`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en bombones`)
    let canal;
    let mensaje;
    for(var i=0 ; i<filas.length ; i++){
      if(servidores.some(ff => ff = filas[i].id)){
        canal = await filas[i].canal;
        mensaje = await filas[i].mensaje;
        try{await (client.channels.resolve(canal)).messages.fetch(mensaje)}catch(err){};
      }
    }
  });
  db_pizzeria.run(`UPDATE usuarios SET ocupado = NULL, pareja = NULL, estado = NULL, entrega = NULL`, function(err) {
    if(err) return console.log(err.message + ` ERROR RESETEANDO ESTADO PIZZERIA`)
  });

//------------------------------------------------------------------------------------------------------------------

let tiempo5 = Date.now();
/*db_premium.all(`SELECT * FROM premium`, async (err, filas) => {
  if(!filas) return;
  if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en premium`)
  for(var i=0 ; i<filas.length ; i++){
    if(filas[i].todo!='VIDA' && tiempo5>=filas[i].todo && filas[i].todo!=null && filas[i].todo!=undefined){
      console.log(`Entro en condicion IF del premium para todo con ${filas[i].servidor}`)
      try{
        await eliminar_premium(filas[i].servidor, "todo")
        let nombre_owner = await client.guilds.resolve(`${filas[i].servidor}`).owner;
        console.log(nombre_owner)
        await nombre_owner.send(new Discord.MessageEmbed().setDescription(`:crown: Se le notifica, que su suscripción de **Alejandreta Premium: Completo** ha finalizado`).setFooter(`ID del servidor: ${filas[i].servidor}`))
        console.log(`Mensaje enviado al dueño`)
      }catch(err){}
    }
    else if((filas[i].todo!='VIDA') && ((filas[i].todo-tiempo5)<=432000000) && filas[i].todo!=null && filas[i].todo!=undefined){
      try{
        let tiempo_restante = await T_convertor(filas[i].todo-tiempo5);
        let nombre_owner = await client.guilds.resolve(`${filas[i].servidor}`).owner;
        await nombre_owner.send(new Discord.MessageEmbed().setDescription(`:crown: Se le notifica, que su suscripción de **Alejandreta Premium: Completo** finalizará en el tiempo de **${tiempo_restante}**`).setFooter(`ID del servidor: ${filas[i].servidor}`))
      }catch(err){}
    }
  }
})*/

//------------------------------------------------------------------------------------------------------------------

  setInterval(async function() {
    db_estadisticas.all(`SELECT * FROM estadisticas`, async (err, filas) => {
      if(err || !filas) return;
      for(var i=0 ; i<filas.length ; i++){
        if(servidores.some(ff => ff = filas[i].servidor)){
          let servidor_estadisticas;
          try{servidor_estadisticas = await client.guilds.resolve(filas[i].servidor)}catch(err){};
          try{await servidor_estadisticas.members.fetch()}catch(err){};

          if(filas[i].miembros) try{await servidor_estadisticas.channels.resolve(filas[i].miembros).setName(`👥 Miembros: ${servidor_estadisticas.memberCount}`)}catch(err){};
          if(filas[i].usuarios) try{await servidor_estadisticas.channels.resolve(filas[i].usuarios).setName(`👤 Usuarios: ${servidor_estadisticas.memberCount - servidor_estadisticas.members.cache.filter(m => m.user.bot).size}`)}catch(err){};
          if(filas[i].bots) try{await servidor_estadisticas.channels.resolve(filas[i].bots).setName(`🤖 Bots: ${servidor_estadisticas.members.cache.filter(m => m.user.bot).size}`)}catch(err){};
          if(filas[i].roles) try{await servidor_estadisticas.channels.resolve(filas[i].roles).setName(`🔱 Roles: ${servidor_estadisticas.roles.cache.size}`)}catch(err){};
          if(filas[i].canales) try{await servidor_estadisticas.channels.resolve(filas[i].canales).setName(`📓 Canales: ${servidor_estadisticas.channels.cache.size}`)}catch(err){};
        }
      }
    })
  }, 1200000)
  setInterval(async function() {
    db_relojes.all(`SELECT * FROM relojes`, async (err, filas) => {
      if(err || !filas) return;
      for(var i=0 ; i<filas.length ; i++){
        if(servidores.some(ff => ff = filas[i].servidor)){
          var tiempo_relojes = new Date();
          var horas_relojes = parseInt(tiempo_relojes.getUTCHours());
          var minutos_relojes = parseInt(tiempo_relojes.getUTCMinutes());
          var segundos_relojes = parseInt(tiempo_relojes.getUTCSeconds());

          var diferencia_relojes = parseInt(filas[i].franja);
          horas_relojes = horas_relojes+diferencia_relojes;
          if(horas_relojes<0) horas_relojes = horas_relojes+24;
          else if(horas_relojes>=24) horas_relojes = horas_relojes-24;

          horas_relojes = horas_relojes.toString();
          minutos_relojes = minutos_relojes.toString();
          segundos_relojes = segundos_relojes.toString();

          horas_relojes = horas_relojes.length < 2 ? "0" + horas_relojes : horas_relojes;
          minutos_relojes = minutos_relojes.length < 2 ? "0" + minutos_relojes : minutos_relojes;
          segundos_relojes = segundos_relojes.length < 2 ? "0" + segundos_relojes : segundos_relojes;

          try{let servidor_relojes = await client.guilds.resolve(filas[i].servidor)
          await servidor_relojes.channels.resolve(filas[i].canal).setName(`⏰ ${filas[i].pais}: ${horas_relojes}:${minutos_relojes}:${segundos_relojes}`)}catch(err){};
        }
      }
    })
  }, 663243)

  setInterval(async function() {
    db_sorteos_todos.all(`SELECT * FROM servidores`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 actualizando sorteos`)
      for(var i=0 ; i<filas.length ; i++){
        if(servidores.some(ff => ff = filas[i].servidor)){
          let winner = [];
          try{
            let msg = await client.channels.resolve(filas[i].canal).messages.fetch(filas[i].mensaje)
            let fecha_actual = Date.now();
            if(!msg) return;
            if(filas[i].fecha>fecha_actual){
              msg.edit(new Discord.MessageEmbed()
                .setDescription(`:tada: __**SORTEO:**__ (Participantes ⥤ **${filas[i].participantes}** : **${filas[i].ganadores}** ⥢ Ganadores)\n\n**${filas[i].descripcion}**\n\n⏳ Finaliza en: ${T_convertor(parseInt(filas[i].fecha)-fecha_actual)}`)
                .addField(`Apúntate: `, `🎉`, true)
                .addField(`Bórrate: `, `❌`, true)
                .addField(`Participantes: `, `📃`, true)
                .setColor(`#E77BDF`)
                .setFooter(`Este mensaje se actualiza cada minuto`))
            }
            else{
              if(filas[i].participantes<=0) winner.push('nadie, porque nadie se apuntó :cry:');
              else{
                for(var j=0 ; j<1950 ; j++) if(filas[i][`user_${j}`]) winner.push(`<@${filas[i][`user_${j}`]}>`)
                if(filas[i].participantes<filas[i].ganadores) winner.push(' y quedan puestos libres, pero no habían más participantes');
                else if(filas[i].participantes>filas[i].ganadores) for(var j=0 ; j<(filas[i].participantes-filas[i].ganadores) ; j++) winner.splice(Math.round(Math.random()*((winner.length-1))), 1)
              }
              await msg.edit(new Discord.MessageEmbed().setDescription(`:tada: __**SORTEO:**__ (Participantes ⥤ **${filas[i].participantes}** : **${filas[i].ganadores}** ⥢ Ganadores)\n\n**${filas[i].descripcion}**\n\n**Ganador/es:** ${winner.join(", ")}`).setColor(`#E77BDF`))
              await eliminar_sorteo(filas[i].servidor, filas[i].mensaje)
            }
          }catch(err){}
        }
      }
    })
  }, 60000)

  setInterval(async function() {
    let tiempo2 = Date.now();
    db_tempmute.all(`SELECT * FROM servidores`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en tempmute`)
      for(var i=0 ; i<filas.length ; i++){
        if(servidores.some(ff => ff = filas[i].servidor)){
          if(filas[i].fecha<=tiempo2){
            let id_user = await filas[i].usuario;
            let id_server = await filas[i].servidor;
            let usuario = await client.users.resolve(`${filas[i].usuario}`)
            let servidor = await client.guilds.resolve(`${filas[i].servidor}`)
            if(servidor!=null){
              try{await servidor.members.fetch(id_user)}catch{};
              let role_mute = await servidor.roles.cache.find(r => r.name === "Muteado por Alejandreta")
              if(role_mute){
                try{await servidor.member(usuario).roles.remove(role_mute).catch();
                await eliminar_tempmute(id_user, id_server)
                await usuario.send(new Discord.MessageEmbed().setDescription(`**ACABAS DE SER DESMUTEADO EN __${client.guilds.resolve(filas[i].servidor).name}__**\n\nNo vuelvas a cometer ninguna infracción, es una sugerencia que te ofrezco para evitarte males mayores.`).setColor(`#FF3D5E`))}catch{};
              }
            }
          }
        }
      }
    })
  }, 300000);
  setInterval(async function() {
    let tiempo2 = Date.now();
    db_tempban.all(`SELECT * FROM servidores`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en tempban`)
      for(var i=0 ; i<filas.length ; i++){
        if(servidores.some(ff => ff = filas[i].servidor)){
          if(filas[i].fecha<=tiempo2){
            let id_user = await filas[i].usuario
            let id_server = await filas[i].servidor
            let usuario = await client.users.resolve(`${filas[i].usuario}`)
            let servidor = await client.guilds.resolve(`${filas[i].servidor}`)
            if(servidor!=null){
              try{await servidor.members.fetch(id_user)}catch{};
              try{await servidor.members.unban(usuario)
              await eliminar_tempban(id_user, id_server)
              await usuario.send(new Discord.MessageEmbed().setDescription(`**ACABAS DE SER DESBANEADO EN __${client.guilds.resolve(filas[i].servidor).name}__**\n\nNo vuelvas a cometer ninguna infracción, es una sugerencia que te ofrezco para evitarte males mayores.`).setColor(`#FF3D5E`))}catch{};
            }
          }
        }
      }
    })
  }, 300000);

  /*setInterval(async function() {
    let tiempo2 = Date.now();
    db_premium.all(`SELECT * FROM premium`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 haciendo fetch en premium`)
      for(var i=0 ; i<filas.length ; i++){
        if(servidores.some(ff => ff = filas[i].servidor)){
          if(filas[i].todo!='VIDA' && tiempo2>=filas[i].todo && filas[i].todo!=null && filas[i].todo!=undefined){
            try{
              await eliminar_premium(filas[i].servidor, "todo")
              let nombre_owner = await client.guilds.resolve(`${filas[i].servidor}`).owner;
              await nombre_owner.send(new Discord.MessageEmbed().setDescription(`:crown: Se le notifica, que su suscripción de **Alejandreta Premium: Completo** ha finalizado`).setFooter(`ID del servidor: ${filas[i].servidor}`))
            }catch(err){}
          }
          else if((filas[i].todo!='VIDA') && ((filas[i].todo-tiempo2)<=432000000) && filas[i].todo!=null && filas[i].todo!=undefined){
            try{
              let tiempo_restante = await T_convertor(filas[i].todo-tiempo2);
              let nombre_owner = await client.guilds.resolve(`${filas[i].servidor}`).owner;
              await nombre_owner.send(new Discord.MessageEmbed().setDescription(`:crown: Se le notifica, que su suscripción de **Alejandreta Premium: Completo** finalizará en el tiempo de **${tiempo_restante}**`).setFooter(`ID del servidor: ${filas[i].servidor}`))
            }catch(err){}
          }
        }
      }
    })
  }, 86400000);*/

  setInterval(async function() {
    db_youtube.all(`SELECT * FROM sqlite_master`, (err, filas2) => {
      if(!filas2) return;
      for(var i=0 ; i<filas2.length ; i++) yt_check(client, filas2[i].name)
    })
  }, 600000);
  setInterval(async function() {
    db_twitch.all(`SELECT * FROM sqlite_master`, (err, filas2) => {
      if(!filas2) return;
      for(var i=0 ; i<filas2.length ; i++) tw_check(client, filas2[i].name)
    })
  }, 600000);
/*
  setInterval(async function() {
    console.log("Vamos con TIKTOK")
    db_tiktok.all(`SELECT * FROM sqlite_master`, (err, filas2) => {
      if(!filas2) return;
      for(var i=0 ; i<filas2.length ; i++) tk_check(client, filas2[i].name)
    })
  }, 720000);
*/
  setInterval(async function() {
    db_bug.all(`SELECT * FROM bugs`, async (err, filas) => {
      if(err || !filas) return;
      try{await client.guilds.fetch('822948583875674164');}catch(err){return;};
      for(var i=0 ; i<filas.length ; i++){
        try{
          client.channels.resolve('861953685890007061').send
            (new Discord.MessageEmbed()
                .setAuthor(`📫 Bug reportado por ${filas[i].nombre}`)
                .setThumbnail(`https://cdn.discordapp.com/attachments/823263020246761523/861970033718198322/R.png`)
                .setDescription(`${filas[i].mensaje}`)
                .addField(`Acceso:`, filas[i].invite)
                .setFooter(`Servidor: ${filas[i].idserver} || Usuario: ${filas[i].id}`)
                .setColor(`#F7F9F7`)
            )
          await eliminar_bug(filas[i].mensaje)
        }catch(err){};
      }
    })
  }, 300000)

  setInterval(async function() {
    db_canales.all(`SELECT ofertas FROM servidores WHERE ofertas NOT NULL`, async (err, filas) => {
      if(err || !filas) return;
      if(servidores.some(ff => ff = filas[i].id)){
        db_amazon.all(`SELECT * FROM productos`, async (err, filas2) => {
          if(err || !filas2) return;
          for(var i=0 ; i<filas2.length ; i++){

            let nombre_amz = filas2[i].mensaje_con_titulo;
            let precio_anterior_amz = filas2[i].precio_anterior;
            let precio_final_amz = filas2[i].precio_amazon;
            let imagen_amz = filas2[i].url_imagen_alejandreta;
            let link_amz = filas2[i].link_alejandreta;

            let embed_amazon = new Discord.MessageEmbed()
              .setAuthor(`${nombre_amz.slice(0, 90)}...`, `https://cdn.discordapp.com/attachments/523268901719769088/754735059214532789/dwdwdw.png`)
              .addField(`:red_circle: **Antes:**`, `${precio_anterior_amz}`, true)
              .addField(`:green_circle: **Ahora:**`, `${precio_final_amz}`, true)
              .addField(`:link: **Enlace:**`, `${link_amz}`, true)
              .setColor(`#ffb900`)
              .setImage(`${imagen_amz}`)
              .setTimestamp();

            for(var j=0 ; j<filas.length ; j++) try{client.shard.broadcastEval(`this.channels.cache.get(${JSON.stringify(filas[j].ofertas)}).send({ embed: ${JSON.stringify(embed_amazon)} });`);}catch{};
          }
          db_amazon.run(`DELETE FROM productos`, function(err) {
            if(err) return console.log(err.message + ` ERROR #1 borrando productos de amazon`)
          })
        })
      }
    })
  }, 300000)
  setInterval(async function() {
    db_canales.all(`SELECT periodico FROM servidores WHERE periodico NOT NULL`, async (err, filas) => {
      if(err || !filas) return;
      noticias_periodico(client, filas)
    })
  }, 600000)

}
/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
function asignar_prefix(id){
  db_prefix.get(`SELECT * FROM servidores WHERE id = '${id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ERROR #1 asignando prefijos`)
    if(!filas) client.config.prefijos[id] = client.config.prefijo;
    else client.config.prefijos[id] = filas.prefijo;
  })
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
function eliminar_premium(id, suscripcion){
  /*db_premium.delete(`UPDATE FROM premium WHERE servidor = '${id}'`, async function(err) {
    if(err) return console.log(err.message + ` ERROR #2 haciendo fetch en premium`)
    await eliminar_prefix(id);
    await eliminar_periodico(id);
    await eliminar_listado(id);
  })*/
}
function eliminar_prefix(id){
  db_prefix.run(`DELETE FROM servidores WHERE id = '${id}'`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 haciendo fetch en premium`)
    client.config.prefijos[id] = '!';
  })
}
function eliminar_periodico(id){
  db_canales.run(`UPDATE servidores SET periodico = NULL WHERE id = '${id}'`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 haciendo fetch en premium`)
  })
}
function eliminar_listado(id){
  db_canales.run(`DELETE FROM servidores WHERE id = '${id}'`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 haciendo fetch en premium`)
  })
}
function eliminar_tempban(usuario, servidor){
  db_tempban.run(`DELETE FROM servidores WHERE usuario = '${usuario}' AND servidor = '${servidor}'`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 haciendo fetch en tempban`)
  })
}
function eliminar_tempmute(usuario, servidor){
  db_tempmute.run(`DELETE FROM servidores WHERE usuario = '${usuario}' AND servidor = '${servidor}'`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 haciendo fetch en tempmute`)
  })
}
function eliminar_sorteo(servidor, mensaje){
  db_sorteos.run(`DELETE FROM '${servidor}' WHERE mensaje = '${mensaje}'`, function(err) {
    if(err) return console.log(err.message + ` ERROR #2 actualizando sorteos`)
    db_sorteos_todos.run(`DELETE FROM servidores WHERE mensaje = '${mensaje}'`, function(err) {
      if(err) return console.log(err.message + ` ERROR #3 actualizando sorteos`)
    })
  })
}
function eliminar_bug(mensaje){
  db_bug.run(`DELETE FROM bugs WHERE mensaje = '${mensaje}'`, function(err) {
    if(err) return console.log(err.message + ` ERROR #1 borrando bug`)
  })
}
function comprobar_periodico(client, filasX, enlace, fecha){
  db_periodico.get(`SELECT * FROM periodico WHERE enlace = '${enlace}'`, (err, filas) => {
    if(err || filas) return;
    else{
      db_periodico.run(`INSERT INTO periodico(enlace, fecha) VALUES('${enlace}', '${fecha}')`, function(err) { if(err) return; })
      for(var i=0 ; i<filasX.length ; i++) try{client.shard.broadcastEval(`this.channels.cache.get(${JSON.stringify(filasX[i].periodico)}).send(${JSON.stringify(enlace)});`);}catch{};
    }
  })
}

async function yt_check(cliente, input){
  db_premium.get(`SELECT * FROM premium WHERE servidor = '${input}'`, async (err, filas2) => {
    /*if(!filas2 || (filas2.todo===null && filas2.social===null)) return;*/
    if(err) return console.log(err.message + ` ERROR #0 en funcion yt_check`)
    db_youtube.all(`SELECT * FROM '${input}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 en funcion yt_check`)
      for(var i=0 ; i<filas.length ; i++){
        let servidor = await filas[i].servidor;
        let canal = await filas[i].canal;
        let youtuber = await filas[i].youtuber;
        try{await cliente.guilds.fetch(servidor);}catch(err){};
        if(filas[i].video===null || filas[i].video==='NULL' || !filas[i].video){
          await client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtuber}`).then(async data => {
            if(!filas[i].rol || filas[i].rol==="---"){
              try{
                await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:loudspeaker: **${data.items[0].author}** ha subido el video **${Discord.Util.escapeMarkdown(data.items[0].title)}**.\n:person_running: Corre a verlo y no te lo pierdas: ${data.items[0].link}`)
                db_youtube.run(`UPDATE '${input}' SET video = '${data.items[0].link}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND youtuber = '${youtuber}'`, async function(err) {
                  if(err) return console.log(err.message + ` ERROR #3 en funcion yt_check`)
                })
              }catch(err){};
            }
            else{
              let rol_ping = await filas[i].rol;
              try{
                await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:loudspeaker: **${data.items[0].author}** ha subido el video **${Discord.Util.escapeMarkdown(data.items[0].title)}**.\n:person_running: Corre a verlo y no te lo pierdas: ${data.items[0].link}\n:pushpin: <@&${rol_ping}>`)
                db_youtube.run(`UPDATE '${input}' SET video = '${data.items[0].link}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND youtuber = '${youtuber}'`, async function(err) {
                  if(err) return console.log(err.message + ` ERROR #3 en funcion yt_check`)
                })
              }catch(err){};
            }
          })
        }
        else{
          let video = await filas[i].video;
          await client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtuber}`).then(async data => {
            if(data.items[0].link!=video){
              if(!filas[i].rol || filas[i].rol==="---"){
                try{
                  await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:loudspeaker: **${data.items[0].author}** ha subido el video **${Discord.Util.escapeMarkdown(data.items[0].title)}**.\n:person_running: Corre a verlo y no te lo pierdas: ${data.items[0].link}`)
                  db_youtube.run(`UPDATE '${input}' SET video = '${data.items[0].link}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND youtuber = '${youtuber}'`, async function(err) {
                    if(err) return console.log(err.message + ` ERROR #3 en funcion yt_check`)
                  })
                }catch(err){};
              }
              else{
                let rol_ping = await filas[i].rol;
                try{
                  await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:loudspeaker: **${data.items[0].author}** ha subido el video **${Discord.Util.escapeMarkdown(data.items[0].title)}**.\n:person_running: Corre a verlo y no te lo pierdas: ${data.items[0].link}\n:pushpin: <@&${rol_ping}>`)
                  db_youtube.run(`UPDATE '${input}' SET video = '${data.items[0].link}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND youtuber = '${youtuber}'`, async function(err) {
                    if(err) return console.log(err.message + ` ERROR #3 en funcion yt_check`)
                  })
                }catch(err){};
              }
            }
          })
        }
      }
    })
  })
}
async function tw_check(cliente, input){
  db_premium.get(`SELECT * FROM premium WHERE servidor = '${input}'`, async (err, filas2) => {
    /*if(!filas2 || (filas2.todo===null && filas2.social===null)) return;*/
    if(err) return console.log(err.message + ` ERROR #0 en funcion tw_check`)
    db_twitch.all(`SELECT * FROM '${input}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 en funcion tw_check`)
      let status;
      for(var i=0 ; i<filas.length ; i++){
        let servidor = await filas[i].servidor;
        let canal = await filas[i].canal;
        let streamer = await filas[i].streamer;
        try{await cliente.guilds.fetch(servidor);}catch(err){};
        let enlace_youtube = await twitch.getStreams({ channel: streamer });
        if(!filas[i].directo || filas[i].directo===null || filas[i].directo==='NULL'){

          if(enlace_youtube.data[0] && enlace_youtube.data[0].type==="live"){
            let nameT = await enlace_youtube.data[0].user_name;
            let titulo = await enlace_youtube.data[0].title;
            let link = `https://www.twitch.tv/`+`${streamer}`;
            let directo = await enlace_youtube.data[0].started_at;
            if(!filas[i].rol || filas[i].rol==="---"){
              try{await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:mega: **${nameT}** está ahora mismo en directo: **${titulo}**\n:link: ¿Vas a perdértelo?: ${link}`)
              db_twitch.run(`UPDATE '${input}' SET directo = '${directo}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND streamer = '${streamer}'`, async function(err) {
                if(err) return console.log(err.message + ` ERROR #2 en funcion tw_check`)
              })}catch(err){};
            }
            else{
              let rol_ping = await filas[i].rol;
              try{await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:mega: **${nameT}** está ahora mismo en directo: **${titulo}**\n:link: ¿Vas a perdértelo?: ${link}\n:pushpin: <@&${rol_ping}>`)
              db_twitch.run(`UPDATE '${input}' SET directo = '${directo}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND streamer = '${streamer}'`, async function(err) {
                if(err) return console.log(err.message + ` ERROR #2 en funcion tw_check`)
              })}catch(err){};
            }
          }

        }
        else{

          if(enlace_youtube.data[0] && enlace_youtube.data[0].type==="live" && enlace_youtube.data[0].started_at!=filas[i].directo){
            let nameT = await enlace_youtube.data[0].user_name;
            let titulo = await enlace_youtube.data[0].title;
            let link = `https://www.twitch.tv/`+`${streamer}`;
            let directo = await enlace_youtube.data[0].started_at;
            if(!filas[i].rol || filas[i].rol==="---"){
              try{await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:mega: **${nameT}** está ahora mismo en directo: **${titulo}**\n:link: ¿Vas a perdértelo?: ${link}`)
              db_twitch.run(`UPDATE '${input}' SET directo = '${directo}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND streamer = '${streamer}'`, async function(err) {
                if(err) return console.log(err.message + ` ERROR #2 en funcion tw_check`)
              })}catch(err){};
            }
            else{
              let rol_ping = await filas[i].rol;
              try{await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:mega: **${nameT}** está ahora mismo en directo: **${titulo}**\n:link: ¿Vas a perdértelo?: ${link}\n:pushpin: <@&${rol_ping}>`)
              db_twitch.run(`UPDATE '${input}' SET directo = '${directo}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND streamer = '${streamer}'`, async function(err) {
                if(err) return console.log(err.message + ` ERROR #2 en funcion tw_check`)
              })}catch(err){};
            }
          }

        }
      }
    })
  })
}
async function tk_check(cliente, input){
  db_premium.get(`SELECT * FROM premium WHERE servidor = '${input}'`, async (err, filas2) => {
    /*if(!filas2 || (filas2.todo===null && filas2.social===null)) return;*/
    if(err) return console.log(err.message + ` ERROR #0 en funcion tw_check`)
    db_tiktok.all(`SELECT * FROM '${input}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 en funcion tw_check`)
      let status;
      for(var i=0 ; i<filas.length ; i++){
        let servidor = await filas[i].servidor;
        let canal = await filas[i].canal;
        let streamer = await filas[i].cuenta;
        try{await cliente.guilds.fetch(servidor);}catch(err){};

        let posts;
        try{ posts = await TikTokScraper.user(streamer, { number: 1, sessionList: ['sid_tt=58ba9e34431774703d3c34e60d584475;','sid_tt=521kkadkasdaskdj4j213j12j312;','sid_tt=12312312312312;','sid_tt=21312213'] }); }catch(err){};
        let directo = posts.collector[0].webVideoUrl;
        if(!filas[i].post || filas[i].post===null || filas[i].post==='NULL'){
          if(!filas[i].rol || filas[i].rol==="---"){
            try{await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:mobile_phone: **${streamer}** tiene una publicación nueva: **${posts.collector[0].text}**\n:battery: ¿Vas a verlo o qué?: ${directo}\n`)
            await cliente.guilds.resolve(servidor).channels.resolve(canal).send(posts.collector[0].covers.origin)
            db_tiktok.run(`UPDATE '${input}' SET post = '${directo}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND cuenta = '${streamer}'`, async function(err) {
              if(err) return console.log(err.message + ` ERROR #2 en funcion tw_check`)
            })}catch(err){};
          }
          else{
            let rol_ping = await filas[i].rol;
            try{await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:mobile_phone: **${streamer}** tiene una publicación nueva: **${posts.collector[0].text}**\n:battery: ¿Vas a verlo o qué?: ${directo}\n:pushpin: <@&${rol_ping}>\n`)
            await cliente.guilds.resolve(servidor).channels.resolve(canal).send(posts.collector[0].covers.origin)
            db_tiktok.run(`UPDATE '${input}' SET post = '${directo}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND cuenta = '${streamer}'`, async function(err) {
              if(err) return console.log(err.message + ` ERROR #2 en funcion tw_check`)
            })}catch(err){};
          }
        }
        else{
          let directoX = await filas[i].post;
          if(directoX != directo){

            if(!filas[i].rol || filas[i].rol==="---"){
              try{await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:mobile_phone: **${streamer}** tiene una publicación nueva: **${posts.collector[0].text}**\n:battery: ¿Vas a verlo o qué?: ${directo}\n`)
                await cliente.guilds.resolve(servidor).channels.resolve(canal).send(posts.collector[0].covers.origin)
                db_tiktok.run(`UPDATE '${input}' SET post = '${directo}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND cuenta = '${streamer}'`, async function(err) {
                if(err) return console.log(err.message + ` ERROR #3 en funcion tw_check`)
              })}catch(err){};
            }
            else{
              let rol_ping = await filas[i].rol;
              try{await cliente.guilds.resolve(servidor).channels.resolve(canal).send(`:mobile_phone: **${streamer}** tiene una publicación nueva: **${posts.collector[0].text}**\n:battery: ¿Vas a verlo o qué?: ${directo}\n:pushpin: <@&${rol_ping}>\n`)
                await cliente.guilds.resolve(servidor).channels.resolve(canal).send(posts.collector[0].covers.origin)
                db_tiktok.run(`UPDATE '${input}' SET post = '${directo}' WHERE servidor = '${servidor}' AND canal = '${canal}' AND cuenta = '${streamer}'`, async function(err) {
                if(err) return console.log(err.message + ` ERROR #3 en funcion tw_check`)
              })}catch(err){};
            }
          }
        }
      }
    })
  })
}

async function httpGetAsync(theUrl, callback){
  var xmlHttp = new XMLHttpRequest();
  await xmlHttp.open("GET", theUrl, true);
  xmlHttp.onreadystatechange = async function() {
    if(xmlHttp.readyState===4 && xmlHttp.status===200) await callback(xmlHttp.responseText);
  }
  await xmlHttp.send(null);
}
async function noticias_periodico(client, filas){
  let enlaces_periodico = [];

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;

  try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if(request.resourceType() === 'document') request.continue();
      else request.abort();
    });
    await page.goto("https://www.bbc.com/mundo");

    for(var i=1 ; i<=9 ; i++){
      let fecha_Periodico = await page.waitForXPath(`//*[@id="main-wrapper"]/div/main/div/section[1]/div[2]/ul/li[${i}]/div/div[2]/time/@datetime`)
      let fecha_periodico = await page.evaluate(element => element.textContent, fecha_Periodico)

      if(fecha_periodico === today){
        let url_Periodico = await page.waitForXPath(`//*[@id="main-wrapper"]/div/main/div/section[1]/div[2]/ul/li[${i}]/div/div[2]/h3/a`)
        let url_periodico = await page.evaluate(element => element.href, url_Periodico)
        comprobar_periodico(client, filas, url_periodico, fecha_periodico)
      }
    }
    browser.close();
  }catch(e){}
}
