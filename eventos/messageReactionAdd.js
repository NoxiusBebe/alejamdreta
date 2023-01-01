/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");
const db_check = new sqlite3.Database("./memoria/db_check.sqlite");
const db_sugerencias = new sqlite3.Database("./memoria/db_sugerencias.sqlite");
const db_pokemon = new sqlite3.Database("./memoria/db_pokemon.sqlite");
const db_listas = new sqlite3.Database("./memoria/db_listas.sqlite");
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");
const db_tematicos = new sqlite3.Database("./memoria/db_tematicos.sqlite");
const db_valentin = new sqlite3.Database("./memoria/db_valentin.sqlite");
const db_pascua = new sqlite3.Database("./memoria/db_pascua.sqlite");
const db_eventos = new sqlite3.Database("./memoria/db_eventos.sqlite");
const db_sorteos = new sqlite3.Database("./memoria/db_sorteos.sqlite");
const db_sorteos_todos = new sqlite3.Database("./memoria/db_sorteos_todos.sqlite");
const db_regalos_sv = new sqlite3.Database("./memoria/db_regalos_sv.sqlite");
const db_roles = new sqlite3.Database("./memoria/db_roles.sqlite");
const db_roles_mod = new sqlite3.Database("./memoria/db_roles_mod.sqlite");
const db_tickets = new sqlite3.Database("./memoria/db_tickets.sqlite");
const db_tickets_mod = new sqlite3.Database("./memoria/db_tickets_mod.sqlite");
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

let pause_pokedex = new Set();
let cooldown = new Set();

const pokemon_lleno = require("../archivos/Documentos/Pokemon/pokemon.json")
const alfanumerico = require("../archivos/Documentos/Verificacion/alfanumerico.json")
const nombres_armas_dh = require("../archivos/Documentos/Discord Hunter/armas/armas.json")

