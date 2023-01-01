/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db_valoraciones = new sqlite3.Database("./memoria/db_valoraciones.sqlite");

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "bot`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  db_valoraciones.all(`SELECT * FROM usuarios`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 sacando datos del bot`);
    let varB = 0;
    let varT = 0;
    let total;
    if(!filas) total = 0;
    if(filas){
      for(var i=0 ; i<filas.length ; i++){
        if(filas[i].valor==="+") varB++;
        varT++;
      }
      total = (parseFloat((varB * 100) / (varT))).toFixed(2);
    }

    const res1 = await client.shard.fetchClientValues('guilds.cache.size');
    const res2 = await client.shard.broadcastEval('this.guilds.cache.map((guild) => guild.memberCount)');

    var servidores_totales = 0;
    var usuarios_totales = 0;

    for(var i=0 ; i<res1.length ; i++){
      servidores_totales += res1[i];
    }
    for(var i=0 ; i<res2.length ; i++){
      for(var j=0 ; j<res2[i].length ; j++){
        usuarios_totales += res2[i][j];
      }
    }

    let embed = new Discord.MessageEmbed()
      .setTitle(":white_flower: **¿QUIÉN SOY YO?** :man_detective:")
      .setDescription(`Me llamo **Alejandreta**, y soy un BOT multiusos capaz de multitud de cosas. Algunas son mas útiles, y otras no tanto. Pero lo importante es que sea capaz de haceros el día a día en vuestro servidor mucho mas sencillo y divertido.`)
      .setColor("#ACC5FB")
      .setThumbnail(client.user.displayAvatarURL())
      .addField(":vibration_mode: Mi ping actual: ", Math.floor(client.ws.ping), true)
      .addField(":bearded_person: Creada por: ", "ExpErgio#1253", true)
      .addField(":gear: Comandos: ", `${client.config.prefijos[message.guild.id]}ayuda`, true)
      .addField(":egg: Fui creada: ", client.user.createdAt.toLocaleDateString('es-ES'), true)
      .addField(":desktop: Mi servidor: ", `[Haz click aqui](https://discord.gg/Hx8CZnURed)`, true)
      .addField(":revolving_hearts: Valoración: ", `${total}/100`, true)
      .addField(":ballot_box: Votos: ", varT, true)
      .addField(":card_box: Servidores: ", servidores_totales, true)
      .addField(":busts_in_silhouette: Usuarios: ", usuarios_totales, true)
      .addField(":globe_with_meridians: Invitación: ", "[Haz click aqui](https://discordapp.com/oauth2/authorize?&client_id=822947682669559829&permissions=8&scope=bot)", true)
      .addField(":link: Página web: ", "[Haz click aqui](https://alejandretabot.webnode.es/)", true)
      .setTimestamp();
    message.channel.send(embed);

    /*
    const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
      client.shard.fetchClientValues('guilds.memberCount'),
      client.shard.broadcastEval('this.guilds.memberCount'),
      client.shard.broadcastEval('this.guilds.cache.get(g => g.memberCount)'),
      client.shard.broadcastEval('this.guilds.cache.map((guild) => guild.memberCount)'),
		];

		return Promise.all(promises)
			.then(results => {
				const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
				const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
				console.log(`Server count: ${totalGuilds}\nMember count: ${totalMembers}`);
        console.log("- - - - - - - - - -")
        console.log(results[2])
        console.log("- - - - - - - - - -")
        console.log(results[3])
        console.log("- - - - - - - - - -")
        console.log(results[4])
        console.log("- - - - - - - - - -")
        console.log(results[5])
			})
			.catch(console.error);
      */
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
