/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

client.request = new (require("rss-parser"))();

const parser = require('fast-xml-parser');
const he = require('he');

var options = {
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

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const amazonScraper = require('amazon-buddy');
const BitlyClient = require('bitly').BitlyClient;
const amazonPaapi = require('amazon-paapi');

let product_by_asin=[];
let url_amazon;
let imagen_amazon;
let producto_amazon;
let prime_amazon;
let review_amazon;
let asin = [];
let embed_x;
let precio_amazon;
let url_amazon_larga;

var iapibitly=0;
var bitly;

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");
const db_configuracion = new sqlite3.Database("./memoria/db_configuracion.sqlite");
const db_check = new sqlite3.Database("./memoria/db_check.sqlite");
const db_niveles = new sqlite3.Database("./memoria/db_niveles.sqlite");
const db_rangos = new sqlite3.Database("./memoria/db_rangos.sqlite");
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_tematicos = new sqlite3.Database("./memoria/db_tematicos.sqlite");
const db_valentin = new sqlite3.Database("./memoria/db_valentin.sqlite");
const db_regalos_sv = new sqlite3.Database("./memoria/db_regalos_sv.sqlite");
const db_pascua = new sqlite3.Database("./memoria/db_pascua.sqlite");
const db_ausente = new sqlite3.Database("./memoria/db_ausente.sqlite");
const db_scammers = new sqlite3.Database("./memoria/db_scammers.sqlite");

const palabrotas = require("../../archivos/Documentos/Palabrotas/palabrotas.json")

const sv_bombones = require("../../archivos/Documentos/Tematicos/San Valentin/bombones.json")
const sv_bombones_imagenes = require("../../archivos/Documentos/Tematicos/San Valentin/bombones_imagenes.json")
const sv_ingredientes = require("../../archivos/Documentos/Tematicos/San Valentin/ingredientes.json")
const sv_ingredientes_comandos = require("../../archivos/Documentos/Tematicos/San Valentin/ingredientes_comandos.json")
const sv_ingredientes_imagenes = require("../../archivos/Documentos/Tematicos/San Valentin/ingredientes_imagenes.json")

const huevos_pascua = require("../../archivos/Documentos/Tematicos/Pascua/huevos_pascua.json")
const gif_huevos_pascua = require("../../archivos/Documentos/Tematicos/Pascua/gif_huevos_pascua.json")

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message) => {
  if(message.channel.type === "dm") return;

  if(message.author.bot) return;

  if(!client.config.prefijos[message.guild.id]) client.config.prefijos[message.guild.id] = client.config.prefijo;

  let messageArray = message.content.split(" ");
  
  // ANALISIS SPAM
  if(client.config.paso_spam_servidores[message.guild.id] != 1){
    if(message.author.id===`${client.config.id}`) return;
    db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 en la funcion de valoracion spam`)
      if(filas.antispam) client.config.permiso_spam[message.guild.id] = filas.antispam;
      else client.config.permiso_spam[message.guild.id] = 'OFF';
      if(filas.antiscam) client.config.permiso_scam[message.guild.id] = filas.antiscam;
      else client.config.permiso_scam[message.guild.id] = 'OFF'
      if(filas.terminator) client.config.permiso_terminator[message.guild.id] = filas.terminator;
      else client.config.permiso_terminator[message.guild.id] = 'OFF'
      client.config.paso_spam_servidores[message.guild.id] = 1;
    });
  }
  // SISTEMA ANTI-SPAM
  if(client.config.permiso_spam[message.guild.id]==='ON'){
    if(message.author.id===`${client.config.id}`) return;
    let mensaje_analizar = message.content;
    if(!client.config.contador_mensajes[message.author.id]) client.config.contador_mensajes[message.author.id] = 0;
    let auxTEMP;
    // ---
    if(message.author.id != client.config.id){
      if((client.config.spam_mensajes[message.author.id]===null) && (client.config.tiempo_mensajes[message.author.id]===null)){
        client.config.spam_mensajes[message.author.id] = mensaje_analizar;
        client.config.tiempo_mensajes[message.author.id] = Date.now();
      }
      else{
        auxTEMP = (Date.now()) - client.config.tiempo_mensajes[message.author.id]
        if(((mensaje_analizar === client.config.spam_mensajes[message.author.id]) && (auxTEMP<2000)) || (auxTEMP<2500)){
          client.config.contador_mensajes[message.author.id] = client.config.contador_mensajes[message.author.id] + 1;
          client.config.spam_mensajes[message.author.id] = mensaje_analizar;
          client.config.tiempo_mensajes[message.author.id] = Date.now();
        }
        else{
          client.config.contador_mensajes[message.author.id] = 0;
          client.config.spam_mensajes[message.author.id] = null;
          client.config.tiempo_mensajes[message.author.id] = null;
        }
        if(client.config.contador_mensajes[message.author.id] >= 5){
          if(message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")){
            let role = message.guild.roles.cache.find(r => r.name === "Muteado por Alejandreta")
        		if(!role){
        			role = await message.guild.roles.create({
        				data : {
        					name : "Muteado por Alejandreta",
        					color : "#ff0000",
        					permissions : []
        				}
        			})
        		}
            message.guild.channels.cache.forEach(async (channel) => {
              await channel.updateOverwrite(role, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                USE_VAD: false,
                SPEAK: false
              })
            })
            db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, (err, filas25) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #1 muteando a un usuario`)
              if(filas25 && filas25.sanciones){
                let user = message.member;
                let embed25 = new Discord.MessageEmbed()
                .setAuthor(`Usuario muteado por Alejandreta`, 'https://cdn.discordapp.com/attachments/823263020246761523/840904595692847114/1f507.png')
                .setDescription(`**Motivo:** **¡SE HA MUTEADO A UN USUARIO!** :mute:\n\n**ACTIVADO SISTEMA ANTI-SPAM.** Riesgo de FLOOD en el servidor. Contacta con un administrador.`)
                .setColor("#3A53F7")
                .setThumbnail(user.user.displayAvatarURL())
                .addField("Servidor: ", message.guild.name, true)
                .addField("Usuario muteado: ", `${message.author}`, true)
                .addField("Muteado desde: ", message.channel, true)
                .setTimestamp();
                try{user.send(embed25)}catch{}
                try{user.roles.add(role).catch();
                return client.channels.resolve(filas25.sanciones).send(embed25);}catch{}
              }
              else{
                let user = message.member;
                try{user.roles.add(role).catch();
                return message.channel.send(new Discord.MessageEmbed().setDescription(`El **MUTEO** ha sido realizado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`)).then(m => m.delete({ timeout: 10000}))}catch{}
              }
            })
          }
          client.config.contador_mensajes[message.author.id] = 0;
          if(client.config.permiso_terminator[message.guild.id]==='ON' && message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")){
            db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, (err, filas10) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #1 baneando a un usuario`)
              if(filas10 && filas10.sanciones){
                let user = message.member;
                let embed10 = new Discord.MessageEmbed()
                .setAuthor(`Usuario baneado por Alejandreta`, 'https://cdn.discordapp.com/attachments/823263020246761523/840903757591609364/OIP.png')
                .setDescription(`**Motivo:** **¡UN USUARIO HA SIDO BANEADO!** :no_entry_sign:\n\n**MODO TERMINATOR ACTIVADO.** Se ha detectado SPAM de mensajes en el servidor. Riesgo de FLOOD y RAID`)
                .setColor("#BC0000")
                .setThumbnail(user.user.displayAvatarURL())
                .addField("Servidor: ", message.guild.name, true)
                .addField("Usuario baneado: ", `${message.author}`, true)
                .addField("Baneado desde: ", message.channel, true)
                .setTimestamp();
                try{user.send(embed10)}catch{}
                try{message.guild.members.ban(user, {reason: reason})}catch{return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido banear a este usuario. Lo siento.`)).then(m => m.delete({ timeout: 6000}))}
                try{return client.channels.resolve(filas10.sanciones).send(embed10);}catch{}
              }
              else{
                let user = message.member;
                try{message.guild.members.ban(user, {reason: reason})}catch{return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido banear a este usuario. Lo siento.`)).then(m => m.delete({ timeout: 6000}))}
                return message.channel.send(new Discord.MessageEmbed().setDescription(`El **BANEO** ha sido realizado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`)).then(m => m.delete({ timeout: 10000}))
              }
            })
          }
        }
      }
    }
  };
  // SISTEMA ANTI-SCAM
  if(client.config.permiso_scam[message.guild.id]==='ON' && client.config.enlaces_scam.some(s => message.content.includes(s))) {
    if(message.author.id===`${client.config.id}`) return;

    message.delete();
    message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ ${message.author} ⛔\n\n**Tu mensaje incluía contenido malicioso.**`)).then(m => m.delete({ timeout: 10000}))

    if(message.author.id != client.config.dueño){
      db_scammers.get(`SELECT * FROM usuarios WHERE scam = '${message.author.id}'`, async (err, filas40) => {
        if(err) return;
        let sentencia;
        if(!filas40) db_scammers.run(`INSERT INTO usuarios(scam) VALUES('${message.author.id}')`, function(err) { if(err) return; })
      })
    }

    db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, (err, filas25) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 muteando a un usuario`)
      if(filas25 && filas25.sanciones){
        let user = message.member;
        let embed25 = new Discord.MessageEmbed()
          .setAuthor(`Usuario expulsado por Alejandreta`, 'https://cdn.discordapp.com/attachments/823263020246761523/840904595692847114/1f507.png')
          .setDescription(`**Motivo:** **¡SE HA EXPULSADO A UN USUARIO!** :mute:\n\n**ACTIVADO SISTEMA ANTI-SCAM.** Publicado enlace malicioso: ${message.content}`)
          .setColor("#E56B00")
          .setThumbnail(user.user.displayAvatarURL())
          .addField("Servidor: ", message.guild.name, true)
          .addField("Usuario expulsado: ", `${message.author}`, true)
          .addField("Expulsado desde: ", message.channel, true)
          .setTimestamp();
        try{user.send(embed25)}catch{}
        try{message.guild.member(user).kick(reason)}catch{return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido expulsar a este usuario. Lo siento.`)).then(m => m.delete({ timeout: 6000}))}
        try{return client.channels.resolve(filas25.sanciones).send(embed25);}catch{}
      }
      else{
        let user = message.member;
        try{message.guild.member(user).kick(reason)}catch{return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido expulsar a este usuario. Lo siento.`)).then(m => m.delete({ timeout: 6000}))}
        return message.channel.send(new Discord.MessageEmbed().setDescription(`La **EXPULSIÓN** ha sido realizada con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`)).then(m => m.delete({ timeout: 10000}))
      }
    })

    if(client.config.permiso_terminator[message.guild.id]==='ON' && message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")){
      db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, (err, filas10) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #1 baneando a un usuario`)
        if(filas10 && filas10.sanciones){
          let user = message.member;
          let embed10 = new Discord.MessageEmbed()
            .setAuthor(`Usuario baneado por Alejandreta`, 'https://cdn.discordapp.com/attachments/823263020246761523/840903757591609364/OIP.png')
            .setDescription(`**Motivo:** **¡UN USUARIO HA SIDO BANEADO!** :no_entry_sign:\n\n**MODO TERMINATOR ACTIVADO.** Publicado enlace malicioso: ${message.content}`)
            .setColor("#BC0000")
            .setThumbnail(user.user.displayAvatarURL())
            .addField("Servidor: ", message.guild.name, true)
            .addField("Usuario baneado: ", `${message.author}`, true)
            .addField("Baneado desde: ", message.channel, true)
            .setTimestamp();
          try{user.send(embed10)}catch{}
          try{message.guild.members.ban(user, {reason: reason})}catch{return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido banear a este usuario. Lo siento.`)).then(m => m.delete({ timeout: 6000}))}
          try{return client.channels.resolve(filas10.sanciones).send(embed10);}catch{}
        }
        else{
          let user = message.member;
          try{message.guild.members.ban(user, {reason: reason})}catch{return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido banear a este usuario. Lo siento.`)).then(m => m.delete({ timeout: 6000}))}
          return message.channel.send(new Discord.MessageEmbed().setDescription(`El **BANEO** ha sido realizado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`)).then(m => m.delete({ timeout: 10000}))
        }
      })
    }
  };
  // SISTEMA DE BLOQUEO DE INVITACIONES DE DISCORD
  if((message.content.includes("https://discord.gg/") || message.content.includes("https://discord.com/invite")) && !message.member.hasPermission("ADMINISTRATOR")){
    if(message.author.id===`${client.config.id}`) return;
    db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 en la funcion de bloquear invitaciones de Discord`)
      if(filas.invitaciones==='ON'){
        message.delete();
        if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
        message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ ${message.author} ⛔\n\n**Está prohibido postear links de Discord.**`)).then(m => m.delete({ timeout: 10000}))
        db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas2) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 en la funcion de bloquear invitaciones de Discord`)
          if(!filas2) return;
          if(filas2.logs){
            let canal = await client.channels.resolve(filas2.logs);
            let embed = new Discord.MessageEmbed()
              .setTitle(":link: **SE HA BLOQUEADO UNA INVITACIÓN DE DISCORD**")
              .setDescription(`:scroll: Mensaje: ${message}`)
              .addField(`:busts_in_silhouette: Autor: `, message.author, true)
              .addField(`:hash: Tag: `, message.author.tag, true)
              .addField(`:computer: Canal: `, `<#${message.channel.id}>`, true)
              .setThumbnail(message.author.avatarURL())
              .setColor("#681fcf")
              .setTimestamp();
            canal.send(embed)
          }
        });
      }
      if(filas.terminator==='ON'){
        db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, (err, filas44) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #1 expulsando a un usuario`)
          if(filas44 && filas44.sanciones)
          {
            let user = message.member
            let embed44 = new Discord.MessageEmbed()
              .setAuthor(`Usuario expulsado por Alejandreta`, 'https://cdn.discordapp.com/attachments/823263020246761523/840905123836067850/boom-emoji-by-twitter.png')
              .setDescription(`**Motivo:** **¡UN USUARIO HA SIDO EXPULSADO!** :anger:\n\n**MODO TERMINATOR ACTIVADO.** Se ha detectado SPAM de una invitacion a otro servidor de Discord`)
              .setColor("#E56B00")
              .setThumbnail(user.user.displayAvatarURL())
              .addField("Servidor: ", message.guild.name, true)
              .addField("Usuario expulsado: ", `${message.author}`, true)
              .addField("Expulsado desde: ", message.channel, true)
              .setTimestamp();
            try{user.send(embed44)}catch{}
            try{message.guild.member(user).kick(reason)}catch{return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido expulsar a este usuario. Lo siento.`)).then(m => m.delete({ timeout: 6000}))}
            try{return client.channels.resolve(filas44.sanciones).send(embed44);}catch{}
          }
          else{
            let user = message.member;
            try{message.guild.member(user).kick(reason)}catch{return message.channel.send(new Discord.MessageEmbed().setDescription(`Por algún motivo, no he podido expulsar a este usuario. Lo siento.`)).then(m => m.delete({ timeout: 6000}))}
            return message.channel.send(new Discord.MessageEmbed().setDescription(`La **EXPULSIÓN** ha sido realizada con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`)).then(m => m.delete({ timeout: 10000}))
          }
        })
      }
    });
  }
  // SISTEMA DE BLOQUEO DE LENGUAJE OFENSIVO
  if(palabrotas.some(p => message.content.includes(p))){
    if(message.author.id===`${client.config.id}`) return;
    let tabu;
    let frase = messageArray;
    for(var i=0 ; i<frase.length ; i++){
      for(var j=0 ; j<palabrotas.length ; j++){
        if(frase[i] === palabrotas[j]){
          tabu = `${palabrotas[j]}`;
          break;
        }
        if(i===frase.length-1 && j===palabrotas.length-1) return;
      }
      if(tabu) break;
    }
    db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 en la funcion que bloquea el mal lenguaje`)
      if(filas.palabrotas==='ON'){
        message.delete();
        if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
        message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ ${message.author} ⛔\n\n**TU MENSAJE INCLUÍA CONTENIDO OFENSIVO, Y HA SIDO ELIMINADO.**`)).then(m => m.delete({ timeout: 10000}))
        db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas2) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 en la funcion que bloquea el mal lenguaje`)
          if(!filas2) return;

          if(filas2.logs){
            let canal = await client.channels.resolve(filas2.logs)
            let embed = new Discord.MessageEmbed()
    		  		.setTitle(":face_with_symbols_over_mouth: **DETECTADO LENGUAJE OFENSIVO**")
    			  	.setDescription(`:scroll: Mensaje: ${message}\n:no_entry_sign: El escáner detectó: ${tabu}`)
              .addField(`:busts_in_silhouette: Autor: `, message.author, true)
              .addField(`:hash: Tag: `, message.author.tag, true)
              .addField(`:computer: Canal: `, `<#${message.channel.id}>`, true)
              .setThumbnail(message.author.avatarURL())
              .setColor("#CF0A0A")
              .setTimestamp();
    			  canal.send(embed);
          }
        });
      }
      if(filas.terminator==='ON'){
        if(message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")){
          let role = message.guild.roles.cache.find(r => r.name === "Muteado por Alejandreta")
          if(!role){
            role = await message.guild.roles.create({
              data : {
                name : "Muteado por Alejandreta",
                color : "#ff0000",
                permissions : []
              }
            })
          }
          message.guild.channels.cache.forEach(async (channel) => {
            await channel.updateOverwrite(role, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false,
              USE_VAD: false,
              SPEAK: false
            })
          })
          db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, (err, filas25) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #1 muteando a un usuario`)
            if(filas25 && filas25.sanciones){
              let user = message.member;
              let embed25 = new Discord.MessageEmbed()
              .setAuthor(`Usuario muteado por Alejandreta`, 'https://cdn.discordapp.com/attachments/823263020246761523/840904595692847114/1f507.png')
              .setDescription(`**Motivo:** **¡SE HA MUTEADO A UN USUARIO!** :mute:\n\n**MODO TERMINATOR ACTIVADO.** Se ha detectado lenguaje ofensivo en el chat.`)
              .setColor("#3A53F7")
              .setThumbnail(user.user.displayAvatarURL())
              .addField("Servidor: ", message.guild.name, true)
              .addField("Usuario muteado: ", `${message.author}`, true)
              .addField("Muteado desde: ", message.channel, true)
              .setTimestamp();
              try{user.send(embed25)}catch{}
              try{user.roles.add(role).catch();
              return client.channels.resolve(filas25.sanciones).send(embed25);}catch{}
            }
            else{
              let user = message.member;
              try{user.roles.add(role).catch();
              return message.channel.send(new Discord.MessageEmbed().setDescription(`El **MUTEO** ha sido realizado con éxito. Recuerda asignar un canal para ver todas las sanciones tecleando en el canal que tu elijas **${client.config.prefijos[message.guild.id]}sanciones**`)).then(m => m.delete({ timeout: 10000}))}catch{}
            }
          })
        }
      }
    })
	}
  // COMPRUEBA EL CANAL DE CHECK
  if(!client.config.canal_verificacion[message.guild.id]){
    db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
      if(message.author.id===`${client.config.id}`) return;
      if(message.author.bot) return;
      if(!filas) return;
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 chequeando canal de verificacion`)
      if(filas.verificacion) client.config.canal_verificacion = filas.verificacion;
      else client.config.canal_verificacion = 0;
      if(message.channel.id === client.config.canal_verificacion){
        message.delete();
        db_check.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas2) => {
          if(!filas2) return;
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 chequeando canal de verificacion`)
          else{
            if(filas2.codigo === message.content){
              let rol_check = message.member.guild.roles.cache.find(r => r.name === "¡CHECK-ALEJANDRETA!")
              if(!rol_check) rol_check = await message.member.guild.roles.create({data: {name: "¡CHECK-ALEJANDRETA!", color: "#FF0000"}})
              message.member.roles.remove(rol_check).catch(console.error());
              db_check.run(`DELETE FROM usuarios WHERE id = ${message.author.id}`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 chequeando canal de verificacion`)
              })
              if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
              message.channel.send(new Discord.MessageEmbed().setDescription(`:white_check_mark: ${message.author}\n\n**CÓDIGO VERIFICADO**`)).then(m => m.delete({ timeout: 5000}))
              db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas3) => {
                if(err) return console.log(err.message + ` ERROR #123 en la funcion de check verificacion`)
                if(!filas3) return;

                if(filas3.rolinicial){
                  if(!message.member.guild.me.hasPermission("MANAGE_ROLES")) return;
                  let rol_inicial = await message.guild.roles.cache.find(r => r.id === `${filas3.rolinicial}`);
                  if(!rol_inicial) return;
                  message.member.roles.add(rol_inicial).catch(console.error());
                }
              });
            }
            else if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
            else return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: ${message.author}\n\n**CÓDIGO ERRÓNEO**`)).then(m => m.delete({ timeout: 5000}))
          }
        });
      }
    });
  }
  else{
    if(message.channel.id === client.config.canal_verificacion){
      if(message.author.id===`${client.config.id}`) return;
      if(message.author.bot) return;
      message.delete();
      db_check.get(`SELECT * FROM usuarios WHERE id = ${message.author.id}`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #3 chequeando canal de verificacion`)
        if(!filas2) return;
        else{
          if(filas2.codigo === message.content){
            let rol_check = message.member.guild.roles.cache.find(r => r.name === "¡CHECK-ALEJANDRETA!")
            if(!rol_check) rol_check = await message.member.guild.roles.create({data: {name: "¡CHECK-ALEJANDRETA!", color: "#FF0000"}})
            message.member.roles.remove(rol_check).catch(console.error());
            if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
            return message.channel.send(new Discord.MessageEmbed().setDescription(`:white_check_mark: ${message.author}\n\n**CÓDIGO VERIFICADO**`)).then(m => m.delete({ timeout: 5000}))
          }
          else if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
          else return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: ${message.author}\n\n**CÓDIGO ERRÓNEO**`)).then(m => m.delete({ timeout: 5000}))
        }
      });
    }
  }
  // SUMADOR DE XP PARA NIVELES
  if(message.author.bot) return;
  db_niveles.run(`CREATE TABLE IF NOT EXISTS '${message.guild.id}' (usuario TEXT, xp INTEGER, nivel INTEGER, multiplicador INTEGER)`, function(err) {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 checkeando los niveles`)
    db_niveles.get(`SELECT * FROM '${message.guild.id}' WHERE usuario = '${message.author.id}'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 checkeando los niveles`)
      db_configuracion.get(`SELECT * FROM servidores WHERE id = '${message.guild.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #3 checkeando los niveles`)
        let bonus;
        if(filas2){
          if(filas2.multiplicador) bonus = filas2.multiplicador;
          else if(filas2.multiplicador===0) bonus = 0;
          else bonus = 1;
        }
        else bonus = 1;
        if(bonus===0) return;
        if(!filas){
          db_niveles.run(`INSERT INTO '${message.guild.id}'(usuario, xp, nivel, multiplicador) VALUES('${message.author.id}', ${1*bonus}, 0, ${bonus})`, function(err) {
            if(err) return console.log(err.message + ` ${message.content} ERROR #4 checkeando los niveles`)
            db_rangos.get(`SELECT * FROM servidores WHERE id = '${message.guild.id}'`, async (err, filas3) => {
              if(err) return console.log(err.message + ` ${message.content} ERROR #1 comprobando rangos`)
              if(!filas3) return;
              if(!filas3[`r_${1}`]) return;
              else{
                let rol = message.guild.roles.cache.find(r => r.name === filas3[`r_${1}`]);
                if(!rol) return;
                if(!message.member.roles.cache.has(rol.id)){
                  message.member.roles.add(rol).catch(console.error);
                  if(message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:tada: **MIS FELICITACIONES ${message.author}** :tada:\n\nHas subido de rango a: ${rol.name}`)).then(m => m.delete({ timeout: 15000}))
                }
              }
            })
          })
        }
        else{
          if(filas.xp+(1*bonus)>=500){
            db_niveles.run(`UPDATE '${message.guild.id}' SET nivel = ${filas.nivel+1}, xp = 0, multiplicador = ${bonus} WHERE usuario = ${message.author.id}`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #5 checkeando los niveles`)
              message.channel.send(new Discord.MessageEmbed().setDescription(`:confetti_ball: **ENHORABUENA ${message.author}** :tada:\n\nHas subido al nivel: ${filas.nivel+1}`)).then(m => m.delete({ timeout: 15000}))
              db_rangos.get(`SELECT * FROM servidores WHERE id = '${message.guild.id}'`, async (err, filas3) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #2 comprobando rangos`)
                if(!filas3) return;
                if(!filas3[`r_${filas.nivel+1}`]) return;
                else{
                  let rol = message.guild.roles.cache.find(r => r.name === filas3[`r_${filas.nivel+1}`]);
                  if(!rol) return;
                  if(!message.member.roles.cache.has(rol.id)){
                    message.member.roles.add(rol).catch(console.error);
                    if(message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:tada: **MIS FELICITACIONES ${message.author}** :tada:\n\nHas subido de rango a: ${rol.name}`)).then(m => m.delete({ timeout: 15000}))
                  }
                }
              })
            })
          }
          else{
            db_niveles.run(`UPDATE '${message.guild.id}' SET xp = ${filas.xp+(bonus*1)}, multiplicador = ${bonus} WHERE usuario = ${message.author.id}`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #6 checkeando los niveles`)
              db_rangos.get(`SELECT * FROM servidores WHERE id = '${message.guild.id}'`, async (err, filas3) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 comprobando rangos`)
                if(!filas3) return;
                if(!filas3[`r_${filas.nivel}`]) return;
                else{
                  let rol = message.guild.roles.cache.find(r => r.name === filas3[`r_${filas.nivel}`]);
                  if(!rol) return;
                  if(!message.member.roles.cache.has(rol.id)){
                    message.member.roles.add(rol).catch(console.error);
                    if(message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:tada: **MIS FELICITACIONES ${message.author}** :tada:\n\nHas subido de rango a: ${rol.name}`)).then(m => m.delete({ timeout: 15000}))
                  }
                }
              })
            })
          }
        }
      });
    });
  });
  // DETECTOR DEL MODO AUSENTE
  let mencionados = message.mentions.users.map(m => m.id);
  if(mencionados){
    for(var i=0 ; i<mencionados.length ; i++) await comprobar_ausencia(client, message, mencionados[i])
  }
  // EVENTO DE SAN VALENTIN
  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas9) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    /*if(!filas9) return;*/
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'valentin'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 en funciones automatas de san valentin`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_valentin.get(`SELECT * FROM servidores WHERE id = '${message.guild.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 en funciones automatas de san valentin`)
        if(!filas2 || !filas2.canal) return;

        if(!client.config.sv_contador_mensajes[message.guild.id]){
          if(message.channel.id===filas2.canal){
            client.config.sv_contador_mensajes[message.guild.id] = 1;
            client.config.sv_limite_mensajes[message.guild.id] = Math.round(Math.random()*(3-0))+5
            client.config.sv_tiempo_mensajes[message.guild.id] = ((Date.now()) + ((Math.round(Math.random()*(0-0))+0)*60*1000))
          }
        }
        else{
          if((message.channel.id===filas2.canal) && (client.config.sv_tiempo_mensajes[message.guild.id]<=Date.now())) client.config.sv_contador_mensajes[message.guild.id] = client.config.sv_contador_mensajes[message.guild.id]+1;
        }

        if(client.config.sv_contador_mensajes[message.guild.id]>=client.config.sv_limite_mensajes[message.guild.id]){

          let sifco = 0;
          client.config.sv_contador_mensajes[message.guild.id] = null;
          let reno = Math.round(Math.random()*100)
          if(reno>=0 && reno<=17) reno = 0;
          else if(reno>=18 && reno<=35) reno = 1;
          else if(reno>=36 && reno<=41) reno = 2;
          else if(reno>=42 && reno<=59) reno = 3;
          else if(reno>=60 && reno<=77) reno = 4;
          else if(reno>=78 && reno<=95) reno = 5;
          else reno = 6;

          let embed = new Discord.MessageEmbed()
            .setTitle(`:heart: __**ATENCIÓN**__ :heart:`)
            .setDescription(`¡UPS! Te ha caído en la cabeza **${sv_ingredientes[reno]}**\n`+"Recógelo escribiendo `"+client.config.prefijos[message.guild.id]+"sv."+sv_ingredientes_comandos[reno]+"`")
            .setImage(`${sv_ingredientes_imagenes[reno]}`)
            .setFooter(`Corre, antes de que te lo quiten.`)
            .setColor(`#D36FF6`)
            .setTimestamp();
          let mensaje = await client.channels.resolve(filas2.canal).send(embed)
          const collector = message.channel.createMessageCollector(m => m.channel.id === filas2.canal, {time : 60000});
          collector.on("collect", async m => {
            if(m.content===`${client.config.prefijos[message.guild.id]}sv.${sv_ingredientes_comandos[reno]}`){
              sifco = 1;
              collector.stop();
              client.config.sv_tiempo_mensajes[message.guild.id] = ((Date.now()) + ((Math.round(Math.random()*(2-1))+1)*60*1000))
              client.config.sv_limite_mensajes[message.guild.id] = Math.round(Math.random()*(20-10))+10
              db_valentin.run(`CREATE TABLE IF NOT EXISTS '${message.guild.id}' (id TEXT, ingrediente_1 INTEGER, ingrediente_2 INTEGER, ingrediente_3 INTEGER, ingrediente_4 INTEGER, ingrediente_5 INTEGER, ingrediente_6 INTEGER, ingrediente_7 INTEGER, bombones INTEGER, regalos INTEGER, num_bombones INTEGER, num_regalos INTEGER, mensaje_ayuda TEXT, canal_ayuda TEXT, pagina_ayuda INTEGER)`, async function(err) {
                if(err) return console.log(err.message + ` ERROR #1 ganando puntos`)
                db_regalos_sv.run(`CREATE TABLE IF NOT EXISTS servidores (id TEXT, canal TEXT, mensaje TEXT, bombon INTEGER, autor TEXT)`, async function(err) {
                  if(err) return console.log(err.message + ` ERROR #1 ganando puntos`)
                  db_valentin.get(`SELECT * FROM '${message.guild.id}' WHERE id = '${m.author.id}'`, async (err, filas3) => {
                    if(err) return console.log(err.message + ` ${message.content} ERROR #2 ganando puntos`)
                    if(!filas3){
                      db_valentin.run(`INSERT INTO '${message.guild.id}'(id, ingrediente_1, ingrediente_2, ingrediente_3, ingrediente_4, ingrediente_5, ingrediente_6, ingrediente_7, bombones, regalos, num_bombones, num_regalos) VALUES('${m.author.id}', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
                        db_valentin.run(`UPDATE '${message.guild.id}' SET ingrediente_${reno+1} = 1 WHERE id = '${m.author.id}'`, async function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
                          sifco = 1;
                          await mensaje.edit(new Discord.MessageEmbed().setTitle(`:gift: __**ENHORABUENA**__ :gift:`).setDescription(`**${m.author}**, has conseguido **${sv_ingredientes[reno]}** para tus bombones.`).setImage(`${sv_ingredientes_imagenes[reno]}`).setColor(`#6FAEF6`).setFooter(`Pronto caerán más ingredientes...`).setTimestamp())
                        })
                      })
                    }
                    else{
                      sifco = 1;
                      collector.stop();
                      let anclaje = filas3[`ingrediente_${reno+1}`];
                      db_valentin.run(`UPDATE '${message.guild.id}' SET ingrediente_${reno+1} = ${anclaje+1} WHERE id = '${m.author.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #4 ganando puntos`)
                        sifco = 1;
                        await mensaje.edit(new Discord.MessageEmbed().setTitle(`:gift: __**ENHORABUENA**__ :gift:`).setDescription(`**${m.author}**, has conseguido **${sv_ingredientes[reno]}** para tus bombones.`).setImage(`${sv_ingredientes_imagenes[reno]}`).setColor(`#6FAEF6`).setFooter(`Pronto caerán más ingredientes...`).setTimestamp())
                      })
                    }
                  })
                })
              })
              return;
            }
            else if(m.content.startsWith(`${client.config.prefijos[message.guild.id]}sv.`) && m.content!=`${client.config.prefijos[message.guild.id]}sv.${sv_ingredientes_comandos[reno]}` && !m.content.startsWith(`${client.config.prefijos[message.guild.id]}sv.caja`) && !m.content.startsWith(`${client.config.prefijos[message.guild.id]}sv.regalar`) && !m.content.startsWith(`${client.config.prefijos[message.guild.id]}sv.amorosos`) && !m.content.startsWith(`${client.config.prefijos[message.guild.id]}sv.queridos`) && !m.content.startsWith(`${client.config.prefijos[message.guild.id]}sv.recetas`) && !m.content.startsWith(`${client.config.prefijos[message.guild.id]}sv.ayuda`) && !m.content.startsWith(`${client.config.prefijos[message.guild.id]}sv.piropo`) && !m.content.startsWith(`${client.config.prefijos[message.guild.id]}sv.canal`)){
              sifco = 1;
              collector.stop();
              client.config.sv_tiempo_mensajes[message.guild.id] = ((Date.now()) + ((Math.round(Math.random()*(2-1))+1)*60*1000))
              client.config.sv_limite_mensajes[message.guild.id] = Math.round(Math.random()*(20-10))+10
              await mensaje.edit(new Discord.MessageEmbed().setTitle(`:broken_heart: __**HA DESAPARECIDO EL INGREDIENTE**__ :broken_heart:`).setDescription(`Vaya **${m.author}**, una gaviota ha sido más rápida que tú, y se ha llevado tu ingrediente.`).setImage(`https://cdn.discordapp.com/attachments/523268901719769088/807234090323148860/22d914203cb777f0973a92d07a12c6dfad0283a1r1-480-391_hq.gif`).setColor(`#F27C63`).setFooter(`Pronto lloverán más ingredientes...`).setTimestamp())
              collector.stop();
              return;
            }
            client.config.sv_contador_mensajes[message.guild.id] = null;
          })
          collector.on("end", async collected => {
            if(collected.size===0){
              client.config.sv_tiempo_mensajes[message.guild.id] = ((Date.now()) + ((Math.round(Math.random()*(1-0))+0)*60*1000))
              client.config.sv_limite_mensajes[message.guild.id] = Math.round(Math.random()*(20-10))+10
              await mensaje.edit(new Discord.MessageEmbed().setTitle(`:broken_heart: __**HA DESAPARECIDO EL INGREDIENTE**__ :broken_heart:`).setDescription(`Vaya, una gaviota ha sido más rápida y se ha llevado el ingrediente.`).setImage(`https://cdn.discordapp.com/attachments/523268901719769088/807234090323148860/22d914203cb777f0973a92d07a12c6dfad0283a1r1-480-391_hq.gif`).setColor(`#F27C63`).setFooter(`Pronto lloverán más ingredientes...`).setTimestamp())
              return;
            }
            if(sifco===0){
              client.config.sv_tiempo_mensajes[message.guild.id] = ((Date.now()) + ((Math.round(Math.random()*(1-0))+0)*60*1000))
              client.config.sv_limite_mensajes[message.guild.id] = Math.round(Math.random()*(20-10))+10
              await mensaje.edit(new Discord.MessageEmbed().setTitle(`:broken_heart: __**HA DESAPARECIDO EL INGREDIENTE**__ :broken_heart:`).setDescription(`Vaya, una gaviota ha sido más rápida y se ha llevado el ingrediente.`).setImage(`https://cdn.discordapp.com/attachments/523268901719769088/807234090323148860/22d914203cb777f0973a92d07a12c6dfad0283a1r1-480-391_hq.gif`).setColor(`#F27C63`).setFooter(`Pronto lloverán más ingredientes...`).setTimestamp())
              return;
            }
          });
        }
      })
    })
  })
  // EVENTO DE PASCUA
  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas9) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    /*if(!filas9) return;*/
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'pascua'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 en funciones automatas de pascua`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_pascua.get(`SELECT * FROM servidores WHERE id = '${message.guild.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 en funciones automatas de paascua`)
        if(!filas2) return;

        if(!client.config.p_contador_mensajes[message.guild.id]){
          client.config.p_contador_mensajes[message.guild.id] = 1;
          client.config.p_limite_mensajes[message.guild.id] = Math.round(Math.random()*(3-0))+5
          client.config.p_tiempo_mensajes[message.guild.id] = ((Date.now()) + ((Math.round(Math.random()*(0-0))+0)*60*1000))
        }
        else{
          if(client.config.p_tiempo_mensajes[message.guild.id]<=Date.now()) client.config.p_contador_mensajes[message.guild.id] = client.config.p_contador_mensajes[message.guild.id]+1;
        }

        if(client.config.p_contador_mensajes[message.guild.id]>=client.config.p_limite_mensajes[message.guild.id]){

          let sifco = 0;
          client.config.p_contador_mensajes[message.guild.id] = -999999999;
          let reno = Math.round(Math.random()*100)
          if(reno===0) reno = 9;
          else if(reno===1) reno = 10;
          else if(reno===2) reno = 11;
          else if(reno===3) reno = 12;
          else if(reno===4) reno = 13;
          else if(reno===5) reno = 14;
          else if(reno>=6 && reno<17) reno = 0;
          else if(reno>=17 && reno<28) reno = 1;
          else if(reno>=28 && reno<39) reno = 2;
          else if(reno>=39 && reno<50) reno = 3;
          else if(reno>=50 && reno<60) reno = 4;
          else if(reno>=60 && reno<70) reno = 5;
          else if(reno>=70 && reno<80) reno = 6;
          else if(reno>=80 && reno<90) reno = 7;
          else if(reno>=90) reno = 8;

          let num_canal = Math.round(Math.random()*(5-1))+1;
          let puntos_huevo;
          if(reno>=0 && reno<=8) puntos_huevo = reno+1;
          else puntos_huevo = 20;

          let embed = new Discord.MessageEmbed()
            .setTitle(`:egg: ¡UN HUEVITO HA APARECIDO!`)
            .setDescription(`Entre la hierba viste un huevo\n`+"Recógelo escribiendo `"+client.config.prefijos[message.guild.id]+"p.recoger`")
            .setImage(`https://cdn.discordapp.com/attachments/823263020246761523/825072955427782706/Secreto.png`)
            .setFooter(`¡Rápido, o se irá por patas!`)
            .setColor(`#C6F861`)
            .setTimestamp();
          let mensaje = await client.channels.resolve(filas2[`canal${num_canal}`]).send(embed)
          let canal = await message.guild.channels.cache.find(c => c.id === filas2[`canal${num_canal}`])
          const collector = canal.createMessageCollector(m => m.channel.id === filas2[`canal${num_canal}`], {time : 60000});
          collector.on("collect", async m => {
            if(m.content===`${client.config.prefijos[message.guild.id]}p.recoger`){
              sifco = 1;
              collector.stop();
              client.config.p_tiempo_mensajes[message.guild.id] = ((Date.now()) + ((Math.round(Math.random()*(2-1))+1)*60*1000))
              client.config.p_limite_mensajes[message.guild.id] = Math.round(Math.random()*(15-5))+5
              db_pascua.run(`CREATE TABLE IF NOT EXISTS '${message.guild.id}' (id TEXT, huevo_1 INTEGER, huevo_2 INTEGER, huevo_3 INTEGER, huevo_4 INTEGER, huevo_5 INTEGER, huevo_6 INTEGER, huevo_7 INTEGER, huevo_8 INTEGER, huevo_9 INTEGER, huevo_10 INTEGER, huevo_11 INTEGER, huevo_12 INTEGER, huevo_13 INTEGER, huevo_14 INTEGER, huevo_15 INTEGER, puntos INTEGER, mensaje_ayuda TEXT, canal_ayuda TEXT, pagina_ayuda INTEGER)`, async function(err) {
                if(err) return console.log(err.message + ` ERROR #1 ganando puntos`)

                db_pascua.get(`SELECT * FROM '${message.guild.id}' WHERE id = '${m.author.id}'`, async (err, filas3) => {
                  if(err) return console.log(err.message + ` ${message.content} ERROR #2 ganando puntos`)
                  if(!filas3){
                    db_pascua.run(`INSERT INTO '${message.guild.id}'(id, huevo_1, huevo_2, huevo_3, huevo_4, huevo_5, huevo_6, huevo_7, huevo_8, huevo_9, huevo_10, huevo_11, huevo_12, huevo_13, huevo_14, huevo_15, puntos) VALUES('${m.author.id}', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)`, async function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
                      db_pascua.run(`UPDATE '${message.guild.id}' SET huevo_${reno+1} = 1, puntos = ${puntos_huevo} WHERE id = '${m.author.id}'`, async function(err) {
                        if(err) return console.log(err.message + ` ${message.content} ERROR #3 ganando puntos`)
                        sifco = 1;
                        await mensaje.edit(new Discord.MessageEmbed().setTitle(`:shopping_bags: __**DERECHO A TU CESTA**__`).setDescription(`**${m.author}**, ahora este huevito forma parte de tu familia.`).setImage(`${huevos_pascua[reno]}`).setColor(`#BF82FF`).setFooter(`Has ganado ${puntos_huevo} puntos`).setTimestamp())
                      })
                    })
                  }
                  else{
                    sifco = 1;
                    collector.stop();
                    let anclaje = filas3[`huevo_${reno+1}`];
                    let anclaje2 = filas3.puntos;
                    if(filas3.huevo_10>0 && filas3.huevo_11>0 && filas3.huevo_12>0 && filas3.huevo_13>0 && filas3.huevo_14>0 && filas3.huevo_15>0) puntos_huevo = puntos_huevo+1;
                    db_pascua.run(`UPDATE '${message.guild.id}' SET huevo_${reno+1} = ${anclaje+1}, puntos = ${anclaje2+puntos_huevo} WHERE id = '${m.author.id}'`, async function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #4 ganando puntos`)
                      sifco = 1;
                      await mensaje.edit(new Discord.MessageEmbed().setTitle(`:shopping_bags: __**DERECHO A TU CESTA**__`).setDescription(`**${m.author}**, ahora este huevito forma parte de tu familia.`).setImage(`${huevos_pascua[reno]}`).setColor(`#BF82FF`).setFooter(`Has ganado ${puntos_huevo} puntos`).setTimestamp())
                    })
                  }
                })
              })
              client.config.p_contador_mensajes[message.guild.id] = null;
              return;
            }
            client.config.p_contador_mensajes[message.guild.id] = null;
          })
          collector.on("end", async collected => {
            if(collected.size===0){
              client.config.p_contador_mensajes[message.guild.id] = null;
              client.config.p_tiempo_mensajes[message.guild.id] = ((Date.now()) + ((Math.round(Math.random()*(2-1))+1)*60*1000))
              client.config.p_limite_mensajes[message.guild.id] = Math.round(Math.random()*(15-10))+5
              await mensaje.edit(new Discord.MessageEmbed().setTitle(`:hatching_chick: __**¡Y SE FUE!**__`).setDescription(`Creo que al pollito que llevaba dentro no le hacía gracia que se lo comieran.`).setImage(`${gif_huevos_pascua[reno]}`).setColor(`#FF9252`).setFooter(`Ya encontrarás otro huevo.`).setTimestamp())
              return;
            }
            if(sifco===0){
              client.config.p_contador_mensajes[message.guild.id] = null;
              client.config.p_tiempo_mensajes[message.guild.id] = ((Date.now()) + ((Math.round(Math.random()*(1-0))+0)*60*1000))
              client.config.p_limite_mensajes[message.guild.id] = Math.round(Math.random()*(15-10))+5
              await mensaje.edit(new Discord.MessageEmbed().setTitle(`:hatching_chick: __**¡Y SE FUE!**__`).setDescription(`Creo que al pollito que llevaba dentro no le hacía gracia que se lo comieran.`).setImage(`${gif_huevos_pascua[reno]}`).setColor(`#FF9252`).setFooter(`Ya encontrarás otro huevo.`).setTimestamp())
              return;
            }
          });
        }
      })
    })
  })
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
async function rotarbitly(){
  if(url_amazon != undefined){
    try{
      bitly = new BitlyClient(apis_bitly[iapibitly]);
      result = await bitly.shorten(url_amazon);
      url_amazon = result.link;
      return url_amazon;
    }catch(error){
      if(iapibitly < numero_apis){
      iapibitly = iapibitly+1
      rotarbitly()
      }
      if(iapibitly >= numero_apis){
        iapibitly = 0
        rotarbitly()
};};};};
async function check(){
  if(precio_amazon === '0 €' || precio_amazon === undefined){
    const requestParameters = {
      'ItemIds' : [asin],
      'ItemIdType': 'ASIN',
      'Resources' : [
        'Images.Primary.Large',
        'ItemInfo.Title',
        'Offers.Listings.DeliveryInfo.IsPrimeEligible',
        'Offers.Listings.Price'
    ]};
    amazonPaapi.GetItems(commonParameters, requestParameters).then(data => {
      precio_amazon = data.ItemsResult.Items[0].Offers.Listings[0].Price.Amount+' €';
      prime_amazon = data.ItemsResult.Items[0].Offers.Listings[0].DeliveryInfo.IsPrimeEligible;
      url_amazon = data.ItemsResult.Items[0].DetailPageURL
      imagen_amazon = data.ItemsResult.Items[0].Images.Primary.Large.URL
      producto_amazon = data.ItemsResult.Items[0].ItemInfo.Title.DisplayValue;
      if(review_amazon == undefined) review_amazon = 'No hay reviews aun';
      if(prime_amazon == true) prime_amazon = 'Disponible';
      else prime_amazon = 'No Disponible';
    }).catch(error => {});
  }
  else return precio_amazon,url_amazon,imagen_amazon,producto_amazon,prime_amazon,review_amazon;
};

function comprobar_ausencia(client, message, id){
  db_ausente.get(`SELECT * FROM ausentes WHERE usuario = '${id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 comprobando ausencia`)
    if(filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:shushing_face: __**No molestes a <@${id}>, que está ocupado**__\n\n**Motivo:** ${filas.motivo}\n**Desde hace:** ${T_convertor((Date.now())-(parseInt(filas.tiempo)))}`).setAuthor(message.author.username, message.author.avatarURL()).setColor(`#F7F9F7`))
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
  if(segundos > 0) final += segundos > 1 ? `${segundos} segundos` : `${segundos} segundo`
  return final
};
