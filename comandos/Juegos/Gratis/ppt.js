/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_pescaderia = new sqlite3.Database("./memoria/db_pescaderia.sqlite");

let cañadepescar = new Set();

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "ppt [opciones: piedra, papel, tijeras, lagarto, spock]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let eleccion = args.join(" ");
  if(!eleccion) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Debes elegir qué quieres sacar**\n\n${estructura}`).setColor(`#FBACAC`))
  if(eleccion!='Piedra' && eleccion!='Papel' && eleccion!='Tijeras' && eleccion!='Lagarto' && eleccion!='Spock' && eleccion!='piedra' && eleccion!='papel' && eleccion!='tijeras' && eleccion!='lagarto' && eleccion!='spock' && eleccion!='PIEDRA' && eleccion!='PAPEL' && eleccion!='TIJERAS' && eleccion!='LAGARTO' && eleccion!='SPOCK') return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Debes elegir qué quieres sacar**\n\n${estructura}`).setColor(`#FBACAC`))

  let array = ['Piedra','Papel','Tijeras','Lagarto','Spock'];
  let numaleatorio = Math.round(Math.random()*4);
  let eleccionBOT = `${array[numaleatorio]}`

  let x;
  let titulo;
  let frase1;
  let frase2;
  let color;

  if(eleccion==='Piedra' || eleccion==='piedra' || eleccion==='PIEDRA') frase1 = `Has elegido: **Piedra** :punch:`;
  if(eleccion==='Papel' || eleccion==='papel' || eleccion==='PAPEL') frase1 = `Has elegido: **Papel** :hand_splayed:`;
  if(eleccion==='Tijeras' || eleccion==='tijeras' || eleccion==='TIJERAS') frase1 = `Has elegido: **Tijeras** :scissors:`;
  if(eleccion==='Lagarto' || eleccion==='lagarto' || eleccion==='LAGARTO') frase1 = `Has elegido: **Lagarto** :lizard:`;
  if(eleccion==='Spock' || eleccion==='spock' || eleccion==='SPOCK') frase1 = `Has elegido: **Spock** :vulcan:`;
  if(eleccionBOT==='Piedra') frase2 = `Alejandreta ha elegido: **${eleccionBOT}** :punch:`;
  if(eleccionBOT==='Papel') frase2 = `Alejandreta ha elegido: **${eleccionBOT}** :hand_splayed:`;
  if(eleccionBOT==='Tijeras') frase2 = `Alejandreta ha elegido: **${eleccionBOT}** :scissors:`;
  if(eleccionBOT==='Lagarto') frase2 = `Alejandreta ha elegido: **${eleccionBOT}** :lizard:`;
  if(eleccionBOT==='Spock') frase2 = `Alejandreta ha elegido: **${eleccionBOT}** :vulcan:`;

  if((eleccion==='Piedra' || eleccion==='piedra' || eleccion==='PIEDRA') && (eleccionBOT==='Piedra')) x=0, color = `#ffc936`;
  if((eleccion==='Papel' || eleccion==='papel' || eleccion==='PAPEL') && (eleccionBOT==='Papel')) x=0, color = `#ffc936`;
  if((eleccion==='Tijeras' || eleccion==='tijeras' || eleccion==='TIJERAS') && (eleccionBOT==='Tijeras')) x=0, color = `#ffc936`;
  if((eleccion==='Lagarto' || eleccion==='lagarto' || eleccion==='LAGARTO') && (eleccionBOT==='Lagarto')) x=0, color = `#ffc936`;
  if((eleccion==='Spock' || eleccion==='spock' || eleccion==='SPOCK') && (eleccionBOT==='Spock')) x=0, color = `#ffc936`;

  if((eleccion==='Papel' || eleccion==='papel' || eleccion==='PAPEL') && (eleccionBOT==='Piedra')) x=1, color = `#8fed42`;
  if((eleccion==='Tijeras' || eleccion==='tijeras' || eleccion==='TIJERAS') && (eleccionBOT==='Papel')) x=1, color = `#8fed42`;
  if((eleccion==='Piedra' || eleccion==='piedra' || eleccion==='PIEDRA') && (eleccionBOT==='Lagarto')) x=1, color = `#8fed42`;
  if((eleccion==='Lagarto' || eleccion==='lagarto' || eleccion==='LAGARTO') && (eleccionBOT==='Spock')) x=1, color = `#8fed42`;
  if((eleccion==='Spock' || eleccion==='spock' || eleccion==='SPOCK') && (eleccionBOT==='Tijeras')) x=1, color = `#8fed42`;
  if((eleccion==='Tijeras' || eleccion==='tijeras' || eleccion==='TIJERAS') && (eleccionBOT==='Lagarto')) x=1, color = `#8fed42`;
  if((eleccion==='Lagarto' || eleccion==='lagarto' || eleccion==='LAGARTO') && (eleccionBOT==='Papel')) x=1, color = `#8fed42`;
  if((eleccion==='Papel' || eleccion==='papel' || eleccion==='PAPEL') && (eleccionBOT==='Spock')) x=1, color = `#8fed42`;
  if((eleccion==='Spock' || eleccion==='spock' || eleccion==='SPOCK') && (eleccionBOT==='Piedra')) x=1, color = `#8fed42`;
  if((eleccion==='Piedra' || eleccion==='piedra' || eleccion==='PIEDRA') && (eleccionBOT==='Tijeras')) x=1, color = `#8fed42`;

  if((eleccion==='Piedra' || eleccion==='piedra' || eleccion==='PIEDRA') && (eleccionBOT==='Papel')) x=2, color = `#e83a3a`;
  if((eleccion==='Papel' || eleccion==='papel' || eleccion==='PAPEL') && (eleccionBOT==='Tijeras')) x=2, color = `#e83a3a`;
  if((eleccion==='Lagarto' || eleccion==='lagarto' || eleccion==='LAGARTO') && (eleccionBOT==='Piedra')) x=2, color = `#e83a3a`;
  if((eleccion==='Spock' || eleccion==='spock' || eleccion==='SPOCK') && (eleccionBOT==='Lagarto')) x=2, color = `#e83a3a`;
  if((eleccion==='Tijeras' || eleccion==='tijeras' || eleccion==='TIJERAS') && (eleccionBOT==='Spock')) x=2, color = `#e83a3a`;
  if((eleccion==='Lagarto' || eleccion==='lagarto' || eleccion==='LAGARTO') && (eleccionBOT==='Tijeras')) x=2, color = `#e83a3a`;
  if((eleccion==='Papel' || eleccion==='papel' || eleccion==='PAPEL') && (eleccionBOT==='Lagarto')) x=2, color = `#e83a3a`;
  if((eleccion==='Spock' || eleccion==='spock' || eleccion==='SPOCK') && (eleccionBOT==='Papel')) x=2, color = `#e83a3a`;
  if((eleccion==='Piedra' || eleccion==='piedra' || eleccion==='PIEDRA') && (eleccionBOT==='Spock')) x=2, color = `#e83a3a`;
  if((eleccion==='Tijeras' || eleccion==='tijeras' || eleccion==='TIJERAS') && (eleccionBOT==='Piedra')) x=2, color = `#e83a3a`;

  if(x==0) titulo = "**:low_brightness: ¡EMPATE! :low_brightness:**";
  if(x==1) titulo = "**:white_check_mark: ¡GANASTE! :white_check_mark:**";
  if(x==2) titulo = "**:no_entry: ¡GANA EL BOT! :no_entry:**";

  let embed = new Discord.MessageEmbed()
    .setTitle(titulo)
    .setDescription(`${frase1}\n${frase2}`)
    .setColor(color)
    .setThumbnail(message.author.displayAvatarURL());
  return message.channel.send(embed)
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
