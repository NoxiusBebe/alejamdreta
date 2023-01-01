/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");
const db_configuracion = new sqlite3.Database("./memoria/db_configuracion.sqlite");
const db_niveles = new sqlite3.Database("./memoria/db_niveles.sqlite");

const frases_despedida = require("../archivos/Documentos/Config.Canales/frases-despedida.json")

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL EVENTO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, member) => {
  db_canales.get(`SELECT * FROM servidores WHERE id = ${member.guild.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ERROR #3 en la funcion de despedida`)
    if(!filas) return;
    if(!member.guild.me.hasPermission("SEND_MESSAGES")) return;
    if(filas.despedida){
      db_configuracion.get(`SELECT * FROM servidores WHERE id = ${member.guild.id}`, async (err, filas2) => {
        if(err) return console.log(err.message + ` ERROR #1 en la funcion de despedida`)
        let frase;
        let imagen;

        if(filas2 && filas2.mens_desped) frase = `${filas2.mens_desped}`;
        else frase = frases_despedida[Math.floor(Math.random()*(frases_despedida.length-1))]
        if(filas2 && filas2.img_desped) imagen = `${filas2.img_desped}`;
        else imagen = `https://cdn.discordapp.com/attachments/523268901719769088/779042200864423946/heart-breaker-1.gif`;
        let canal = await client.channels.resolve(filas.despedida)
        let embed = new Discord.MessageEmbed()
          .setTitle(`**:outbox_tray: SE NOS FUE UN COMPAÑERO DE EQUIPO**`)
          .setDescription(`${frase}\n\n:busts_in_silhouette: **Usuario:** ${member.user.tag}\n:pencil: **Ingresó:**: ${member.joinedAt.toLocaleDateString('es-ES')}`)
          .setThumbnail(member.user.displayAvatarURL())
          .setColor(`#FF5454`)
          .setImage(`${imagen}`)
          .setTimestamp();
        try{canal.send(embed)}catch(err){};
      })
    }
  });
  db_niveles.get(`SELECT * FROM '${member.guild.id}' WHERE usuario = '${member.user.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ERROR #1 borrando niveles`)
    if(filas){
      db_niveles.run(`DELETE FROM '${member.guild.id}' WHERE usuario = ${member.user.id}`, function(err) {
        if(err) return console.log(err.message + ` ERROR #2 borrando niveles`)
      })
    }
  });
}

/* ――――――――――――――――――――――――― */
/* ⇒ FUNCIONES AUXILIARES ⇐ */
/* ――――――――――――――――――――――――― */