const sv_bombones = require("../archivos/Documentos/Tematicos/San Valentin/bombones.json")
const sv_bombones_imagenes = require("../archivos/Documentos/Tematicos/San Valentin/bombones_imagenes.json")
const sv_ingredientes = require("../archivos/Documentos/Tematicos/San Valentin/ingredientes.json")
const sv_ingredientes_comandos = require("../archivos/Documentos/Tematicos/San Valentin/ingredientes_comandos.json")
const sv_ingredientes_imagenes = require("../archivos/Documentos/Tematicos/San Valentin/ingredientes_imagenes.json")

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, reaction, user) => {

  if(reaction.message.channel.type === "dm") return;
  let emojiName = reaction.emoji.name;
  let mensaje = reaction.message.id;

  if(user.id === client.config.id) return;

  if(emojiName==="✅"){
    db_canales.get(`SELECT * FROM servidores WHERE id = '${reaction.message.guild.id}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 en la funcion de reaccion al check`)
      if(filas.verificacion && filas.verificacion_mensaje===mensaje){
        db_check.get(`SELECT * FROM usuarios WHERE id = ${user.id}`, async (err, filas2) => {
          if(err) return console.log(err.message + ` ERROR #2 en la funcion de reaccion al check`)
          if(!filas2){
            db_check.run(`INSERT INTO usuarios(id) VALUES(${user.id})`, function(err) {
              if(err) return console.log(err.message + ` ERROR #3 en la funcion de reaccion al check`)
              let rula1;
		          let codigo = [];
		          for(var i=0 ; i<10 ; i++){
			          rula1 = Math.round(Math.random()*60);
			          codigo[i] = alfanumerico[rula1];
		          }
              db_check.run(`UPDATE usuarios SET codigo = '${codigo.join("")}' WHERE id = ${user.id}`, function(err) {
                if(err) return console.log(err.message + ` ERROR #4 en la funcion de reaccion al check`)
                if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
                user.send(new Discord.MessageEmbed().setDescription(`Tu código es: **${codigo.join("")}**`).setColor(`#ADEB72`)).catch(() => reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`**<@${user.id}>, ha ocurrido un fallo, y no te he podido enviar el código por MD.**\n\nCambia los ajustes de privacidad en tu cuenta, o habla con un administrador.`).setColor(`#ADEB72`)).then(m => m.delete({ timeout: 15000})))
              })
            })
          }
          else{
            let rula1;
            let codigo = [];
            for(var i=0 ; i<10 ; i++){
              rula1 = Math.round(Math.random()*60);
              codigo[i] = alfanumerico[rula1];
            }
            db_check.run(`UPDATE usuarios SET codigo = '${codigo.join("")}' WHERE id = ${user.id}`, function(err) {
              if(err) return console.log(err.message + ` ERROR #5 en la funcion de reaccion al check`)
              if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
              user.send(new Discord.MessageEmbed().setDescription(`Tu código es: **${codigo.join("")}**`).setColor(`#ADEB72`)).catch(() => reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`**<@${user.id}>, ha ocurrido un fallo, y no te he podido enviar el código por MD.**\n\nCambia los ajustes de privacidad en tu cuenta, o habla con un administrador.`).setColor(`#ADEB72`)).then(m => m.delete({ timeout: 15000})))
            })
          }
        })
      }
    })
    db_sugerencias.get(`SELECT * FROM sugerencias WHERE mensaje = '${mensaje}'`, async (err, filas) => {
      if(!filas) return;
      if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
      if(err) return console.log(err.message + ` ERROR #1 en la funcion de reaccion aprobada a la sugerencia`)
      if(!reaction.message.guild.members.resolve(`${user.id}`).hasPermission("ADMINISTRATOR")) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`**<@${user.id}>, necesitas permisos de __Administrador__ para aprobar sugerencias**`).setColor(`#5FB3EB`)).then(m => m.delete({ timeout: 7000}))
      let canal;
      let mensaje;
      canal = filas.canal;
      mensaje = filas.mensaje;
      let embed = new Discord.MessageEmbed()
        .setTitle(`✅ SE HA ACEPTADO UNA SUGERENCIA`)
        .setDescription(filas.titulo)
        .setColor("#A9FD6E")
        .addField(`Aprobada por: `,`<@${user.id}>`, true)
        .setFooter(`Sugerencia aportada por: ${filas.nombre}`)
        .setTimestamp();
      if(filas.imagen != "---") embed.setImage(filas.imagen)
      let msg = await client.channels.resolve(canal).messages.fetch(mensaje)
      if(msg) msg.edit(embed)
      try{client.users.resolve(filas.autor).send(new Discord.MessageEmbed().setDescription(`✅ **TU SUGERENCIA HA SIDO ACEPTADA**\n\n**Servidor:** ${reaction.message.guild.name}\n**Sugerencia:** ${filas.titulo}`).setColor(`#69EB5F`).setImage(filas.imagen))}catch(err){};
      db_sugerencias.run(`DELETE FROM sugerencias WHERE mensaje = '${mensaje}'`, function(err) {
        if(err) return console.log(err.message + ` ERROR #2 en la funcion de reaccion aprobada a la sugerencia`)
      })
    })
  }
  if(emojiName==="⛔"){
    db_sugerencias.get(`SELECT * FROM sugerencias WHERE mensaje = '${mensaje}'`, async (err, filas) => {
      if(!filas) return;
      if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
      if(err) return console.log(err.message + ` ERROR #1 en la funcion de reaccion rechazada a la sugerencia`)
      if(!reaction.message.guild.members.resolve(`${user.id}`).hasPermission("ADMINISTRATOR")) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`**<@${user.id}>, necesitas permisos de __Administrador__ para rechazar sugerencias**`).setColor(`#5FB3EB`)).then(m => m.delete({ timeout: 7000}))
      let canal;
      let mensaje;
      canal = filas.canal;
      mensaje = filas.mensaje;
      let embed = new Discord.MessageEmbed()
        .setTitle(`⛔ SE HA RECHAZADO UNA SUGERENCIA`)
        .setDescription(filas.titulo)
        .setColor("#FC5252")
        .addField(`Rechazada por: `,`<@${user.id}>`, true)
        .setFooter(`Sugerencia aportada por: ${filas.nombre}`)
        .setTimestamp();
      if(filas.imagen != "---") embed.setImage(filas.imagen)
      let msg = await client.channels.resolve(canal).messages.fetch(mensaje)
      if(msg) msg.edit(embed)
      try{client.users.resolve(filas.autor).send(new Discord.MessageEmbed().setDescription(`⛔ **TU SUGERENCIA HA SIDO RECHAZADA**\n\n**Servidor:** ${reaction.message.guild.name}\n**Sugerencia:** ${filas.titulo}`).setColor("#FC5252").setImage(filas.imagen))}catch(err){};
      db_sugerencias.run(`DELETE FROM sugerencias WHERE mensaje = '${mensaje}'`, function(err) {
        if(err) return console.log(err.message + ` ERROR #2 en la funcion de reaccion rechazada a la sugerencia`)
      })
    })
  }
  if(emojiName==="⏩"){
    db_pokemon.all(`SELECT * FROM '${user.id}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 moviendo pagina de pokedex`)
      if(filas[0] && filas[0].mensaje === mensaje){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        if(pause_pokedex.has(user.id)) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 3 segundos** ⛔`).setColor(`#FF3737`)).then(m => m.delete({ timeout: 3000}))
        pause_pokedex.add(user.id);
    		setTimeout(() => {pause_pokedex.delete(user.id);}, 3000);
        if(filas[0].pagina >= 38) return
        db_pokemon.run(`UPDATE '${user.id}' SET pagina = ${filas[0].pagina+1}`, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 mostrando pokedex`)
          db_pokemon.all(`SELECT * FROM '${user.id}'`, async (err, filas2) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 moviendo pagina de pokedex`)
            let pokemon = [];
            for(var i=1+(24*(filas2[0].pagina-1)) ; i<25+(24*(filas2[0].pagina-1)) ; i++){
              for(var j=0 ; j<filas.length ; j++){
                if(filas[j].numero === i){
                  pokemon.push(`:white_check_mark: ` + filas[j].pokemon)
                  break;
                }
                if(j===filas.length-1){
                  pokemon.push(`:x: - - -`)
                }
              }
              if(pokemon[23]){
                let embed = new Discord.MessageEmbed()
                  .setTitle(`:red_circle: TU POKEDEX (${filas.length}/${pokemon_lleno.length}) :yellow_circle:`)
                  .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/780106754141978644/Pokedex_Gif_Transparente.gif`)
                  .addField(`Nº${1+(24*(filas2[0].pagina-1))}`, pokemon[0], true)
                  .addField(`Nº${2+(24*(filas2[0].pagina-1))}`, pokemon[1], true)
                  .addField(`Nº${3+(24*(filas2[0].pagina-1))}`, pokemon[2], true)
                  .addField(`Nº${4+(24*(filas2[0].pagina-1))}`, pokemon[3], true)
                  .addField(`Nº${5+(24*(filas2[0].pagina-1))}`, pokemon[4], true)
                  .addField(`Nº${6+(24*(filas2[0].pagina-1))}`, pokemon[5], true)
                  .addField(`Nº${7+(24*(filas2[0].pagina-1))}`, pokemon[6], true)
                  .addField(`Nº${8+(24*(filas2[0].pagina-1))}`, pokemon[7], true)
                  .addField(`Nº${9+(24*(filas2[0].pagina-1))}`, pokemon[8], true)
                  .addField(`Nº${10+(24*(filas2[0].pagina-1))}`, pokemon[9], true)
                  .addField(`Nº${11+(24*(filas2[0].pagina-1))}`, pokemon[10], true)
                  .addField(`Nº${12+(24*(filas2[0].pagina-1))}`, pokemon[11], true)
                  .addField(`Nº${13+(24*(filas2[0].pagina-1))}`, pokemon[12], true)
                  .addField(`Nº${14+(24*(filas2[0].pagina-1))}`, pokemon[13], true)
                  .addField(`Nº${15+(24*(filas2[0].pagina-1))}`, pokemon[14], true)
                  .addField(`Nº${16+(24*(filas2[0].pagina-1))}`, pokemon[15], true)
                  .addField(`Nº${17+(24*(filas2[0].pagina-1))}`, pokemon[16], true)
                  .addField(`Nº${18+(24*(filas2[0].pagina-1))}`, pokemon[17], true)
                  .addField(`Nº${19+(24*(filas2[0].pagina-1))}`, pokemon[18], true)
                  .addField(`Nº${20+(24*(filas2[0].pagina-1))}`, pokemon[19], true)
                  .addField(`Nº${21+(24*(filas2[0].pagina-1))}`, pokemon[20], true)
                  .addField(`Nº${22+(24*(filas2[0].pagina-1))}`, pokemon[21], true)
                  .addField(`Nº${23+(24*(filas2[0].pagina-1))}`, pokemon[22], true)
                  .addField(`Nº${24+(24*(filas2[0].pagina-1))}`, pokemon[23], true)
                  .setColor(`#FF3737`)
                  .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág ${filas2[0].pagina}/38`)
                let cambio = reaction.message.edit(embed)
              }
            }
          })
        });
      }
    });
    db_listas.all(`SELECT * FROM '${reaction.message.guild.id}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 moviendo pagina de listas`)
      for(var i=0 ; i<10 ; i++){
        if(filas[i]){
          if(filas[i].mensaje === mensaje){
            if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
            if(!reaction.message.member.hasPermission("ADMINISTRATOR") || filas[i].autor!=`${user.id}`) return;
            if(filas[i].pagina >= filas[i].num_paginas) return
            db_listas.run(`UPDATE '${reaction.message.guild.id}' SET pagina = ${filas[i].pagina+1} WHERE titulo = '${filas[i].titulo}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 moviendo pagina de listas`)
              db_listas.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE mensaje = '${filas[i].mensaje}'`, async (err, filas2) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 moviendo pagina de listas`)
                let integrantes = [];
                for(var j=0 ; j<=2000; j++){
                  if(filas2[`user_${j}`]) integrantes.push('<@'+filas2[`user_${j}`]+'>')
                  else integrantes.push(`- - -`)
                  if(integrantes[2000]){
                    let embed = new Discord.MessageEmbed()
                      .setTitle(`:notepad_spiral: __${filas2.titulo}__`)
                      .setDescription(`:busts_in_silhouette: **Participantes:** ${filas2.participantes}\n:hash: **Apúntate:** ${client.config.prefijos[reaction.message.guild.id]}+lista ${i+1}`)
                      .setThumbnail(`https://images.vexels.com/media/users/3/145567/isolated/preview/f3626d1206a21a7efa8e6ed51a7de2db-pergamino-de-navidad-by-vexels.png`)
                      .addField(`${1+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[0+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${2+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[1+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${3+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[2+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${4+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[3+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${5+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[4+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${6+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[5+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${7+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[6+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${8+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[7+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${9+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[8+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${10+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[9+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${11+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[10+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${12+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[11+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${13+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[12+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${14+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[13+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${15+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[14+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${16+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[15+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${17+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[16+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${18+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[17+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${19+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[18+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${20+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[19+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${21+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[20+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${22+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[21+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${23+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[22+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${24+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[23+(24*(filas2.pagina-1))]}`, true)
                      .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág ${filas2.pagina}/${filas[i].num_paginas}`)
                    reaction.message.edit(embed)
                  }
                }
              })
            });
            break;
          }
        }
      }
    });
    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${user.id}'`, async (err, filas) => {
      if(!filas) return;
      if((filas.pagina_estadisticas+1)>4) return;
      if(filas.mensaje_estadisticas===mensaje){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        let embed_2 = new Discord.MessageEmbed()
          .setTitle(`💼 **Inventario de armas** 💼`)
          .setColor("#a66c42")
          .setThumbnail(user.avatarURL())
          .addField(`Puños: `, filas.puños, true)
          .addField(`Vara: `, filas.vara, true)
          .addField(`Arco: `, filas.arco, true)
          .addField(`Dagas: `, filas.dagas, true)
          .addField(`Martillo: `, filas.martillo, true)
          .addField(`Ballesta: `, filas.ballesta, true)
          .addField(`Hacha: `, filas.hacha, true)
          .addField(`Espada: `, filas.espada, true)
          .addField(`Sable: `, filas.sable, true)
          .addField(`Katana: `, filas.katana, true)
          .addField(`Magia: `, filas.magia, true)
          .addField(`Báculo: `, filas.baculo, true)
          .addField(`Poderes Místicos: `, filas.misticos, true)
          .addField(`Poderes Oscuros: `, filas.oscuros, true)
          .setFooter("Todo el inventario de tu personaje", client.user.displayAvatarURL());
        let embed_3 = new Discord.MessageEmbed()
          .setTitle(`:sparkles: **Armas míticas** :sparkles:`)
          .setColor("#81DAF5")
          .setThumbnail(user.avatarURL())
          .addField(`Espada de Excalibur: `, filas.excalibur+` (*${client.config.prefijos[reaction.message.guild.id]}dh.excalibur*)`, true)
          .addField(`Lanza de Ares: `, filas.lanza+` (*${client.config.prefijos[reaction.message.guild.id]}dh.lanza*)`, true)
          .addField(`Tridente de Poseidon: `, filas.tridente+` (*${client.config.prefijos[reaction.message.guild.id]}dh.tridente*)`, true)
          .addField(`Casco de Hades: `, filas.casco+` (*${client.config.prefijos[reaction.message.guild.id]}dh.casco*)`, true)
          .addField(`Rayos de Zeus: `, filas.rayos+` (*${client.config.prefijos[reaction.message.guild.id]}dh.rayos*)`, true)
          .addField(`Guadaña de Cronos: `, filas.guadaña+` (*${client.config.prefijos[reaction.message.guild.id]}dh.guadaña*)`, true)
          .setFooter("La forma de conseguir estas armas es un secreto...", client.user.displayAvatarURL());

        let nombre_armazon;
        let estado_armazon;

        let nombre_prohibidos;
        let estado_prohibidos;

        let nombre_hercules;
        let estado_hercules;

        let nombre_cuartente;
        let estado_cuartente;

        let nombre_cetro;
        let estado_cetro;

        if(filas.armazon===":white_check_mark:"){
          nombre_armazon = `Armazón Legendario:`;
          estado_armazon = `:white_check_mark: (*${client.config.prefijos[reaction.message.guild.id]}dh.armazon*)`;
        }
        else{
          nombre_armazon = `:question::question::question:`;
          estado_armazon = `:question::question::question:`;
        }
        if(filas.prohibidos===":white_check_mark:"){
          nombre_prohibidos = `Poderes Prohibidos:`;
          estado_prohibidos = `:white_check_mark: (*${client.config.prefijos[reaction.message.guild.id]}dh.prohibidos*)`;
        }
        else{
          nombre_prohibidos = `:question::question::question:`;
          estado_prohibidos = `:question::question::question:`;
        }
        if(filas.hercules===":white_check_mark:"){
          nombre_hercules = `Espada de Hércules:`;
          estado_hercules = `:white_check_mark: (*${client.config.prefijos[reaction.message.guild.id]}dh.hercules*)`;
        }
        else{
          nombre_hercules = `:question::question::question:`;
          estado_hercules = `:question::question::question:`;
        }
        if(filas.cuartente===":white_check_mark:"){
          nombre_cuartente = `Cuartente Oscuro:`;
          estado_cuartente = `:white_check_mark: (*${client.config.prefijos[reaction.message.guild.id]}dh.cuartente*)`;
        }
        else{
          nombre_cuartente = `:question::question::question:`;
          estado_cuartente = `:question::question::question:`;
        }
        if(filas.cetro===":white_check_mark:"){
          nombre_cetro = `El Cetro:`;
          estado_cetro = `:white_check_mark: (*${client.config.prefijos[reaction.message.guild.id]}dh.cetro*)`;
        }
        else{
          nombre_cetro = `:question::question::question:`;
          estado_cetro = `:question::question::question:`;
        }

        let embed_4 = new Discord.MessageEmbed()
          .setTitle(`:book: **Mesa de mezclas** :crystal_ball:`)
          .setColor("#81DAF5")
          .setThumbnail(user.avatarURL())
          .setDescription(`${estado_armazon} ${nombre_armazon}\n${estado_prohibidos} ${nombre_prohibidos}\n${estado_hercules} ${nombre_hercules}\n${estado_cuartente} ${nombre_cuartente}\n${estado_cetro} ${nombre_cetro}`)
          .setFooter("Vos mos reperio maxime potens miscet nisi in universum hic...", client.user.displayAvatarURL());

        if(filas.pagina_estadisticas === 1){
          let cambio = reaction.message.edit(embed_2).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_estadisticas = 2 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 viendo estado del usuario`)
            });
          })
        }
        if(filas.pagina_estadisticas === 2){
          let cambio = reaction.message.edit(embed_3).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_estadisticas = 3 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 viendo estado del usuario`)
            });
          })
        }
        if(filas.pagina_estadisticas === 3){
          let cambio = reaction.message.edit(embed_4).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_estadisticas = 4 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #4 viendo estado del usuario`)
            });
          })
        }
      }
    });
    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${user.id}'`, async (err, filas) => {
      if(!filas) return;
      if((filas.pagina_ayuda+1)>4) return;
      if(filas.mensaje_ayuda===mensaje){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        let frase_3;
        let frase_4;
        if(filas.prestigio<3){
          frase_4 = "?????????????????????????????????";
        }
        else{
          frase_4 = client.config.prefijos[reaction.message.guild.id] + 'dh.fantasma  ➢ Derrota a un espectro poderoso\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.conquista ➢ Entra en guerra con un servidor\n';
        }
        if(filas.prestigio<2){
          frase_3 = "?????????????????????????????????";
        }
        else{
          frase_3 = client.config.prefijos[reaction.message.guild.id] + 'dh.baluarte       ➢ Derrota a un Dios\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.auto.baluarte  ➢ Derrota a Dioses automáticamente\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.ascension      ➢ Lucha con todos los Dioses\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.desafio        ➢ Reto de agilidad\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.destino        ➢ Enfréntate a tu destino\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.duelo          ➢ Duelo de 1 vs 1\n';
        }

        let embed_2 = new Discord.MessageEmbed()
          .setTitle(`:ringed_planet: EL UNIVERSO DE DISCORD HUNTER`)
          .setDescription(`__**PRESTIGIO 1**__\n`+
          "```\n"+
          client.config.prefijos[reaction.message.guild.id] + 'dh.explorar      ➢ Haz una exploracion\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.auto.explorar ➢ Explora automaticamente\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.asalto        ➢ Haz un asalto\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.auto.asalto   ➢ Haz asaltos automaticamente\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.supervivencia ➢ Sobrevive a oleadas\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.incursion     ➢ Haz una incursión\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.royale        ➢ Lucha en un Battle Royale\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.batalla       ➢ Lucha contra otro usuario\n' +
          "```")
          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
          .setColor(`#B45F04`)
          .setFooter(`Sección de misiones: Prestigio 1 || Pág 2/4`);

        let embed_3 = new Discord.MessageEmbed()
          .setTitle(`:ringed_planet: EL UNIVERSO DE DISCORD HUNTER`)
          .setDescription(`__**PRESTIGIO 2**__\n`+
          "```\n"+
          `${frase_3}\n`+
          "```")
          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
          .setColor(`#BDBDBD`)
          .setFooter(`Sección de misiones: Prestigio 2 || Pág 3/4`);

        let embed_4 = new Discord.MessageEmbed()
          .setTitle(`:ringed_planet: EL UNIVERSO DE DISCORD HUNTER`)
          .setDescription(`__**PRESTIGIO 3**__\n`+
          "```\n"+
          `${frase_4}\n`+
          "```")
          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
          .setColor(`#F6DC44`)
          .setFooter(`Sección de misiones: Prestigio 3 || Pág 4/4`);

        if(filas.pagina_ayuda === 1){
          let cambio = reaction.message.edit(embed_2).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_ayuda = 2 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 viendo estado del usuario`)
            });
          })
        }
        if(filas.pagina_ayuda === 2){
          let cambio = reaction.message.edit(embed_3).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_ayuda = 3 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 viendo estado del usuario`)
            });
          })
        }
        if(filas.pagina_ayuda === 3){
          let cambio = reaction.message.edit(embed_4).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_ayuda = 4 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #4 viendo estado del usuario`)
            });
          })
        }
      }
    });
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'valentin'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ERROR #1 en funciones automatas de san valentin`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_valentin.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE id = '${user.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ERROR #2 ganando puntos`)
        if(!filas2) return;
        if(filas2.mensaje_ayuda===reaction.message.id){
          if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
          if(filas2.pagina_ayuda===1){
            let embed = new Discord.MessageEmbed()
              .setTitle(`:revolving_hearts: CAJA DE SAN VALENTÍN :revolving_hearts: `)
              .setDescription(`:chocolate_bar: Los ingredientes que tienes son:`)
              .addField(`Chocolate negro:`, filas2.ingrediente_1, true)
              .addField(`Chocolate blanco:`, filas2.ingrediente_2, true)
              .addField(`Frambuesa:`, filas2.ingrediente_3, true)
              .addField(`Mousse:`, filas2.ingrediente_4, true)
              .addField(`Virutas:`, filas2.ingrediente_5, true)
              .addField(`Naranja:`, filas2.ingrediente_6, true)
              .addField(`Chile:`, filas2.ingrediente_7, true)
              .setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837043261145139/caja.png`)
              .setColor("#F576E4")
              .setFooter(`Podrás ver tus estadisticas en la siguiente página || Pág 2/3`)
            reaction.message.edit(embed)
            db_valentin.run(`UPDATE '${reaction.message.guild.id}' SET pagina_ayuda = 2 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ERROR #1 mostrando estadisticas de san valentin pagina 2 en avance`)
            })
          }
          else if(filas2.pagina_ayuda===2){
            let embed = new Discord.MessageEmbed()
              .setTitle(`:revolving_hearts: CAJA DE SAN VALENTÍN :revolving_hearts: `)
              .setDescription(`:lollipop: Tus estadísticas son las siguientes:`)
              .addField(`Puntos:`, filas2.regalos, true)
              .addField(`Bombones regalados:`, filas2.num_regalos, true)
              .addField(`Bombones recibidos:`, filas2.num_bombones, true)
              .setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837043261145139/caja.png`)
              .setColor("#F576E4")
              .setFooter(`¡Regala bombones y demuestra tu amor por la comunidad! || Pág 3/3`)
            reaction.message.edit(embed)
            db_valentin.run(`UPDATE '${reaction.message.guild.id}' SET pagina_ayuda = 3 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ERROR #1 mostrando estadisticas de san valentin pagina 3 en avance`)
            })
          }
          else return;
        }
      })
    })
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'pascua'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ERROR #1 en funciones automatas de san valentin`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_pascua.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE id = '${user.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ERROR #2 ganando puntos`)
        if(!filas2) return;
        if(filas2.mensaje_ayuda===reaction.message.id && (filas2.huevo_10>0 || filas2.huevo_11>0 || filas2.huevo_12>0 || filas2.huevo_13>0 || filas2.huevo_14>0 || filas2.huevo_15>0)){
          if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
          let huevo_1, huevo_2, huevo_3, huevo_4, huevo_5, huevo_6, huevo_7, huevo_8, huevo_9, huevo_10, huevo_11, huevo_12, huevo_13, huevo_14, huevo_15, puntos;
          if(!filas2) huevo_1=0, huevo_2=0, huevo_3=0, huevo_4=0, huevo_5=0, huevo_6=0, huevo_7=0, huevo_8=0, huevo_9=0, huevo_10=0, huevo_11=0, huevo_12=0, huevo_13=0, huevo_14=0, huevo_15=0, puntos=0;
          else huevo_1=filas2.huevo_1, huevo_2=filas2.huevo_2, huevo_3=filas2.huevo_3, huevo_4=filas2.huevo_4, huevo_5=filas2.huevo_5, huevo_6=filas2.huevo_6, huevo_7=filas2.huevo_7, huevo_8=filas2.huevo_8, huevo_9=filas2.huevo_9, huevo_10=filas2.huevo_10, huevo_11=filas2.huevo_11, huevo_12=filas2.huevo_12, huevo_13=filas2.huevo_13, huevo_14=filas2.huevo_14, huevo_15=filas2.huevo_15, puntos=filas2.puntos;
          let embed = new Discord.MessageEmbed()
          if(filas2.pagina_ayuda===1){
            let embed = new Discord.MessageEmbed()
              .setTitle(`:gem: CESTA DE PASCUA`)
              .setDescription(`**Puntos conseguidos:** ${puntos}`)
              .setThumbnail(`https://cdn.discordapp.com/attachments/823263020246761523/825853099289608192/Icono2.jpg`)
              .addField(`Huevo Cocido: `, huevo_10, true)
              .addField(`Gema: `, huevo_11, true)
              .addField(`Huevo Sorpresa: `, huevo_12, true)
              .addField(`Tamagotchi: `, huevo_13, true)
              .addField(`Fabergé: `, huevo_14, true)
              .addField(`Furia Nocturna: `, huevo_15, true)
              .setColor(`#81F7F3`)
              .setFooter(`Cuando consigas un huevo Especial de cada, obtendrás +1 punto por cada huevo que cojas`)
              .setImage(`https://cdn.discordapp.com/attachments/823263020246761523/825189280032751626/banner.png`)
              .setTimestamp();
            reaction.message.edit(embed)
            db_pascua.run(`UPDATE '${reaction.message.guild.id}' SET pagina_ayuda = 2 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ERROR #1 mostrando estadisticas de pascua pagina 2 en avance`)
            })
          }
          else return;
        }
      })
    })
  }
  if(emojiName==="⏪"){
    db_pokemon.all(`SELECT * FROM '${user.id}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 moviendo pagina de pokedex`)
      if(filas[0] && filas[0].mensaje === mensaje){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        if(pause_pokedex.has(user.id)) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 3 segundos** ⛔`).setColor(`#FF3737`)).then(m => m.delete({ timeout: 3000}))
        pause_pokedex.add(user.id);
    		setTimeout(() => {pause_pokedex.delete(user.id);}, 3000);
        if(filas[0].pagina <= 1) return
        db_pokemon.run(`UPDATE '${user.id}' SET pagina = ${filas[0].pagina-1}`, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 mostrando pokedex`)
          db_pokemon.all(`SELECT * FROM '${user.id}'`, async (err, filas2) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 moviendo pagina de pokedex`)
            let pokemon = [];
            for(var i=1+(24*(filas2[0].pagina-1)) ; i<25+(24*(filas2[0].pagina-1)) ; i++){
              for(var j=0 ; j<filas.length ; j++){
                if(filas[j].numero === i){
                  pokemon.push(`:white_check_mark: ` + filas[j].pokemon)
                  break;
                }
                if(j===filas.length-1){
                  pokemon.push(`:x: - - -`)
                }
              }
              if(pokemon[23]){
                let embed = new Discord.MessageEmbed()
                  .setTitle(`:red_circle: TU POKEDEX (${filas.length}/${pokemon_lleno.length}) :yellow_circle:`)
                  .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/780106754141978644/Pokedex_Gif_Transparente.gif`)
                    .addField(`Nº${1+(24*(filas2[0].pagina-1))}`, pokemon[0], true)
                    .addField(`Nº${2+(24*(filas2[0].pagina-1))}`, pokemon[1], true)
                    .addField(`Nº${3+(24*(filas2[0].pagina-1))}`, pokemon[2], true)
                    .addField(`Nº${4+(24*(filas2[0].pagina-1))}`, pokemon[3], true)
                    .addField(`Nº${5+(24*(filas2[0].pagina-1))}`, pokemon[4], true)
                    .addField(`Nº${6+(24*(filas2[0].pagina-1))}`, pokemon[5], true)
                    .addField(`Nº${7+(24*(filas2[0].pagina-1))}`, pokemon[6], true)
                    .addField(`Nº${8+(24*(filas2[0].pagina-1))}`, pokemon[7], true)
                    .addField(`Nº${9+(24*(filas2[0].pagina-1))}`, pokemon[8], true)
                    .addField(`Nº${10+(24*(filas2[0].pagina-1))}`, pokemon[9], true)
                    .addField(`Nº${11+(24*(filas2[0].pagina-1))}`, pokemon[10], true)
                    .addField(`Nº${12+(24*(filas2[0].pagina-1))}`, pokemon[11], true)
                    .addField(`Nº${13+(24*(filas2[0].pagina-1))}`, pokemon[12], true)
                    .addField(`Nº${14+(24*(filas2[0].pagina-1))}`, pokemon[13], true)
                    .addField(`Nº${15+(24*(filas2[0].pagina-1))}`, pokemon[14], true)
                    .addField(`Nº${16+(24*(filas2[0].pagina-1))}`, pokemon[15], true)
                    .addField(`Nº${17+(24*(filas2[0].pagina-1))}`, pokemon[16], true)
                    .addField(`Nº${18+(24*(filas2[0].pagina-1))}`, pokemon[17], true)
                    .addField(`Nº${19+(24*(filas2[0].pagina-1))}`, pokemon[18], true)
                    .addField(`Nº${20+(24*(filas2[0].pagina-1))}`, pokemon[19], true)
                    .addField(`Nº${21+(24*(filas2[0].pagina-1))}`, pokemon[20], true)
                    .addField(`Nº${22+(24*(filas2[0].pagina-1))}`, pokemon[21], true)
                    .addField(`Nº${23+(24*(filas2[0].pagina-1))}`, pokemon[22], true)
                    .addField(`Nº${24+(24*(filas2[0].pagina-1))}`, pokemon[23], true)
                    .setColor(`#FF3737`)
                    .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág ${filas2[0].pagina}/38`)
                let cambio = reaction.message.edit(embed)
              }
            }
          })
        });
      }
    });
    db_listas.all(`SELECT * FROM '${reaction.message.guild.id}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 moviendo pagina de listas`)
      for(var i=0 ; i<10 ; i++){
        if(filas[i]){
          if(filas[i].mensaje === mensaje){
            if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
            if(!reaction.message.member.hasPermission("ADMINISTRATOR") || filas[i].autor!=`${user.id}`) return;
            if(filas[i].pagina <= 1) return
            db_listas.run(`UPDATE '${reaction.message.guild.id}' SET pagina = ${filas[i].pagina-1} WHERE titulo = '${filas[i].titulo}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 moviendo pagina de listas`)
              db_listas.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE mensaje = '${filas[i].mensaje}'`, async (err, filas2) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 moviendo pagina de listas`)
                let integrantes = [];
                for(var j=0 ; j<=2000; j++){
                  if(filas2[`user_${j}`]) integrantes.push('<@'+filas2[`user_${j}`]+'>')
                  else integrantes.push(`- - -`)
                  if(integrantes[2000]){
                    let embed = new Discord.MessageEmbed()
                      .setTitle(`:notepad_spiral: __${filas2.titulo}__`)
                      .setDescription(`:busts_in_silhouette: **Participantes:** ${filas2.participantes}\n:hash: **Apúntate:** ${client.config.prefijos[reaction.message.guild.id]}+lista ${i+1}`)
                      .setThumbnail(`https://images.vexels.com/media/users/3/145567/isolated/preview/f3626d1206a21a7efa8e6ed51a7de2db-pergamino-de-navidad-by-vexels.png`)
                      .addField(`${1+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[0+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${2+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[1+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${3+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[2+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${4+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[3+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${5+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[4+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${6+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[5+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${7+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[6+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${8+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[7+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${9+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[8+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${10+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[9+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${11+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[10+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${12+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[11+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${13+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[12+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${14+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[13+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${15+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[14+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${16+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[15+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${17+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[16+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${18+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[17+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${19+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[18+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${20+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[19+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${21+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[20+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${22+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[21+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${23+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[22+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${24+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[23+(24*(filas2.pagina-1))]}`, true)
                      .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág ${filas2.pagina}/${filas[i].num_paginas}`)
                    reaction.message.edit(embed)
                  }
                }
              })
            });
            break;
          }
        }
      }
    });
    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${user.id}'`, async (err, filas) => {
      if(!filas) return;
      if((filas.pagina_estadisticas-1)<1) return;
      if(filas.mensaje_estadisticas===mensaje){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        let nivel_mostrar = filas.nivel;
        if(filas.prestigio === 2) nivel_mostrar = nivel_mostrar-49999;
        else if(filas.prestigio === 3) nivel_mostrar = nivel_mostrar-149999;
        let vidanormal = 100+((filas.nivel-1)*2);
        let limitexp = 100+(20*(filas.nivel-1));
        let embed_1 = new Discord.MessageEmbed()
          .setTitle(`:newspaper2: **Estadisticas del personaje** :newspaper2:`)
          .setColor("#6e5496")
          .setThumbnail(user.avatarURL())
          .addField("Jugador: ", `<@${user.id}>`, true)
          .addField("Nivel: ", nivel_mostrar, true)
          .addField("Prestigio: ", filas.prestigio, true)
          .addField("XP: ", `${filas.xp.toFixed(2)}/${limitexp}`, true)
          .addField("Vida: ", `${filas.vida.toFixed(2)}/${vidanormal}`, true)
          .addField("Escudo: ", `${filas.escudo}`, true)
          .addField("Arma: ", nombres_armas_dh[filas.arma-1], true)
          .addField("Coins: ", filas.coins.toFixed(2), true)
          .addField("**----------------------------------**", "---------------------------------")
          .addField("Trofeo de incursion: ", filas.logro_incursion, true)
          .addField("Trofeo de incursion heroica: ", filas.logro_incursion_heroica, true)
          .addField("Trofeo de ascension: ", filas.logro_ascension, true)
          .addField("Trofeo de desafio: ", filas.logro_desafio, true)
          .setFooter("Un resumen de las estadisticas de tu personaje", client.user.displayAvatarURL());
        let embed_2 = new Discord.MessageEmbed()
          .setTitle(`💼 **Inventario de armas** 💼`)
          .setColor("#a66c42")
          .setThumbnail(user.avatarURL())
          .addField(`Puños: `, filas.puños, true)
          .addField(`Vara: `, filas.vara, true)
          .addField(`Arco: `, filas.arco, true)
          .addField(`Dagas: `, filas.dagas, true)
          .addField(`Martillo: `, filas.martillo, true)
          .addField(`Ballesta: `, filas.ballesta, true)
          .addField(`Hacha: `, filas.hacha, true)
          .addField(`Espada: `, filas.espada, true)
          .addField(`Sable: `, filas.sable, true)
          .addField(`Katana: `, filas.katana, true)
          .addField(`Magia: `, filas.magia, true)
          .addField(`Báculo: `, filas.baculo, true)
          .addField(`Poderes Místicos: `, filas.misticos, true)
          .addField(`Poderes Oscuros: `, filas.oscuros, true)
          .setFooter("Todo el inventario de tu personaje", client.user.displayAvatarURL());
        let embed_3 = new Discord.MessageEmbed()
          .setTitle(`:sparkles: **Armas míticas** :sparkles:`)
          .setColor("#81DAF5")
          .setThumbnail(user.avatarURL())
          .addField(`Espada de Excalibur: `, filas.excalibur+` (*${client.config.prefijos[reaction.message.guild.id]}dh.excalibur*)`, true)
          .addField(`Lanza de Ares: `, filas.lanza+` (*${client.config.prefijos[reaction.message.guild.id]}dh.lanza*)`, true)
          .addField(`Tridente de Poseidon: `, filas.tridente+` (*${client.config.prefijos[reaction.message.guild.id]}dh.tridente*)`, true)
          .addField(`Casco de Hades: `, filas.casco+` (*${client.config.prefijos[reaction.message.guild.id]}dh.casco*)`, true)
          .addField(`Rayos de Zeus: `, filas.rayos+` (*${client.config.prefijos[reaction.message.guild.id]}dh.rayos*)`, true)
          .addField(`Guadaña de Cronos: `, filas.guadaña+` (*${client.config.prefijos[reaction.message.guild.id]}dh.guadaña*)`, true)
          .setFooter("La forma de conseguir estas armas es un secreto...", client.user.displayAvatarURL());

        if(filas.pagina_estadisticas === 2){
          let cambio = reaction.message.edit(embed_1).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_estadisticas = 1 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 viendo estado del usuario`)
            });
          })
        }
        if(filas.pagina_estadisticas === 3){
          let cambio = reaction.message.edit(embed_2).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_estadisticas = 2 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 viendo estado del usuario`)
            });
          })
        }
        if(filas.pagina_estadisticas === 4){
          let cambio = reaction.message.edit(embed_3).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_estadisticas = 3 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #4 viendo estado del usuario`)
            });
          })
        }
      }
    });
    db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${user.id}'`, async (err, filas) => {
      if(!filas) return;
      if((filas.pagina_ayuda-1)<1) return;
      if(filas.mensaje_ayuda===mensaje){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        let frase_3;
        let frase_4;
        if(filas.prestigio<3){
          frase_4 = "?????????????????????????????????";
        }
        else{
          frase_4 = client.config.prefijos[reaction.message.guild.id] + 'dh.fantasma  ➢ Derrota a un espectro poderoso\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.conquista ➢ Entra en guerra con un servidor\n';
        }
        if(filas.prestigio<2){
          frase_3 = "?????????????????????????????????";
        }
        else{
          frase_3 = client.config.prefijos[reaction.message.guild.id] + 'dh.baluarte       ➢ Derrota a un Dios\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.auto.baluarte  ➢ Derrota a Dioses automáticamente\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.ascension      ➢ Lucha con todos los Dioses\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.desafio        ➢ Reto de agilidad\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.destino        ➢ Enfréntate a tu destino\n' +
                    client.config.prefijos[reaction.message.guild.id] + 'dh.duelo          ➢ Duelo de 1 vs 1\n';
        }

        let embed_1 = new Discord.MessageEmbed()
          .setTitle(`:ringed_planet: EL UNIVERSO DE DISCORD HUNTER`)
          .setDescription('Adéntrate en este mundo con fantásticos seres y peligrosas amenazas...\n\n' +
          '__**INFORMACIÓN**__\n' +
          '```\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.crear      ➢ Crea un personaje\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.reset      ➢ Reinicia tu personaje\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.borrar     ➢ Borra tu personaje\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.estado     ➢ Consulta tu estado\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.jugadores  ➢ ¿Cuántas personas juegan?\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.top        ➢ Top 10 de jugadores\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.rol        ➢ Reclama tus roles\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.ranking    ➢ Top 10 de Supervivencia\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.tienda     ➢ Visita la tienda\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.armero     ➢ Visita al armero\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.mezclar    ➢ Usa la Mesa de Mezclas\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.auto.info  ➢ Informacion de tu farmeo\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.auto.parar ➢ Parar farmeo automático\n' +
          '```\n'+
          `Obtendreis doble de experiencia si jugais en el servidor soporte.\nInvitacion: **${client.config.prefijos[reaction.message.guild.id]}bot**`)
          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
          .setColor(`#9262FF`)
          .setFooter(`Sección de comandos: Información || Pág 1/4`);


        let embed_2 = new Discord.MessageEmbed()
          .setTitle(`:ringed_planet: EL UNIVERSO DE DISCORD HUNTER`)
          .setDescription(`__**PRESTIGIO 1**__\n`+
          "```\n"+
          client.config.prefijos[reaction.message.guild.id] + 'dh.explorar      ➢ Haz una exploracion\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.auto.explorar ➢ Explora automaticamente\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.asalto        ➢ Haz un asalto\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.auto.asalto   ➢ Haz asaltos automaticamente\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.supervivencia ➢ Sobrevive a oleadas\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.incursion     ➢ Haz una incursión\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.royale        ➢ Lucha en un Battle Royale\n' +
          client.config.prefijos[reaction.message.guild.id] + 'dh.batalla       ➢ Lucha contra otro usuario\n' +
          "```")
          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
          .setColor(`#B45F04`)
          .setFooter(`Sección de misiones: Prestigio 1 || Pág 2/4`);


        let embed_3 = new Discord.MessageEmbed()
          .setTitle(`:ringed_planet: EL UNIVERSO DE DISCORD HUNTER`)
          .setDescription(`__**PRESTIGIO 2**__\n`+
          "```\n"+
          `${frase_3}\n`+
          "```")
          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
          .setColor(`#BDBDBD`)
          .setFooter(`Sección de misiones: Prestigio 2 || Pág 3/4`);

        let embed_4 = new Discord.MessageEmbed()
          .setTitle(`:ringed_planet: EL UNIVERSO DE DISCORD HUNTER`)
          .setDescription(`__**PRESTIGIO 3**__\n`+
          "```\n"+
          `${frase_4}\n`+
          "```")
          .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/684702708304969744/logo_bueno_bueno_dh.png`)
          .setColor(`#F6DC44`)
          .setFooter(`Sección de misiones: Prestigio 3 || Pág 4/4`);


        if(filas.pagina_ayuda === 2){
          let cambio = reaction.message.edit(embed_1).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_ayuda = 1 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 viendo estado del usuario`)
            });
          })
        }
        if(filas.pagina_ayuda === 3){
          let cambio = reaction.message.edit(embed_2).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_ayuda = 2 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #3 viendo estado del usuario`)
            });
          })
        }
        if(filas.pagina_ayuda === 4){
          let cambio = reaction.message.edit(embed_3).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_ayuda = 3 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #4 viendo estado del usuario`)
            });
          })
        }
        if(filas.pagina_ayuda === 5){
          let cambio = reaction.message.edit(embed_4).then(m => {
            db_discordhunter.run(`UPDATE usuarios SET pagina_ayuda = 4 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #4 viendo estado del usuario`)
            });
          })
        }
      }
    });
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'valentin'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ERROR #1 en funciones automatas de san valentin`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_valentin.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE id = '${user.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ERROR #2 ganando puntos`)
        if(!filas2) return;
        if(filas2.mensaje_ayuda===reaction.message.id){
          if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
          if(filas2.pagina_ayuda===3){
            let embed = new Discord.MessageEmbed()
              .setTitle(`:revolving_hearts: CAJA DE SAN VALENTÍN :revolving_hearts: `)
              .setDescription(`:chocolate_bar: Los ingredientes que tienes son:`)
              .addField(`Chocolate negro:`, filas2.ingrediente_1, true)
              .addField(`Chocolate blanco:`, filas2.ingrediente_2, true)
              .addField(`Frambuesa:`, filas2.ingrediente_3, true)
              .addField(`Mousse:`, filas2.ingrediente_4, true)
              .addField(`Virutas:`, filas2.ingrediente_5, true)
              .addField(`Naranja:`, filas2.ingrediente_6, true)
              .addField(`Chile:`, filas2.ingrediente_7, true)
              .setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837043261145139/caja.png`)
              .setColor("#F576E4")
              .setFooter(`Podrás ver tus estadisticas en la siguiente página || Pág 2/3`)
            reaction.message.edit(embed)
            db_valentin.run(`UPDATE '${reaction.message.guild.id}' SET pagina_ayuda = 2 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ERROR #1 mostrando estadisticas de san valentin pagina 2 en atraso`)
            })
          }
          else if(filas2.pagina_ayuda===2){
            let bombon_1 = 0;
            let bombon_2 = 0;
            let bombon_3 = 0;
            let bombon_4 = 0;
            let bombon_5 = 0;

            let negro = filas2.ingrediente_1;
            let blanco = filas2.ingrediente_2;
            let frambuesa = filas2.ingrediente_3;
            let mousse = filas2.ingrediente_4;
            let virutas = filas2.ingrediente_5;
            let naranja = filas2.ingrediente_6;
            let chile = filas2.ingrediente_7;

            while(negro>0){
              bombon_1++;
              negro=negro-1
            }

            negro = filas2.ingrediente_1;
            blanco = filas2.ingrediente_2;
            frambuesa = filas2.ingrediente_3;
            mousse = filas2.ingrediente_4;
            virutas = filas2.ingrediente_5;
            naranja = filas2.ingrediente_6;
            chile = filas2.ingrediente_7;

            while(negro>0 && blanco>0){
              bombon_2++;
              negro=negro-1;
              blanco=blanco-1;
            }

            negro = filas2.ingrediente_1;
            blanco = filas2.ingrediente_2;
            frambuesa = filas2.ingrediente_3;
            mousse = filas2.ingrediente_4;
            virutas = filas2.ingrediente_5;
            naranja = filas2.ingrediente_6;
            chile = filas2.ingrediente_7;

            while(frambuesa>0 && blanco>0){
              bombon_3++;
              frambuesa=frambuesa-1;
              blanco=blanco-1;
            }

            negro = filas2.ingrediente_1;
            blanco = filas2.ingrediente_2;
            frambuesa = filas2.ingrediente_3;
            mousse = filas2.ingrediente_4;
            virutas = filas2.ingrediente_5;
            naranja = filas2.ingrediente_6;
            chile = filas2.ingrediente_7;

            while(mousse>0 && virutas>0 && naranja>0){
              bombon_4++;
              mousse=mousse-1;
              virutas=virutas-1;
              naranja=naranja-1;
            }

            negro = filas2.ingrediente_1;
            blanco = filas2.ingrediente_2;
            frambuesa = filas2.ingrediente_3;
            mousse = filas2.ingrediente_4;
            virutas = filas2.ingrediente_5;
            naranja = filas2.ingrediente_6;
            chile = filas2.ingrediente_7;

            while(mousse>0 && virutas>0 && chile>0){
              bombon_5++;
              mousse=mousse-1;
              virutas=virutas-1;
              chile=chile-1;
            }

            let embed = new Discord.MessageEmbed()
              .setTitle(`:revolving_hearts: CAJA DE SAN VALENTÍN :revolving_hearts: `)
              .setDescription(`:cake: Los bombones que puedes cocinar son:`)
              .addField(`1. Bombón de chocolate:`, bombon_1, true)
              .addField(`2. Bombón blanco y negro:`, bombon_2, true)
              .addField(`3. Bombón de frambuesa:`, bombon_3, true)
              .addField(`4. Trufa de naranja:`, bombon_4, true)
              .addField(`\u200b`, `\u200b`, true)
              .addField(`5. Trufa picante:`, bombon_5, true)
              .setImage(`https://cdn.discordapp.com/attachments/523268901719769088/808837043261145139/caja.png`)
              .setColor("#F576E4")
              .setFooter(`Podrás ver los ingredientes que tienes en la siguiente página || Pág 1/3`)
            reaction.message.edit(embed)
            db_valentin.run(`UPDATE '${reaction.message.guild.id}' SET pagina_ayuda = 1 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ERROR #1 mostrando estadisticas de san valentin pagina 1 en atraso`)
            })
          }
          else return;
        }
      })
    })
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'pascua'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ERROR #1 en funciones automatas de san valentin`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_pascua.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE id = '${user.id}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ERROR #2 ganando puntos`)
        if(!filas2) return;
        if(filas2.mensaje_ayuda===reaction.message.id){
          if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
          let huevo_1, huevo_2, huevo_3, huevo_4, huevo_5, huevo_6, huevo_7, huevo_8, huevo_9, huevo_10, huevo_11, huevo_12, huevo_13, huevo_14, huevo_15, puntos;
          if(!filas2) huevo_1=0, huevo_2=0, huevo_3=0, huevo_4=0, huevo_5=0, huevo_6=0, huevo_7=0, huevo_8=0, huevo_9=0, huevo_10=0, huevo_11=0, huevo_12=0, huevo_13=0, huevo_14=0, huevo_15=0, puntos=0;
          else huevo_1=filas2.huevo_1, huevo_2=filas2.huevo_2, huevo_3=filas2.huevo_3, huevo_4=filas2.huevo_4, huevo_5=filas2.huevo_5, huevo_6=filas2.huevo_6, huevo_7=filas2.huevo_7, huevo_8=filas2.huevo_8, huevo_9=filas2.huevo_9, huevo_10=filas2.huevo_10, huevo_11=filas2.huevo_11, huevo_12=filas2.huevo_12, huevo_13=filas2.huevo_13, huevo_14=filas2.huevo_14, huevo_15=filas2.huevo_15, puntos=filas2.puntos;
          let embed = new Discord.MessageEmbed()
          if(filas2.pagina_ayuda===2){
            let embed = new Discord.MessageEmbed()
              .setTitle(`🧺 CESTA DE PASCUA`)
              .setDescription(`**Puntos conseguidos:** ${puntos}`)
              .setThumbnail(`https://cdn.discordapp.com/attachments/823263020246761523/825853099289608192/Icono2.jpg`)
              .addField(`Zigzag: `, huevo_1, true)
              .addField(`Puzzle: `, huevo_2, true)
              .addField(`Nublado: `, huevo_3, true)
              .addField(`Oleaje: `, huevo_4, true)
              .addField(`Manchitas: `, huevo_5, true)
              .addField(`Lava: `, huevo_6, true)
              .addField(`Confetti: `, huevo_7, true)
              .addField(`Cintas: `, huevo_8, true)
              .addField(`Fresón: `, huevo_9, true)
              .setColor(`#81F7F3`)
              .setImage(`https://cdn.discordapp.com/attachments/823263020246761523/825189280032751626/banner.png`)
              .setTimestamp();
            reaction.message.edit(embed)
            db_pascua.run(`UPDATE '${reaction.message.guild.id}' SET pagina_ayuda = 1 WHERE id = '${user.id}'`, async function(err) {
              if(err) return console.log(err.message + ` ERROR #1 mostrando estadisticas de pascua pagina 1 en atraso`)
            })
          }
          else return;
        }
      })
    })
  }
  if(emojiName==="⏭️"){
    db_pokemon.all(`SELECT * FROM '${user.id}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 moviendo pagina de pokedex`)
      if(filas[0] && filas[0].mensaje === mensaje){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        if(pause_pokedex.has(user.id)) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 3 segundos** ⛔`).setColor(`#FF3737`)).then(m => m.delete({ timeout: 3000}))
        pause_pokedex.add(user.id);
    		setTimeout(() => {pause_pokedex.delete(user.id);}, 3000);
        let avance;
        if((filas[0].pagina >= 38) || (filas[0].pagina+5 > 38)) return;
        db_pokemon.run(`UPDATE '${user.id}' SET pagina = ${filas[0].pagina+5}`, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 mostrando pokedex`)
          db_pokemon.all(`SELECT * FROM '${user.id}'`, async (err, filas2) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 moviendo pagina de pokedex`)
            let pokemon = [];
            for(var i=1+(24*(filas2[0].pagina-1)) ; i<25+(24*(filas2[0].pagina-1)) ; i++){
              for(var j=0 ; j<filas.length ; j++){
                if(filas[j].numero === i){
                  pokemon.push(`:white_check_mark: ` + filas[j].pokemon)
                  break;
                }
                if(j===filas.length-1){
                  pokemon.push(`:x: - - -`)
                }
              }
              if(pokemon[23]){
                let embed = new Discord.MessageEmbed()
                  .setTitle(`:red_circle: TU POKEDEX (${filas.length}/${pokemon_lleno.length}) :yellow_circle:`)
                  .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/780106754141978644/Pokedex_Gif_Transparente.gif`)
                  .addField(`Nº${1+(24*(filas2[0].pagina-1))}`, pokemon[0], true)
                  .addField(`Nº${2+(24*(filas2[0].pagina-1))}`, pokemon[1], true)
                  .addField(`Nº${3+(24*(filas2[0].pagina-1))}`, pokemon[2], true)
                  .addField(`Nº${4+(24*(filas2[0].pagina-1))}`, pokemon[3], true)
                  .addField(`Nº${5+(24*(filas2[0].pagina-1))}`, pokemon[4], true)
                  .addField(`Nº${6+(24*(filas2[0].pagina-1))}`, pokemon[5], true)
                  .addField(`Nº${7+(24*(filas2[0].pagina-1))}`, pokemon[6], true)
                  .addField(`Nº${8+(24*(filas2[0].pagina-1))}`, pokemon[7], true)
                  .addField(`Nº${9+(24*(filas2[0].pagina-1))}`, pokemon[8], true)
                  .addField(`Nº${10+(24*(filas2[0].pagina-1))}`, pokemon[9], true)
                  .addField(`Nº${11+(24*(filas2[0].pagina-1))}`, pokemon[10], true)
                  .addField(`Nº${12+(24*(filas2[0].pagina-1))}`, pokemon[11], true)
                  .addField(`Nº${13+(24*(filas2[0].pagina-1))}`, pokemon[12], true)
                  .addField(`Nº${14+(24*(filas2[0].pagina-1))}`, pokemon[13], true)
                  .addField(`Nº${15+(24*(filas2[0].pagina-1))}`, pokemon[14], true)
                  .addField(`Nº${16+(24*(filas2[0].pagina-1))}`, pokemon[15], true)
                  .addField(`Nº${17+(24*(filas2[0].pagina-1))}`, pokemon[16], true)
                  .addField(`Nº${18+(24*(filas2[0].pagina-1))}`, pokemon[17], true)
                  .addField(`Nº${19+(24*(filas2[0].pagina-1))}`, pokemon[18], true)
                  .addField(`Nº${20+(24*(filas2[0].pagina-1))}`, pokemon[19], true)
                  .addField(`Nº${21+(24*(filas2[0].pagina-1))}`, pokemon[20], true)
                  .addField(`Nº${22+(24*(filas2[0].pagina-1))}`, pokemon[21], true)
                  .addField(`Nº${23+(24*(filas2[0].pagina-1))}`, pokemon[22], true)
                  .addField(`Nº${24+(24*(filas2[0].pagina-1))}`, pokemon[23], true)
                  .setColor(`#FF3737`)
                  .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág ${filas2[0].pagina}/38`)
                let cambio = reaction.message.edit(embed)
              }
            }
          })
        });
      }
    });
    db_listas.all(`SELECT * FROM '${reaction.message.guild.id}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 moviendo pagina de listas`)
      for(var i=0 ; i<10 ; i++){
        if(filas[i]){
          if(filas[i].mensaje === mensaje){
            if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
            if(!reaction.message.member.hasPermission("ADMINISTRATOR") || filas[i].autor!=`${user.id}`) return;
            if(filas[i].pagina >= filas[i].num_paginas) return
            db_listas.run(`UPDATE '${reaction.message.guild.id}' SET pagina = ${filas[i].pagina+1} WHERE titulo = '${filas[i].titulo}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 moviendo pagina de listas`)
              db_listas.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE mensaje = '${filas[i].mensaje}'`, async (err, filas2) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 moviendo pagina de listas`)
                let integrantes = [];
                for(var j=0 ; j<=2000; j++){
                  if(filas2[`user_${j}`]) integrantes.push('<@'+filas2[`user_${j}`]+'>')
                  else integrantes.push(`- - -`)
                  if(integrantes[2000]){
                    let embed = new Discord.MessageEmbed()
                      .setTitle(`:notepad_spiral: __${filas2.titulo}__`)
                      .setDescription(`:busts_in_silhouette: **Participantes:** ${filas2.participantes}\n:hash: **Apúntate:** ${client.config.prefijos[reaction.message.guild.id]}+lista ${i+1}`)
                      .setThumbnail(`https://images.vexels.com/media/users/3/145567/isolated/preview/f3626d1206a21a7efa8e6ed51a7de2db-pergamino-de-navidad-by-vexels.png`)
                      .addField(`${1+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[0+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${2+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[1+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${3+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[2+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${4+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[3+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${5+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[4+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${6+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[5+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${7+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[6+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${8+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[7+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${9+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[8+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${10+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[9+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${11+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[10+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${12+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[11+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${13+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[12+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${14+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[13+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${15+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[14+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${16+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[15+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${17+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[16+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${18+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[17+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${19+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[18+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${20+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[19+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${21+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[20+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${22+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[21+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${23+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[22+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${24+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[23+(24*(filas2.pagina-1))]}`, true)
                      .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág ${filas2.pagina}/${filas[i].num_paginas}`)
                    reaction.message.edit(embed)
                  }
                }
              })
            });
            break;
          }
        }
      }
    });
  }
  if(emojiName==="⏮️"){
    db_pokemon.all(`SELECT * FROM '${user.id}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 moviendo pagina de pokedex`)
      if(filas[0] && filas[0].mensaje === mensaje){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        if(pause_pokedex.has(user.id)) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 3 segundos** ⛔`).setColor(`#FF3737`)).then(m => m.delete({ timeout: 3000}))
        pause_pokedex.add(user.id);
    		setTimeout(() => {pause_pokedex.delete(user.id);}, 3000);
        if((filas[0].pagina <= 1) || (filas[0].pagina-5 < 1)) return;
        db_pokemon.run(`UPDATE '${user.id}' SET pagina = ${filas[0].pagina-5}`, async function(err) {
          if(err) return console.log(err.message + ` ${message.content} ERROR #2 mostrando pokedex`)
          db_pokemon.all(`SELECT * FROM '${user.id}'`, async (err, filas2) => {
            if(err) return console.log(err.message + ` ${message.content} ERROR #3 moviendo pagina de pokedex`)
            let pokemon = [];
            for(var i=1+(24*(filas2[0].pagina-1)) ; i<25+(24*(filas2[0].pagina-1)) ; i++){
              for(var j=0 ; j<filas.length ; j++){
                if(filas[j].numero === i){
                  pokemon.push(`:white_check_mark: ` + filas[j].pokemon)
                  break;
                }
                if(j===filas.length-1){
                  pokemon.push(`:x: - - -`)
                }
              }
              if(pokemon[23]){
                let embed = new Discord.MessageEmbed()
                  .setTitle(`:red_circle: TU POKEDEX (${filas.length}/${pokemon_lleno.length}) :yellow_circle:`)
                  .setThumbnail(`https://cdn.discordapp.com/attachments/523268901719769088/780106754141978644/Pokedex_Gif_Transparente.gif`)
                  .addField(`Nº${1+(24*(filas2[0].pagina-1))}`, pokemon[0], true)
                  .addField(`Nº${2+(24*(filas2[0].pagina-1))}`, pokemon[1], true)
                  .addField(`Nº${3+(24*(filas2[0].pagina-1))}`, pokemon[2], true)
                  .addField(`Nº${4+(24*(filas2[0].pagina-1))}`, pokemon[3], true)
                  .addField(`Nº${5+(24*(filas2[0].pagina-1))}`, pokemon[4], true)
                  .addField(`Nº${6+(24*(filas2[0].pagina-1))}`, pokemon[5], true)
                  .addField(`Nº${7+(24*(filas2[0].pagina-1))}`, pokemon[6], true)
                  .addField(`Nº${8+(24*(filas2[0].pagina-1))}`, pokemon[7], true)
                  .addField(`Nº${9+(24*(filas2[0].pagina-1))}`, pokemon[8], true)
                  .addField(`Nº${10+(24*(filas2[0].pagina-1))}`, pokemon[9], true)
                  .addField(`Nº${11+(24*(filas2[0].pagina-1))}`, pokemon[10], true)
                  .addField(`Nº${12+(24*(filas2[0].pagina-1))}`, pokemon[11], true)
                  .addField(`Nº${13+(24*(filas2[0].pagina-1))}`, pokemon[12], true)
                  .addField(`Nº${14+(24*(filas2[0].pagina-1))}`, pokemon[13], true)
                  .addField(`Nº${15+(24*(filas2[0].pagina-1))}`, pokemon[14], true)
                  .addField(`Nº${16+(24*(filas2[0].pagina-1))}`, pokemon[15], true)
                  .addField(`Nº${17+(24*(filas2[0].pagina-1))}`, pokemon[16], true)
                  .addField(`Nº${18+(24*(filas2[0].pagina-1))}`, pokemon[17], true)
                  .addField(`Nº${19+(24*(filas2[0].pagina-1))}`, pokemon[18], true)
                  .addField(`Nº${20+(24*(filas2[0].pagina-1))}`, pokemon[19], true)
                  .addField(`Nº${21+(24*(filas2[0].pagina-1))}`, pokemon[20], true)
                  .addField(`Nº${22+(24*(filas2[0].pagina-1))}`, pokemon[21], true)
                  .addField(`Nº${23+(24*(filas2[0].pagina-1))}`, pokemon[22], true)
                  .addField(`Nº${24+(24*(filas2[0].pagina-1))}`, pokemon[23], true)
                  .setColor(`#FF3737`)
                  .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág ${filas2[0].pagina}/38`)
                let cambio = reaction.message.edit(embed)
              }
            }
          })
        });
      }
    });
    db_listas.all(`SELECT * FROM '${reaction.message.guild.id}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 moviendo pagina de listas`)
      for(var i=0 ; i<10 ; i++){
        if(filas[i]){
          if(filas[i].mensaje === mensaje){
            if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
            if(!reaction.message.member.hasPermission("ADMINISTRATOR") || filas[i].autor!=`${user.id}`) return;
            if(filas[i].pagina <= 1) return
            db_listas.run(`UPDATE '${reaction.message.guild.id}' SET pagina = ${filas[i].pagina-1} WHERE titulo = '${filas[i].titulo}'`, async function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 moviendo pagina de listas`)
              db_listas.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE mensaje = '${filas[i].mensaje}'`, async (err, filas2) => {
                if(err) return console.log(err.message + ` ${message.content} ERROR #3 moviendo pagina de listas`)
                let integrantes = [];
                for(var j=0 ; j<=2000; j++){
                  if(filas2[`user_${j}`]) integrantes.push('<@'+filas2[`user_${j}`]+'>')
                  else integrantes.push(`- - -`)
                  if(integrantes[2000]){
                    let embed = new Discord.MessageEmbed()
                      .setTitle(`:notepad_spiral: __${filas2.titulo}__`)
                      .setDescription(`:busts_in_silhouette: **Participantes:** ${filas2.participantes}\n:hash: **Apúntate:** ${client.config.prefijos[reaction.message.guild.id]}+lista ${i+1}`)
                      .setThumbnail(`https://images.vexels.com/media/users/3/145567/isolated/preview/f3626d1206a21a7efa8e6ed51a7de2db-pergamino-de-navidad-by-vexels.png`)
                      .addField(`${1+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[0+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${2+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[1+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${3+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[2+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${4+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[3+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${5+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[4+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${6+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[5+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${7+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[6+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${8+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[7+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${9+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[8+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${10+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[9+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${11+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[10+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${12+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[11+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${13+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[12+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${14+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[13+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${15+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[14+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${16+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[15+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${17+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[16+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${18+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[17+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${19+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[18+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${20+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[19+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${21+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[20+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${22+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[21+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${23+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[22+(24*(filas2.pagina-1))]}`, true)
                      .addField(`${24+(24*(filas2.pagina-1))}ºUsuario`, `${integrantes[23+(24*(filas2.pagina-1))]}`, true)
                      .setFooter(`Avanza y retrocede de página reaccionando a los emojis || Pág ${filas2.pagina}/${filas[i].num_paginas}`)
                    reaction.message.edit(embed)
                  }
                }
              })
            });
            break;
          }
        }
      }
    });
  }
  if(emojiName==="🐦"){
    db_eventos.all(`SELECT * FROM eventos`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 reaccionando a un evento`)
      for(var i=0 ; i<filas.length ; i++){
        console.log(filas[i].mensaje + ' - ' + mensaje)
        if(filas[i].mensaje===mensaje){
          if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
          let role = reaction.message.guild.roles.cache.find(r => r.name === filas[i].rol);
          if(!role){
      			role = await message.guild.roles.create({
      				data : {
      					name : `${nombrerol}`,
      					color : "#ffffff",
      					permissions : []
      				}
      			})
      		}
          const usuario = await reaction.message.guild.member(user)
          usuario.roles.add(role).catch(console.error);
          client.channels.resolve(filas[i].canal).send(new Discord.MessageEmbed().setDescription(`👍 <@${user.id}>, el rol para el evento ya es tuyo`).setColor(`#EA3479`)).then(m => m.delete({ timeout: 6000 }))
          break;
        }
      }
    });
  }
  if(emojiName==="🗑️"){
    db_eventos.all(`SELECT * FROM eventos`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 reaccionando a la papelera del evento`)
      for(var i=0 ; i<filas.length ; i++){
        if(filas[i].mensaje===mensaje){
          if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
          if(filas[i].autor===user.id || reaction.message.guild.members.resolve(`${user.id}`).hasPermission("ADMINISTRATOR")){
            try{client.channels.resolve(filas[i].canal).messages.delete(filas[i].mensaje, true)}catch(err){};
            db_eventos.run(`DELETE FROM eventos WHERE mensaje = '${filas[i].mensaje}'`, function(err) {
              if(err) return console.log(err.message + ` ${message.content} ERROR #2 reaccionando a la papelera del evento`)
            })
          }
          else return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`**<@${user.id}>, necesitas permisos de __Administrador__o ser el creador del evento para hacer esto**`).setColor(`#5452BC`)).then(m => m.delete({ timeout: 7000}))
        }
      }
    });
  }
  if(emojiName==="🎫"){
    db_canales.get(`SELECT * FROM servidores WHERE id = ${reaction.message.guild.id}`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 en la funcion de reaccion al ticket`)
      if(filas.ticket && filas.ticket_mensaje===mensaje){
        let servidor = client.guilds.resolve(reaction.message.guild.id)
        let bot = client.users.resolve(client.config.id)
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        let rol = servidor.roles.cache.find(r => r.name === "@everyone")
        let categoria = await reaction.message.guild.channels.cache.find(c => c.name === "📨 TICKETS" && c.type === "category")
        if(!categoria){
          categoria = await servidor.channels.create('📨 TICKETS', {
            type: 'category',
            permissionOverwrites: [{
              id: servidor.id,
              allow: ['VIEW_CHANNEL']
            }]
          })
        }
        reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`<@${user.id}>, tu ticket se ha generado. Te han habilitado un canal para ello; habla a través de ahí. Gracias 😁`).setColor(`#D6FBAC`)).then(m => m.delete({ timeout: 7000}))
        let canal_nuevo = servidor.channels.create(`ticket-${user.username}`, { type: 'text',  parent: categoria, permissionOverwrites: [{id: user.id, allow: ['VIEW_CHANNEL']},{id: bot.id, allow: ['VIEW_CHANNEL']},  {id: servidor.id, deny: ['VIEW_CHANNEL']} ] }).then(d => {
          d.send(`<@${user.id}>`)
          d.send(new Discord.MessageEmbed().setDescription(`🎫 __**<@${user.id}>, este es tu canal de consultas**__\n\nEscribe tu duda/pregunta aquí; un miembro del staff se pondrá en contacto contigo.\n\n*Reacciona al 🔑 para cerrar el ticket*`).setColor(`#D6FBAC`)).then(g => {
            g.react('🔑')
            db_tickets.run(`INSERT INTO tickets(servidor, canal, mensaje) VALUES('${reaction.message.guild.id}', '${d.id}', '${g.id}')`, function(err) {
              if(err) return console.log(err.message + ` ERROR #1 en la funcion añadir el ticket`)
            })
          })
        })

      }
    })
  }
  if(emojiName==="🔑"){
    db_tickets.get(`SELECT * FROM tickets WHERE servidor = '${reaction.message.guild.id}' AND canal = '${reaction.message.channel.id}' AND mensaje = '${reaction.message.id}'`, async (err, filas) => {
      if(err || !filas) return;
      reaction.message.channel.delete();
    })
  }
  if(emojiName==="🎉"){
    db_sorteos.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE mensaje = '${mensaje}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 en la funcion de reaccion al sorteo`)
      let integrantes = [];
      if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
      for(var i=0 ; i<=2000; i++) if(filas[`user_${i}`]) integrantes.push(filas[`user_${i}`])
      if(integrantes.some(p => p===`${user.id}`)) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **<@${user.id}>, ya estabas apuntado en el sorteo, no puedes apuntarte dos veces.**`).setColor(`#A9FF3D`)).then(m => m.delete({ timeout: 8000}))
      for(var i=0 ; i<=2000 ; i++){
        if(!filas[`user_${i}`]){
          db_sorteos.run(`UPDATE '${reaction.message.guild.id}' SET user_${i} = '${user.id}', participantes = ${filas.participantes+1} WHERE mensaje = '${filas.mensaje}'`, function(err) {
            if(err) return console.log(err.message + ` ERROR #2 en la funcion de reaccion al sorteo`)
            db_sorteos_todos.run(`UPDATE servidores SET user_${i} = '${user.id}', participantes = ${filas.participantes+1} WHERE mensaje = '${filas.mensaje}'`, function(err) {
              if(err) return console.log(err.message + ` ERROR #3 en la funcion de reaccion al sorteo`)
              reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:confetti_ball: **<@${user.id}>, acabo de apuntarte. Mucha suerte, y que la fuerza te acompañe** :muscle:`).setColor(`#A9FF3D`)).then(m => m.delete({ timeout: 6000}))
              if(!filas[`user_${i+1}`]){
                db_sorteos.run(`ALTER TABLE '${reaction.message.guild.id}' ADD user_${i+1} TEXT`, function(err) {
                  if(err) return console.log(err.message + ` ERROR #4 en la funcion de reaccion al sorteo`)
                })
                db_sorteos_todos.run(`ALTER TABLE servidores ADD user_${i+1} TEXT`, function(err) {
                  if(err) return console.log(err.message + ` ERROR #5 en la funcion de reaccion al sorteo`)
                })
              }
            })
          })
          break;
        }
      }
    })
  }
  if(emojiName==="❌"){
    db_sorteos.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE mensaje = '${mensaje}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 en la funcion de reaccion al sorteo`)
      let integrantes = [];
      if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
      for(var i=0 ; i<=2000; i++) if(filas[`user_${i}`]) integrantes.push(filas[`user_${i}`])
      if(!integrantes.some(p => p===`${user.id}`)) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:thinking: **<@${user.id}>, mmm... no estabas apuntado. ¿Es una broma?**`).setColor(`#A9FF3D`)).then(m => m.delete({ timeout: 8000}))
      for(var i=0 ; i<=2000 ; i++){
        if(filas[`user_${i}`]===user.id){
          db_sorteos.run(`UPDATE '${reaction.message.guild.id}' SET user_${i} = NULL, participantes = ${filas.participantes-1} WHERE mensaje = '${filas.mensaje}'`, function(err) {
            if(err) return console.log(err.message + ` ERROR #2 en la funcion de reaccion al sorteo`)
            db_sorteos_todos.run(`UPDATE servidores SET user_${i} = NULL, participantes = ${filas.participantes-1} WHERE mensaje = '${filas.mensaje}'`, function(err) {
              if(err) return console.log(err.message + ` ERROR #3 en la funcion de reaccion al sorteo`)
              reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`❌ **<@${user.id}>, ya no estás participando. Ya volverás.**`).setColor(`#A9FF3D`)).then(m => m.delete({ timeout: 6000}))
              if(!filas[`user_${i+1}`]){
                db_sorteos.run(`ALTER TABLE '${reaction.message.guild.id}' ADD user_${i+1} TEXT`, function(err) {
                  if(err) return console.log(err.message + ` ERROR #4 en la funcion de reaccion al sorteo`)
                  db_sorteos_todos.run(`ALTER TABLE servidores ADD user_${i+1} TEXT`, function(err) {
                    if(err) return console.log(err.message + ` ERROR #5 en la funcion de reaccion al sorteo`)
                  })
                })
              }
            })
          })
          break;
        }
      }
    })
  }
  if(emojiName==="📃"){
    db_sorteos.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE mensaje = '${mensaje}'`, async (err, filas) => {
      if(!filas) return;
      if(err) return console.log(err.message + ` ERROR #1 en la funcion de reaccion al sorteo`)
      if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
      if(filas.participantes===0) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Por ahora, no hay participantes**`).setColor(`#7E3200`)).then(m => m.delete({ timeout: 20000}))
      if(cooldown.has(mensaje)) return;
      cooldown.add(mensaje);
      setTimeout(() => {
        cooldown.delete(mensaje);
      }, 21000);
      let integrantes = [];
      for(var i=0 ; i<=2000; i++) if(filas[`user_${i}`]) integrantes.push('<@'+filas[`user_${i}`]+'>')
      for(var j=0 ; j<integrantes.length ; j=j+50){
        if(j+50 > integrantes.length){
          reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`📃 **__Participantes__** (${filas.descripcion})\n\n${integrantes.slice(j, integrantes.length).join(', ')}`).setColor(`#7E3200`)).then(m => m.delete({ timeout: 20000}))
          break;
          return;
        }
        reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`📃 **__Participantes__** (${filas.descripcion})\n\n${integrantes.slice(j, j+50).join(', ')}`).setColor(`#7E3200`)).then(m => m.delete({ timeout: 20000}))
      }
    })
  }
  if(emojiName==="🎁"){
    db_tematicos.get(`SELECT * FROM eventos WHERE evento = 'valentin'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ERROR #1 en funciones automatas de san valentin`)
      if(!filas) return;
      if(filas.estado==="🔴") return;

      db_regalos_sv.get(`SELECT * FROM servidores WHERE id = '${user.id}' AND mensaje = '${mensaje}'`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ERROR #2 ganando puntos`)
        if(!filas2) return;
        if(filas2.id===user.id && mensaje===filas2.mensaje){
          reaction.message.reactions.removeAll()
          db_regalos_sv.run(`DELETE FROM servidores WHERE id = '${user.id}' AND mensaje = '${mensaje}'`, function(err) {
            if(err) return console.log(err.message + ` ERROR #2 reseteando cuenta de DH`)
            db_valentin.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE id = '${user.id}'`, async (err, filas3) => {
              if(err) return console.log(err.message + ` ERROR #2 ganando puntos`)
              if(!filas3){
                db_valentin.run(`INSERT INTO '${reaction.message.guild.id}'(id, ingrediente_1, ingrediente_2, ingrediente_3, ingrediente_4, ingrediente_5, ingrediente_6, ingrediente_7, bombones, regalos, num_bombones, num_regalos) VALUES('${user.id}', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)`, async function(err) {
                  if(err) return console.log(err.message + ` ERROR #3 ganando puntos`)
                  db_valentin.run(`UPDATE '${reaction.message.guild.id}' SET bombones = ${filas2.bombon}, num_bombones = 1 WHERE id = '${user.id}'`, async function(err) {
                    if(err) return console.log(err.message + ` ERROR #4 ganando puntos`)
                    if(filas2.bombon>=1 && filas2.bombon<=3) reaction.message.edit(new Discord.MessageEmbed().setTitle(`:heart: BOMBÓN RECIBIDO :heart:`).setDescription(`<@${filas2.id}>, <@${filas2.autor}> te ha enviado un **${sv_bombones[filas2.bombon-1]}**\n\n¡Espero que te guste!`).setImage(`${sv_bombones_imagenes[filas2.bombon-1]}`).setColor(`#FF5C93`).setFooter(`Has recibido 1 bombón`).setTimestamp())
                    else reaction.message.edit(new Discord.MessageEmbed().setTitle(`:heart: BOMBÓN RECIBIDO :heart:`).setDescription(`<@${filas2.id}>, <@${filas2.autor}> te ha enviado una **${sv_bombones[filas2.bombon-1]}**\n\n¡Espero que te guste!`).setImage(`${sv_bombones_imagenes[filas2.bombon-1]}`).setColor(`#FF5C93`).setFooter(`Has recibido 1 bombón`).setTimestamp())
                  })
                })
              }
              else{
                db_valentin.run(`UPDATE '${reaction.message.guild.id}' SET bombones = ${filas3.bombones+filas2.bombon}, num_bombones = ${filas3.num_bombones+1} WHERE id = '${user.id}'`, async function(err) {
                  if(err) return console.log(err.message + ` ERROR #4 ganando puntos`)
                  if((filas3.num_bombones+1)<=1){
                    if(filas2.bombon>=1 && filas2.bombon<=3) reaction.message.edit(new Discord.MessageEmbed().setTitle(`:heart: BOMBÓN RECIBIDO :heart:`).setDescription(`<@${filas2.id}>, <@${filas2.autor}> te ha enviado un **${sv_bombones[filas2.bombon-1]}**\n\n¡Espero que te guste!`).setImage(`${sv_bombones_imagenes[filas2.bombon-1]}`).setColor(`#FF5C93`).setFooter(`Has recibido ${filas3.num_bombones+1} bombon`).setTimestamp())
                    else reaction.message.edit(new Discord.MessageEmbed().setTitle(`:heart: BOMBÓN RECIBIDO :heart:`).setDescription(`<@${filas2.id}>, <@${filas2.autor}> te ha enviado una **${sv_bombones[filas2.bombon-1]}**\n\n¡Espero que te guste!`).setImage(`${sv_bombones_imagenes[filas2.bombon-1]}`).setColor(`#FF5C93`).setFooter(`Has recibido ${filas3.num_bombones+1} bombon`).setTimestamp())
                  }
                  else{
                    if(filas2.bombon>=1 && filas2.bombon<=3) reaction.message.edit(new Discord.MessageEmbed().setTitle(`:heart: BOMBÓN RECIBIDO :heart:`).setDescription(`<@${filas2.id}>, <@${filas2.autor}> te ha enviado un **${sv_bombones[filas2.bombon-1]}**\n\n¡Espero que te guste!`).setImage(`${sv_bombones_imagenes[filas2.bombon-1]}`).setColor(`#FF5C93`).setFooter(`Has recibido ${filas3.num_bombones+1} bombones`).setTimestamp())
                    else reaction.message.edit(new Discord.MessageEmbed().setTitle(`:heart: BOMBÓN RECIBIDO :heart:`).setDescription(`<@${filas2.id}>, <@${filas2.autor}> te ha enviado una **${sv_bombones[filas2.bombon-1]}**\n\n¡Espero que te guste!`).setImage(`${sv_bombones_imagenes[filas2.bombon-1]}`).setColor(`#FF5C93`).setFooter(`Has recibido ${filas3.num_bombones+1} bombones`).setTimestamp())
                  }
                })
              }
            })
          })
        }
      })
    })
  }

  db_roles.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE mensaje = ${mensaje}`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 en reaction role`)
    for(var i=1 ; i<=20 ; i++){
      if(filas[`emoji_${i}`]===emojiName){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        let role = await reaction.message.guild.roles.cache.find(r => r.id === filas[`rol_${i}`]);
        if(!role) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¡AVISA RÁPDIO A UN ADMINISTRADOR!**\n\nEl rol que estás intentando ponerte, ha sido eliminado y no lo encuentro. Debereis volver a generar este mensaje con el comando correspondiente, con roles que existan`)).then(m => m.delete({ timeout: 20000}))
        const usuario = await reaction.message.guild.member(user)
        if(!usuario.roles.cache.has(role.id)){
          if(reaction.message.guild.me.hasPermission("MANAGE_ROLES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_ROLES")) await usuario.roles.add(role).catch(console.error);
          return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:ok: **<@${user.id}>, el rol ${role} es tuyo :ok_hand:**`).setColor(`#FF772C`)).then(m => m.delete({ timeout: 7000}))
        }
        else{
          if(reaction.message.guild.me.hasPermission("MANAGE_ROLES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_ROLES")) await usuario.roles.remove(role).catch(console.error);
          return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:ok: **<@${user.id}>, di adiós al rol ${role}; ya te lo quité :pinching_hand:**`).setColor(`#FF772C`)).then(m => m.delete({ timeout: 7000}))
        }
        break;
      }
    }
  })
  db_roles_mod.get(`SELECT * FROM '${reaction.message.guild.id}' WHERE mensaje = ${mensaje}`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 en reaction role`)
    for(var i=1 ; i<=20 ; i++){
      let nombre_emoji = await checkEmoji(filas[`emoji_${i}`])
      if(nombre_emoji===emojiName){
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        let role = await reaction.message.guild.roles.cache.find(r => r.id === filas[`rol_${i}`]);
        if(!role) return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¡AVISA RÁPDIO A UN ADMINISTRADOR!**\n\nEl rol que estás intentando ponerte, ha sido eliminado y no lo encuentro. Debereis volver a generar este mensaje con el comando correspondiente, con roles que existan`).setColor(`#FF772C`)).then(m => m.delete({ timeout: 20000}))
        const usuario = await reaction.message.guild.member(user)
        if(!usuario.roles.cache.has(role.id)){
          if(reaction.message.guild.me.hasPermission("MANAGE_ROLES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_ROLES")) await usuario.roles.add(role).catch(console.error);
          else return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¡AVISA RÁPDIO A UN ADMINISTRADOR!**\n\nO bien no tengo permiso para ponerte el rol, o el rol no está bien situado en la jerarquía del servidor.`).setColor(`#FF772C`)).then(m => m.delete({ timeout: 20000}))
          return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:ok: **<@${user.id}>, el rol ${role} es tuyo :ok_hand:**`).setColor(`#FF772C`)).then(m => m.delete({ timeout: 7000}))
        }
        else{
          if(reaction.message.guild.me.hasPermission("MANAGE_ROLES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_ROLES")) await usuario.roles.remove(role).catch(console.error);
          else return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¡AVISA RÁPDIO A UN ADMINISTRADOR!**\n\nO bien no tengo permiso para ponerte el rol, o el rol no está bien situado en la jerarquía del servidor.`).setColor(`#FF772C`)).then(m => m.delete({ timeout: 20000}))
          return reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`:ok: **<@${user.id}>, di adiós al rol ${role}; ya te lo quité :pinching_hand:**`).setColor(`#FF772C`)).then(m => m.delete({ timeout: 7000}))
        }
        break;
      }
    }
  })
  db_tickets_mod.get(`SELECT * FROM servidores WHERE servidor = '${reaction.message.guild.id}' AND mensaje = ${mensaje}`, async (err, filas) => {
    if(!filas) return;
    if(err) return console.log(err.message + ` ERROR #1 en ticket modeado`)
    for(var i=1 ; i<=10 ; i++){
      let nombre_emoji = await checkEmoji(filas[`emoji_${i}`])
      if(nombre_emoji===emojiName){
        let servidor = client.guilds.resolve(reaction.message.guild.id)
        let bot = client.users.resolve(client.config.id)
        if(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES") || reaction.message.channel.permissionsFor(reaction.message.guild.me).has("MANAGE_MESSAGES")) reaction.users.remove(user);
        db_premium.get(`SELECT * FROM premium WHERE servidor = '${reaction.message.guild.id}'`, async (err, filas2) => {
          if(err) return console.log(err.message + ` ERROR #A al detectar premium con ${reaction.message.guild.id}`)
          /*if(!filas2){
            let embed_no = new Discord.MessageEmbed()
            .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
            .setImage(new MessageAttachment(`${imagen_premium}/premium-config_canales.png`))
            .setColor(`#D6FBAC`)
            .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
            return reaction.message.channel.send(embed_no)
          }*/
          let rol = servidor.roles.cache.find(r => r.name === "@everyone")
          let categoria = await reaction.message.guild.channels.cache.find(c => c.name === `📨 TICKETS - ${filas[`texto_${i}`]}` && c.type === "category")
          if(!categoria){
            categoria = await servidor.channels.create(`📨 TICKETS - ${filas[`texto_${i}`]}`, {
              type: 'category',
              permissionOverwrites: [{
                id: servidor.id,
                allow: ['VIEW_CHANNEL']
              }]
            })
          }
          reaction.message.channel.send(new Discord.MessageEmbed().setDescription(`<@${user.id}>, tu ticket se ha generado. Te han habilitado un canal para ello; habla a través de ahí. Gracias 😁`).setColor(`#D6FBAC`)).then(m => m.delete({ timeout: 7000}))
          let canal_nuevo = servidor.channels.create(`ticket-${user.username}`, { type: 'text',  parent: categoria, permissionOverwrites: [{id: user.id, allow: ['VIEW_CHANNEL']},{id: bot.id, allow: ['VIEW_CHANNEL']},  {id: servidor.id, deny: ['VIEW_CHANNEL']} ] }).then(d => {
            d.send(`<@${user.id}>`)
            d.send(new Discord.MessageEmbed().setDescription(`🎫 __**<@${user.id}>, este es tu canal de consultas**__\n\nEscribe tu duda/pregunta aquí; un miembro del staff se pondrá en contacto contigo.\n\n*Reacciona al 🔑 para cerrar el ticket*`).setColor(`#D6FBAC`)).then(g => {
              g.react('🔑')
              db_tickets.run(`INSERT INTO tickets(servidor, canal, mensaje) VALUES('${reaction.message.guild.id}', '${d.id}', '${g.id}')`, function(err) {
                if(err) return console.log(err.message + ` ERROR #1 en la funcion añadir el ticket`)
              })
            })
          })
        })
        break;
      }
    }
  })
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
function checkEmoji(args){
  let id_emoji = [];
  let contador = 0;
  if(args[0]!='<') contador=900;
  for(var i=0 ; i<args.length ; i++){
    if(args[i]===':') contador++;
    if(contador===1 && args[i]!=':') id_emoji.push(args[i])
    if(contador===900) id_emoji.push(args[i])
  }
  return id_emoji.join("");
};
