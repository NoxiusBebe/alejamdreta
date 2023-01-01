/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, oldMember, newMember) => {
  db_canales.get(`SELECT * FROM servidores WHERE id = ${newMember.guild.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ERROR #1 en la funcion de actualizaciones de apodo`)
    if(!filas || !oldMember.guild.me.hasPermission("SEND_MESSAGES")) return;

    let nombre_antiguo;
    let nombre_nuevo;

    if(oldMember.nickname === null) nombre_antiguo = oldMember.displayName;
    else nombre_antiguo = oldMember.nickname;

    if(newMember.nickname === null) nombre_nuevo = newMember.displayName;
    else nombre_nuevo = newMember.nickname;


    if(filas.logs){
      let canal = await client.channels.resolve(filas.logs)
      if(oldMember.nickname !== newMember.nickname){
        let embed = new Discord.MessageEmbed()
          .setTitle(":repeat: **ALGUIEN SE CAMBIÓ SU NICK**")
          .setDescription(`**Apodo antiguo:** ${nombre_antiguo}\n**Apodo nuevo:** ${nombre_nuevo}`)
          .setThumbnail(newMember.user.displayAvatarURL())
          .setColor("#5AD6FA")
          .addField(`:busts_in_silhouette: Usuario: `, oldMember, true)
          .addField(`:hash: Tag: `, oldMember.user.username+'#'+oldMember.user.discriminator, true)
          .setTimestamp();
        try{return canal.send(embed);}catch(err){};
      }
    }
  });
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
