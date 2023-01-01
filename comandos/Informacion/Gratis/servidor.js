/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_canales = new sqlite3.Database("./memoria/db_canales.sqlite");
const db_configuracion = new sqlite3.Database("./memoria/db_configuracion.sqlite");
const db_premium = new sqlite3.Database("./memoria/db_premium.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "servidor`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#ACC5FB`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#ACC5FB`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_canales.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 viendo la informacion del servidor`)
    let canal_bienvenida;
    let canal_despedida;
    let canal_logs;
    let canal_sanciones;
    let canal_check;
    let canal_nsfw;
    let canal_ticket;
    let canal_sugerencias;
    let canal_ofertas;
    let canal_parches;
    let canal_confesiones;
    let canal_periodico;

    if(filas && filas.bienvenida!=undefined && filas.bienvenida!=null) canal_bienvenida = `<#${filas.bienvenida}>`;
    else canal_bienvenida = '`Sin asignar`';
    if(filas && filas.despedida!=undefined && filas.despedida!=null) canal_despedida = `<#${filas.despedida}>`;
    else canal_despedida = '`Sin asignar`';
    if(filas && filas.logs!=undefined && filas.logs!=null) canal_logs = `<#${filas.logs}>`;
    else canal_logs = '`Sin asignar`';
    if(filas && filas.sanciones!=undefined && filas.sanciones!=null) canal_sanciones = `<#${filas.sanciones}>`;
    else canal_sanciones = '`Sin asignar`';
    if(filas && filas.verificacion!=undefined && filas.verificacion!=null) canal_check = `<#${filas.verificacion}>`;
    else canal_check = '`Sin asignar`';
    if(filas && filas.ticket!=undefined && filas.ticket!=null) canal_ticket = `<#${filas.ticket}>`;
    else canal_ticket = '`Sin asignar`';
    if(filas && filas.parches!=undefined && filas.parches!=null) canal_parches = `<#${filas.parches}>`;
    else canal_parches = '`Sin asignar`';
    if(filas && filas.nsfw!=undefined && filas.nsfw!=null) canal_nsfw = `<#${filas.nsfw}>`;
    else canal_nsfw = '`Sin asignar`';
    if(filas && filas.sugerencias!=undefined && filas.sugerencias!=null) canal_sugerencias = `<#${filas.sugerencias}>`;
    else canal_sugerencias = '`Sin asignar`';
    if(filas && filas.ofertas!=undefined && filas.ofertas!=null) canal_ofertas = `<#${filas.ofertas}>`;
    else canal_ofertas = '`Sin asignar`';
    if(filas && filas.confesiones!=undefined && filas.confesiones!=null) canal_confesiones = `<#${filas.confesiones}>`;
    else canal_confesiones = '`Sin asignar`';
    if(filas && filas.periodico!=undefined && filas.periodico!=null) canal_periodico = `<#${filas.periodico}>`;
    else canal_periodico = '`Sin asignar`';

    db_configuracion.get(`SELECT * FROM servidores WHERE id = ${message.guild.id}`, async (err, filas2) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 viendo la informacion del servidor`)
      let antispam;
      let palabrotas;
      let invitaciones;
      let terminator;
      let rolinicial;

      if(filas2 && filas2.antispam!=undefined && filas2.antispam!=null) antispam = '`'+filas2.antispam+'`';
      else antispam = '`OFF`';
      if(filas2 && filas2.palabrotas!=undefined && filas2.palabrotas!=null) palabrotas = '`'+filas2.palabrotas+'`';
      else palabrotas = '`OFF`';
      if(filas2 && filas2.invitaciones!=undefined && filas2.invitaciones!=null) invitaciones = '`'+filas2.invitaciones+'`';
      else invitaciones = '`OFF`';
      if(filas2 && filas2.terminator!=undefined && filas2.terminator!=null) terminator = '`'+filas2.terminator+'`';
      else terminator = '`OFF`';
      if(filas2 && filas2.rolinicial!=undefined && filas2.rolinicial!=null) rolinicial = '<@&'+filas2.rolinicial+'>';
      else rolinicial = '`OFF`';

      db_premium.get(`SELECT * FROM premium WHERE servidor = '${message.guild.id}'`, async (err, filas3) => {
        if(err) return console.log(err.message + ` ${message.content} ERROR #3 viendo la informacion del servidor`)
        let check_premium;

        if(filas3 && filas3.todo!=undefined && filas3.todo!=null && isNaN(filas3.todo)) check_premium = `Suscripción activa de por vida.`;
        else if(filas3 && filas3.todo!=undefined && filas3.todo!=null && !isNaN(filas3.todo)) check_premium = `Suscripción activa. Quedan ${T_convertor(parseInt(filas3.todo) - Date.now())} de suscripción.`;
        else check_premium = '`Sin suscripción`';

        let server = new Discord.MessageEmbed()
          .setTitle(":bar_chart: **DETALLES DEL SERVIDOR** :card_box:")
          .setColor("#ACC5FB")
          .setThumbnail(message.guild.iconURL())
          .setDescription(`:globe_with_meridians: **Servidor:** ${message.guild.name}\n`+
          `:1234: **ID:** ${message.guild.id}\n`+
          `:scroll: **Fundado el:** ${message.guild.createdAt.toLocaleDateString('es-ES')}\n`+
          `:inbox_tray: **¿Cuándo entraste?:** ${message.member.joinedAt.toLocaleDateString('es-ES')}\n`+
          `:abacus: **¿Cuántos somos?:** ${message.guild.memberCount}\n\n`+

          `:white_check_mark: **Verificación:** ${canal_check}\n`+
          `:inbox_tray: **Bienvenidas:** ${canal_bienvenida}\n`+
          `:outbox_tray: **Despedidas:** ${canal_despedida}\n`+
          `:mailbox_with_mail: **Registro:** ${canal_logs}\n`+
          `:anger: **Sanciones:** ${canal_sanciones}\n`+
          `:ticket: **Tickets:** ${canal_ticket}\n`+
          `:mailbox_with_mail: **Sugerencias:** ${canal_sugerencias}\n`+
          `:shopping_bags: **Ofertas:** ${canal_ofertas}\n`+
          `:newspaper: **Parches:** ${canal_parches}\n`+
          `:shushing_face: **Confesiones:** ${canal_confesiones}\n`+
          `:newspaper2: **Periodico:** ${canal_periodico}\n`+
          `:underage: **NSFW:** ${canal_nsfw}\n\n`+

          `:vibration_mode: **Anti-Flood:** ${antispam}\n`+
          `:face_with_symbols_over_mouth:  **Filtro de insultos:** ${palabrotas}\n`+
          `:door: **Filtro de invitaciones:** ${invitaciones}\n`+
          `:skull_crossbones: **Terminator:** ${terminator}\n`+
          `:label: **Rol de iniciación:** ${rolinicial}\n\n`+

          `:crown: **¿Premium?:** ${check_premium}`)
          .setFooter(`Este servidor se encuentra en el Shard nº${message.guild.shardID}`)
        return message.channel.send(server);
      });
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
