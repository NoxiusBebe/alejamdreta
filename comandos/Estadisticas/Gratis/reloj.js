/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageMenuOption, MessageMenu } = require("discord-buttons")

const sqlite3 = require('sqlite3').verbose();
const db_relojes = new sqlite3.Database("./memoria/db_relojes.sqlite");

let cooldown_reloj = new Set();

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ PERMISOS NECESARIOS (USUARIO Y BOT) ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
let permisos_user = {
  "SEND_MESSAGES": "✅",
  "MANAGE_GUILD": "✅"
}
let permisos_bot = {
  "SEND_MESSAGES": "✅",
  "EMBED_LINKS": "✅",
  "MANAGE_CHANNEL": "✅"
}

/* ―――――――――――――――――――――――――― */
/* ⇒ EJECUCION DEL COMANDO ⇐ */
/* ―――――――――――――――――――――――――― */
module.exports = async (client, message, args) => {
  if(message.author.bot) return;

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "reloj [nombre del país]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#477DEC`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#477DEC`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  if(cooldown_reloj.has(message.guild.id)) return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ **Debes esperar 1 día para usar esto de nuevo** ⛔`).setColor(`#477DEC`)).then(m => m.delete({ timeout: 8000}))

  if(!args.join(" ")) return message.channel.send(new Discord.MessageEmbed().setDescription(`:checkered_flag: **Debes decirme el nombre de tu país**\n\n${estructura}`).setColor(`#477DEC`))

  cooldown_reloj.add(message.guild.id);
  setTimeout(() => { cooldown_reloj.delete(message.guild.id); }, 86400000);

  var tiempo = new Date();
  var horas = parseInt(tiempo.getUTCHours());
  var minutos = parseInt(tiempo.getUTCMinutes());
  var segundos = parseInt(tiempo.getUTCSeconds());

  let cant_horas = [];
  for(var i=-11 ; i<14 ; i++){
    if(horas+i >= 24) cant_horas.push(horas-24+i)
    else if(horas+i < 0) cant_horas.push(horas+24+i)
    else cant_horas.push(horas+i)
  }

  for(var i=0 ; i<cant_horas.length ; i++) cant_horas[i] = cant_horas[i].length < 2 ? "0" + cant_horas[i] : cant_horas[i];
  minutos = minutos.length < 2 ? "0" + minutos : minutos;
  segundos = segundos.length < 2 ? "0" + segundos : segundos;

  let embed_principal = new Discord.MessageEmbed().setDescription(`**Bienvenido a tu reloj de Discord**\nAntes de empezar, comprueba la franja horaria de **${args.join(" ")}**. La necesitarás para usar este comando.`).setColor(`#477DEC`)

  let menu = new MessageMenu()
    .setID("franja-horaria")
    .setPlaceholder(`⌛ Elije una franja horaria`)
    .addOption(new MessageMenuOption().setValue(-11).setLabel("GMT-11").setDescription(`${cant_horas[0]}:${minutos}:${segundos}`).setEmoji("🕐"))
    .addOption(new MessageMenuOption().setValue(-10).setLabel("GMT-10").setDescription(`${cant_horas[1]}:${minutos}:${segundos}`).setEmoji("🕑"))
    .addOption(new MessageMenuOption().setValue(-9).setLabel("GMT-09").setDescription(`${cant_horas[2]}:${minutos}:${segundos}`).setEmoji("🕒"))
    .addOption(new MessageMenuOption().setValue(-8).setLabel("GMT-08").setDescription(`${cant_horas[3]}:${minutos}:${segundos}`).setEmoji("🕓"))
    .addOption(new MessageMenuOption().setValue(-7).setLabel("GMT-07").setDescription(`${cant_horas[4]}:${minutos}:${segundos}`).setEmoji("🕔"))
    .addOption(new MessageMenuOption().setValue(-6).setLabel("GMT-06").setDescription(`${cant_horas[5]}:${minutos}:${segundos}`).setEmoji("🕕"))
    .addOption(new MessageMenuOption().setValue(-5).setLabel("GMT-05").setDescription(`${cant_horas[6]}:${minutos}:${segundos}`).setEmoji("🕖"))
    .addOption(new MessageMenuOption().setValue(-4).setLabel("GMT-04").setDescription(`${cant_horas[7]}:${minutos}:${segundos}`).setEmoji("🕗"))
    .addOption(new MessageMenuOption().setValue(-3).setLabel("GMT-03").setDescription(`${cant_horas[8]}:${minutos}:${segundos}`).setEmoji("🕘"))
    .addOption(new MessageMenuOption().setValue(-2).setLabel("GMT-02").setDescription(`${cant_horas[9]}:${minutos}:${segundos}`).setEmoji("🕙"))
    .addOption(new MessageMenuOption().setValue(-1).setLabel("GMT-01").setDescription(`${cant_horas[10]}:${minutos}:${segundos}`).setEmoji("🕚"))
    .addOption(new MessageMenuOption().setValue(0).setLabel("GMT+00").setDescription(`${cant_horas[11]}:${minutos}:${segundos}`).setEmoji("🕛"))
    .addOption(new MessageMenuOption().setValue(1).setLabel("GMT+01").setDescription(`${cant_horas[12]}:${minutos}:${segundos}`).setEmoji("🕐"))
    .addOption(new MessageMenuOption().setValue(2).setLabel("GMT+02").setDescription(`${cant_horas[13]}:${minutos}:${segundos}`).setEmoji("🕑"))
    .addOption(new MessageMenuOption().setValue(3).setLabel("GMT+03").setDescription(`${cant_horas[14]}:${minutos}:${segundos}`).setEmoji("🕒"))
    .addOption(new MessageMenuOption().setValue(4).setLabel("GMT+04").setDescription(`${cant_horas[15]}:${minutos}:${segundos}`).setEmoji("🕓"))
    .addOption(new MessageMenuOption().setValue(5).setLabel("GMT+05").setDescription(`${cant_horas[16]}:${minutos}:${segundos}`).setEmoji("🕔"))
    .addOption(new MessageMenuOption().setValue(6).setLabel("GMT+06").setDescription(`${cant_horas[17]}:${minutos}:${segundos}`).setEmoji("🕕"))
    .addOption(new MessageMenuOption().setValue(7).setLabel("GMT+07").setDescription(`${cant_horas[18]}:${minutos}:${segundos}`).setEmoji("🕖"))
    .addOption(new MessageMenuOption().setValue(8).setLabel("GMT+08").setDescription(`${cant_horas[19]}:${minutos}:${segundos}`).setEmoji("🕗"))
    .addOption(new MessageMenuOption().setValue(9).setLabel("GMT+09").setDescription(`${cant_horas[20]}:${minutos}:${segundos}`).setEmoji("🕘"))
    .addOption(new MessageMenuOption().setValue(10).setLabel("GMT+10").setDescription(`${cant_horas[21]}:${minutos}:${segundos}`).setEmoji("🕙"))
    .addOption(new MessageMenuOption().setValue(11).setLabel("GMT+11").setDescription(`${cant_horas[22]}:${minutos}:${segundos}`).setEmoji("🕚"))
    .addOption(new MessageMenuOption().setValue(12).setLabel("GMT+12").setDescription(`${cant_horas[23]}:${minutos}:${segundos}`).setEmoji("🕛"))
    .addOption(new MessageMenuOption().setValue(13).setLabel("GMT+13").setDescription(`${cant_horas[24]}:${minutos}:${segundos}`).setEmoji("🕐"))
    .setMaxValues(1)
    .setMinValues(1);

  let msg = await message.channel.send(embed_principal, menu.toJSON())

  const filter = (menu) => menu.clicker.id === message.author.id;
  const collector = msg.createMenuCollector(filter, {time: 30000})

  collector.on('collect', async (menu) => {
    collector.stop();

    var diferencia = parseInt(menu.values[0]);
    horas = horas+diferencia;
    if(horas<0) horas = horas+24;
    else if(horas>=24) horas = horas-24;

    horas = horas.toString();
    minutos = minutos.toString();
    segundos = segundos.toString();

    horas = horas.length < 2 ? "0" + horas : horas;
    minutos = minutos.length < 2 ? "0" + minutos : minutos;
    segundos = segundos.length < 2 ? "0" + segundos : segundos;

    let canal = await message.guild.channels.create(`⏰ ${args.join(" ")}: ${horas}:${minutos}:${segundos}`, { type: 'voice' });
    db_relojes.get(`SELECT * FROM relojes WHERE servidor = '${message.guild.id}'`, async (err, filas) => {
      if(err) return console.log(err.message + ` ${message.content} ERROR #1 comando "reloj" => ${message.content}`)

      if(filas) try{message.guild.channels.resolve(filas.canal).delete()}catch(err){};

      let sentencia;
      if(!filas) sentencia = `INSERT INTO relojes(servidor, canal, franja, pais) VALUES('${message.guild.id}', '${canal.id}', ${diferencia}, '${args.join(" ")}')`;
      else sentencia = `UPDATE relojes SET canal = '${canal.id}', franja = '${diferencia}', pais = '${args.join(" ")}' WHERE servidor = '${message.guild.id}'`;

      db_relojes.run(sentencia, async function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #2 comando "reloj" => ${message.content}`)
        menu.reply.defer()
        return msg.edit(new Discord.MessageEmbed().setDescription(`✅ **Tu reloj ha sido creado con éxito** :clock130:`).setColor(`#477DEC`).setFooter(`Ten en cuenta que este canal se actualizará cada 10 ~ 15 minutos`));
      })
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

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
