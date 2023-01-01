/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

const {Client, MessageAttachment, Util} = require('discord.js');

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "canales`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  if(!message.guild) return message.channel.send(new Discord.MessageEmbed().setDescription(`:rolling_eyes: Tan solo puedo ver este canal`).setColor(`#ACC5FB`))
  let text = "";
  let member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[1]) ||
    message.guild.members.cache.find(m => m.nickname === args.slice(1).join(" ")) ||
    message.guild.members.cache.find(m => m.user.tag === args.slice(1).join(" ")) ||
    message.guild.members.cache.find(m => m.user.username === args.slice(1).join(" "));
  let col;
  if(member) col = message.guild.channels.cache.filter(c => c.type === "category" ? (c.children.some(r => r.permissionsFor(member).has("VIEW_CHANNEL"))) : (c.permissionsFor(member).has("VIEW_CHANNEL")));
  else{
    member = message.member;
    if(args[1]) member = await message.guild.members.fetch(args[1]).catch(err => {});
    if(member) col = message.guild.channels.cache.filter(c => c.type === "category" ? (c.children.some(r => r.permissionsFor(member).has("VIEW_CHANNEL"))) : (c.permissionsFor(member).has("VIEW_CHANNEL")));
    else col = message.guild.channels.cache;
  }
  const wocat = Util.discordSort(col.filter(c => !c.parent && c.type !== "category"))
  const textnp = wocat.filter(c => ['text', 'store', 'news'].includes(c.type));
  const voicenp = wocat.filter(c => c.type === "voice");
  if(wocat.size >= 1) {
    text += textnp.map(advancedmap).join("\n");
    text += voicenp.map(advancedmap).join("\n");
  };
  let cats = Util.discordSort(col.filter(c => c.type === "category"));
  cats.each(c => {
    const children = c.children.intersect(col);
    const textp = children.filter(c => ['text', 'store', 'news'].includes(c.type));
    const voicep = children.filter(c => c.type === "voice");
    text += "\n[📂] " + c.name;
    text += textp.size ? ("\n\t" + Util.discordSort(textp).map(advancedmap).join("\n\t")) : ""
    text += voicep.size ? ("\n\t" + Util.discordSort(voicep).map(advancedmap).join("\n\t")) : ""
  })
  const split = Util.splitMessage(text)
  for (let i in split) await message.channel.send("\nLista de canales de: " + message.guild.name + (member ? (" || Para " + member.user.tag) : ""), { code: split[i] })
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

function advancedmap(c) {
        let r = "";
        switch(c.type) {
          case "news":
          case "text":
            r += "[📃] " + c.name;
            break;
          case "voice":
            r += "[🎙] " + c.name + (c.members.size ? (c.members.map(d => {
              if(d.user.bot) {
                return "\n\t\t[🤖] " + d.user.tag;
              } else {
                return "\n\t\t[🙎] " + d.user.tag;
              }
            })).join("") : "")
            break;
          case "store":
            r += "[🏪] " + c.name;
            break;
          default:
            r += "[?] " + c.name;
            break;
        }
        return r;
  }

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
