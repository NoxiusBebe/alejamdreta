/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");
const db_listas = new sqlite3.Database("./memoria/db_listas.sqlite");

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
  "ATTACH_FILES": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "grupos.lista [nº de la lista: 1 al 10] [nº de integrantes por grupo]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#A9FF3D`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#A9FF3D`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 al detectar premium con ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.listas===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-listas.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#A9FF3D`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    let numerolista = args.slice(0,1).join(' ');
    let integrantes = args.slice(1,2).join(' ');

    if(!numerolista || isNaN(numerolista)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Ejem... el número de la lista, ¿qué?**\n\n${estructura}`).setColor(`#A9FF3D`))
    numerolista = parseInt(numerolista);

    if(!integrantes || isNaN(integrantes)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Ejem... los participantes, ¿cuántos por equipo dices?**\n\n${estructura}`).setColor(`#A9FF3D`))
    integrantes = parseInt(integrantes);

    db_listas.all(`SELECT * FROM '${message.guild.id}'`, (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 haciendo grupos en lista ${numerolista} en ${message.guild.id}`)
      if(!filas[numerolista-1]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:question: **Este número no corresponde con ninguna lista**\n\n${estructura}`).setColor(`#A9FF3D`))
      if(filas[numerolista-1].participantes===0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:confused: **En esta lista no hay participantes. ¿Cómo pretendes hacer equipos sin participantes?**`).setColor(`#A9FF3D`))
      if(!message.member.hasPermission("ADMINISTRATOR") || filas[numerolista-1].autor!=`${message.author.id}`) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **Sin ser administrador o el creador de la lista, no puedes hacer esto.**\n\n${estructura}`))

      let ayuda;
      if(((filas[numerolista-1].participantes)%integrantes)!=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:abacus: **Tenemos un problema: no puedo hacer todos los grupos iguales. Asi que, o esperas a que se una más gente, o editas la cantidad de miembros por grupo. Pero por ahora, las matemáticas no cuadran...**`).setColor(`#A9FF3D`))
      let grupos = (filas[numerolista-1].participantes)/integrantes;

      let lista = [];
      for(var j=0 ; j<2000 ; j++) if(filas[numerolista-1][`user_${j}`]) lista.push(filas[numerolista-1][`user_${j}`]);

      let grupo = [];
      let cambio = 0;
      let parti1;
      let embed;
      let parti2;

      let repeticion = setInterval(async function() {
        grupo = null;
        grupo = [];
        for(var j=0 ; j<integrantes ; j++)
        {
          do{
            ayuda = Math.round(Math.random()*((lista.length)-1));
          }while(lista[ayuda]===null)
          grupo.push(`<@${lista[ayuda]}>`)
          lista[ayuda]=null;
        }
        embed = new Discord.MessageEmbed()
          .setTitle(`:crossed_swords: **GRUPO ${cambio+1}** :shield:`)
          .setThumbnail(message.guild.iconURL())
          .addField(`**Miembros:**`, `${grupo.join("\n")}`)
          .setColor('RANDOM');
        message.channel.send(embed);
        cambio = cambio+1
        if(cambio===grupos) clearInterval(repeticion)
      }, 3000)
    });
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
