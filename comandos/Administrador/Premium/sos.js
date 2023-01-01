/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

let imagen_premium = "./archivos/Privado/Alejandreta 3.0/Logos Premium";

let stop_sos = new Set();

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "MOVE_MEMBERS": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "ATTACH_FILES": "✅",
  "MOVE_MEMBERS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "sos [@rol1] (@rol2) (@rol3)`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#FF3D5E`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#FF3D5E`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }



  db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR detectando "premium" en ${message.guild.id}`)
    /*if(!filas || (filas.premium===null && filas.administrador===null)){
      let embed_no = new Discord.MessageEmbed()
        .setDescription(`__**¿QUIERES LA VERSIÓN PREMIUM EN TU SERVIDOR?**__\n\nConsulta todos los tipos de suscripciones tecleando **`+client.config.prefijos[message.guild.id]+`premium** y compra la que mas te guste.\n\nNo te olvides de concretar la ID del servidor cuando realices el pago, para saber a qué servidor se le habilitará la suscripción.`)
        .attachFiles([new MessageAttachment(`${imagen_premium}/premium-administrador.png`, `premium.png`)])
        .setImage(`attachment://premium.png`)
        .setColor(`#FF3D5E`)
        .setFooter(`Si tienes cualquier duda, contacta con el servidor soporte || https://discord.gg/Hx8CZnURed`);
      return message.channel.send(embed_no)
    }*/
    if(stop_sos.has(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`:no_entry_sign: **Debes esperar 1 minuto para usar este comando de nuevo.**`)).then(m => m.delete({ timeout: 7000}))
    stop_sos.add(message.author.id);
    setTimeout(() => {stop_sos.delete(message.author.id);}, 60000);

    let roles = args.join(" ").split(" ");

    let Canalvoz = message.guild.member(message.author.id).voice.channel;
    if(!roles[0]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **¿A quién estás tratando de avisar?**.\n\n${estructura}`).setColor(`#FF3D5E`))
    if(roles[4]) return message.channel.send(new Discord.MessageEmbed().setDescription(`:warning: **Te has pasado mencionando roles. El máximo son 3.**\n\n${estructura}`).setColor(`#FF3D5E`))
    if(!Canalvoz) return message.channel.send(new Discord.MessageEmbed().setDescription(`:mute: **${message.author}, no estás en ningún canal de voz**\n\n${estructura}`).setColor(`#FF3D5E`))
    await message.guild.members.fetch()

    let arrayserver = message.guild.members.cache.map(guild => guild.id);
    let miembro;
    let roles_dened = [];

    for(var i=0 ; i<roles.length ; i++){
      let aux = await checkMentionRol(roles[i])
      if(aux==='@everyone') return message.channel.send(new Discord.MessageEmbed().setDescription(`**${message.author}, no vas a abusar de este comando usando __everyone__. No voy a ejecutar el comando.**`).setColor(`#FF3D5E`))
      else{
        aux = await message.guild.roles.cache.find(r => r.id === aux);
        let size_role = message.guild.members.cache.filter(({ roles }) => roles.cache.has(aux.id))
        if(size_role.length>10) roles_dened.push(`- <@&${aux.id}>`)
        else if(!aux) roles_dened.push(`- <@&${aux.id}>`)
        else if(aux){
          for(var j=0 ; j<arrayserver.length ; j++){
            miembro = message.guild.members.resolve(`${arrayserver[j]}`);
            if(miembro.roles.cache.some(r => r == aux)){
              if(message.guild.member(miembro).voice.channel) try{message.guild.member(arrayserver[j]).voice.setChannel(Canalvoz.id);}catch{}
              else try{miembro.send(new Discord.MessageEmbed().setDescription(`:sos: **COMANDO DE EMERGENCIA EJECUTADO**\n\n**${message.author}** ha usado el comando de emergencia en el servidor **${message.guild.name}**.\n\nTe esperan en el canal de voz **${Canalvoz.name}**`).setColor(`#FF3D5E`))}catch{}
            }
          }
        }
      }
      if(i===roles.length-1 && roles_dened.length>0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: Estos roles no fueron utilizados por poseerlo más de 10 personas o no existir el rol:\n${roles_dened.join("\n")}`).setColor(`#FF3D5E`))
    }
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

function checkMentionRol(args){
  let match = args.match(/(?<=(<@&))(\d{17,19})(?=>)/g)
  return match ? match[0] : args;
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
