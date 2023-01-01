/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");
const db_configuracion = new sqlite3.Database("./memoria/db_configuracion.sqlite");

const frases_bienvenida = require("../archivos/Documentos/Config.Canales/frases-bienvenida.json")

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, member) => {
  member.fetch()
  db_canales.get(`SELECT * FROM servidores WHERE id = ${member.guild.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ERROR #3 en la funcion de bienvenida`)
    if(!filas) return;
    if(!member.guild.me.hasPermission("SEND_MESSAGES")) return;
    if(filas.bienvenida){
      if(!member.guild.me.hasPermission("MANAGE_GUILD")){
        db_configuracion.get(`SELECT * FROM servidores WHERE id = ${member.guild.id}`, async (err, filas2) => {
          if(err) return console.log(err.message + ` ERROR #1 en la funcion de bienvenida`)
          let frase;
          let imagen;

          if(filas2 && filas2.mens_bienve) frase = `${filas2.mens_bienve}`;
          else frase = frases_bienvenida[Math.floor(Math.random()*(frases_bienvenida.length-1))]
          if(filas2 && filas2.img_bienve) imagen = `${filas2.img_bienve}`;
          else imagen = `https://cdn.discordapp.com/attachments/523268901719769088/779031368712585266/welcome.gif`;
          let canal = await client.channels.resolve(filas.bienvenida)
          let embed = new Discord.MessageEmbed()
            .setTitle(`**:inbox_tray: TENEMOS A UN NUEVO MIEMBRO**`)
            .setDescription(`${frase}\n\n:busts_in_silhouette: **Usuario:** ${member.user}\n:pencil: **Ingreso:** ${member.joinedAt.toLocaleDateString('es-ES')}\n:mag: **Invitado por:** *No tengo permisos (Gestionar Servidor)*`)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(`#B2F848`)
            .setImage(`${imagen}`)
            .setTimestamp();
          try{canal.send(embed)}catch(err){};
        })
      }
      else{
        member.guild.fetchInvites().then(async guildInvites => {
          let invite_data;
          const ei = client.config.invites_servidores[member.guild.id];
          client.config.invites_servidores[member.guild.id] = guildInvites;
          if(ei){
            try{
              const invite = guildInvites.find(i => (!ei.get(i.code) && i.uses===1) || ei.get(i.code).uses<i.uses || (ei.get(i.code) && !i))
              if(!invite || invite===undefined) invite_data = "Paradero desconocido...";
              else invite_data = `${invite.code} | **${invite.inviter.username}#${invite.inviter.discriminator}**`;
            }catch{ invite_data = `Paradero desconocido...`; }
          }
          else invite_data = "Paradero desconocido...";
          db_configuracion.get(`SELECT * FROM servidores WHERE id = ${member.guild.id}`, async (err, filas2) => {
            if(err) return console.log(err.message + ` ERROR #1 en la funcion de bienvenida`)
            let frase;
            let imagen;
            if(filas2 && filas2.mens_bienve) frase = `${filas2.mens_bienve}`;
            else frase = frases_bienvenida[Math.floor(Math.random()*(frases_bienvenida.length-1))]
            if(filas2 && filas2.img_bienve) imagen = `${filas2.img_bienve}`;
            else imagen = `https://cdn.discordapp.com/attachments/523268901719769088/779031368712585266/welcome.gif`;

            let canal = await client.channels.resolve(filas.bienvenida)
            let embed = new Discord.MessageEmbed()
              .setTitle(`**:inbox_tray: TENEMOS A UN NUEVO MIEMBRO**`)
              .setDescription(`${frase}\n\n:busts_in_silhouette: **Usuario:** ${member.user}\n:pencil: **Ingreso:** ${member.joinedAt.toLocaleDateString('es-ES')}\n:mag: **Invitado por:** ${invite_data}`)
              .setThumbnail(member.user.displayAvatarURL())
              .setColor(`#B2F848`)
              .setImage(`${imagen}`)
              .setTimestamp();
            try{canal.send(embed)}catch(err){};
          })
        });
      }
    }
    if(filas.verificacion){
      if(!member.guild.me.hasPermission("MANAGE_ROLES")) return;
      let rol_check = await member.guild.roles.cache.find(r => r.name === "¡CHECK-ALEJANDRETA!")
      if(!rol_check) rol_check = await member.guild.roles.create({data: {name: "¡CHECK-ALEJANDRETA!", color: "#FF0000"}})
      member.roles.add(rol_check).catch(console.error());
    }
    else{
      db_configuracion.get(`SELECT * FROM servidores WHERE id = ${member.guild.id}`, async (err, filas) => {
        if(err) return console.log(err.message + ` ERROR #1 en la funcion de bienvenida`)
        if(!filas) return;

        if(filas.rolinicial){
          if(!member.guild.me.hasPermission("MANAGE_ROLES")) return;
          let rol_inicial = await member.guild.roles.cache.find(r => r.id === `${filas.rolinicial}`);
          if(!rol_inicial) return;
          member.roles.add(rol_inicial).catch(console.error());
        }

        if(filas.presentacion) member.send(filas.presentacion)
      });
    }
  });
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
