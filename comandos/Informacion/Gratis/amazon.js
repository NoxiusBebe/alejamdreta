/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();

client.request = new (require("rss-parser"))();

const parser = require('fast-xml-parser');
const he = require('he');

const options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr",
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata",
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false,
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),
    tagValueProcessor : (val, tagName) => he.decode(val),
    stopNodes: ["parse-me-as-string"]
};

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const amazonScraper = require('amazon-buddy');
const BitlyClient = require('bitly').BitlyClient;
const amazonPaapi = require('amazon-paapi');

let product_by_asin=[];
let url_amazon;
let imagen_amazon;
let producto_amazon;
let prime_amazon;
let review_amazon;
let asin = [];
let embed_x;
let precio_amazon;
let url_amazon_larga;

const apis_bitly = require("../../../archivos/Documentos/Amazon/codigos.json")
var iapibitly=0;
var bitly;
var numero_apis = apis_bitly.length;

const commonParameters = {
    'AccessKey' : 'AKIAJTHCQ5NUZMDDQADA',
    'SecretKey' : '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',
    'PartnerTag' : 'alejandretadiscord-21',
    'PartnerType': 'Associates',
    'Marketplace': 'www.amazon.es'
};

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "amazon [nombre del producto]`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

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

  let producto = args.join(" ")
  if(!message.channel.nsfw) return message.channel.send(new Discord.MessageEmbed().setDescription(`**Este comando solo puede usarse en canales marcados como NSFW**`).setColor(`#ACC5FB`))
  if(!producto) return message.channel.send(new Discord.MessageEmbed().setDescription(`:gift: **¿Sabes lo que quieres comprar?**\n\n${estructura}`).setColor(`#ACC5FB`))
  message.channel.send(new Discord.MessageEmbed().setDescription(`:mag_right: **Buscando:** ${producto}`).setColor(`#ACC5FB`)).then(m => m.delete({ timeout: 3000}))
  const producto_busqueda = await amazonScraper.products({ keyword: producto, number: 1, country: 'ES' });
  if(producto_busqueda.totalProducts===0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pensive: **No he encontrado nada. Lo siento mucho mucho mucho...**`).setColor(`#ACC5FB`))
  asin = producto_busqueda.result[0].asin;
  if(!asin || asin===undefined || asin===null) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pensive: **No he encontrado nada. Lo siento mucho mucho mucho...**`).setColor(`#ACC5FB`))
  async function scraper(asin){
  try{
    const product_by_asin = await amazonScraper.asin({ asin: asin, country:'ES' });
    producto_amazon = product_by_asin['result'][0]['title'];
    precio_amazon = product_by_asin['result'][0]['price']['current_price'] + ' €';
    imagen_amazon = product_by_asin['result'][0]['main_image'];
    review_amazon = product_by_asin['result'][0]['reviews']['rating'];
    if(review_amazon != 0){
      review_amazon = review_amazon.replace(",",".");
      review_amazon = review_amazon;}
      prime_amazon = product_by_asin['result'][0]['badges']['amazon_prime'];
      url_amazon_larga = product_by_asin['result'][0]['url']+'?tag=alejandretadiscord-21&linkCode=ogi&th=1&psc=1';
      url_amazon = url_amazon_larga;
      if (prime_amazon == true) prime_amazon = 'Disponible';
      else prime_amazon = 'No Disponible'
      try{
        if(review_amazon>=0 && review_amazon<0.5) review_amazon = `No hay reviews aun`;
        if(review_amazon>=0.5 && review_amazon<1.5) review_amazon = `⭐ - ${review_amazon}`;
        if(review_amazon>=1.5 && review_amazon<2.5) review_amazon = `⭐ ⭐ - ${review_amazon}`;
        if(review_amazon>=2.5 && review_amazon<3.5) review_amazon = `⭐ ⭐ ⭐ - ${review_amazon}`;
        if(review_amazon>=3.5 && review_amazon<4.5) review_amazon = `⭐ ⭐ ⭐ ⭐ - ${review_amazon}`;
        if(review_amazon>=4.5) review_amazon = `⭐ ⭐ ⭐ ⭐ ⭐ - ${review_amazon}`;
      }catch(error){review_amazon = `No disponible`;}
      rotarbitly().then(check()).then(function(result){
        setTimeout(function(){
          if(producto_amazon === undefined) return message.channel.send(new Discord.MessageEmbed().setDescription(`:pensive: **No he encontrado nada. Lo siento mucho mucho mucho...**`).setColor(`#ACC5FB`))
          if(precio_amazon === undefined) precio_amazon = '-';
          embed_x = new Discord.MessageEmbed()
            .setAuthor(`${producto_amazon.slice(0, 90)}...`, `https://cdn.discordapp.com/attachments/523268901719769088/754735059214532789/dwdwdw.png`)
            .addField(`**Precio:**`, `${precio_amazon}`, true)
            .addField(`**Envío PRIME:**`, `${prime_amazon}`, true)
            .addField(`**Enlace:**`, `${url_amazon}`, true)
            .setColor(`#ffb900`)
            .setImage(`${imagen_amazon}`)
            .setFooter(`Valoracion: ${review_amazon}   ||   Mas informacion: ${client.config.prefijos[message.guild.id]}info.amazon`);
          producto_amazon = undefined;
          precio_amazon = undefined;
          imagen_amazon = undefined;
          review_amazon = undefined;
          prime_amazon = undefined;
          url_amazon = undefined;
          return message.channel.send(embed_x);
        },1000);
      }).catch(function(error) {});
    }catch(error){
      if(error instanceof TypeError){
        check().then(function(result) {
        setTimeout(async function(){
          if(url_amazon != undefined) url_amazon = await rotarbitly()
            embed_x = new Discord.MessageEmbed()
              .setAuthor(`${producto_amazon.slice(0, 90)}...`, `https://cdn.discordapp.com/attachments/523268901719769088/754735059214532789/dwdwdw.png`)
              .addField(`**Precio:**`, `${precio_amazon}`, true)
              .addField(`**Envío PRIME:**`, `${prime_amazon}`, true)
              .addField(`**Enlace:**`, `${url_amazon}`, true)
              .setColor(`#ffb900`)
              .setImage(`${imagen_amazon}`)
              .setFooter(`Valoracion: ${review_amazon}   ||   Mas informacion: ${client.config.prefijos[message.guild.id]}info.amazon`);
            producto_amazon = undefined;
            precio_amazon = undefined;
            imagen_amazon = undefined;
            review_amazon = undefined;
            prime_amazon = undefined;
            url_amazon = undefined;
            message.channel.send(embed_x);
          },1000);
        })
      }
    }
  };
  scraper(asin);
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

async function rotarbitly(){
  if(url_amazon != undefined){
    try{
      bitly = new BitlyClient(apis_bitly[iapibitly]);
      result = await bitly.shorten(url_amazon);
      url_amazon = result.link;
      return url_amazon;
    }catch(error){
      if(iapibitly < numero_apis){
      iapibitly = iapibitly+1
      rotarbitly()
      }
      if(iapibitly >= numero_apis){
        iapibitly = 0
        rotarbitly()
};};};};
async function check(){
  if(precio_amazon === '0 €' || precio_amazon === undefined){
    const requestParameters = {
      'ItemIds' : [asin],
      'ItemIdType': 'ASIN',
      'Resources' : [
        'Images.Primary.Large',
        'ItemInfo.Title',
        'Offers.Listings.DeliveryInfo.IsPrimeEligible',
        'Offers.Listings.Price'
    ]};
    amazonPaapi.GetItems(commonParameters, requestParameters).then(data => {
      precio_amazon = data.ItemsResult.Items[0].Offers.Listings[0].Price.Amount+' €';
      prime_amazon = data.ItemsResult.Items[0].Offers.Listings[0].DeliveryInfo.IsPrimeEligible;
      url_amazon = data.ItemsResult.Items[0].DetailPageURL
      imagen_amazon = data.ItemsResult.Items[0].Images.Primary.Large.URL
      producto_amazon = data.ItemsResult.Items[0].ItemInfo.Title.DisplayValue;
      if(review_amazon == undefined) review_amazon = 'No hay reviews aun';
      if(prime_amazon == true) prime_amazon = 'Disponible';
      else prime_amazon = 'No Disponible';
    }).catch(error => {});
  }
  else return precio_amazon,url_amazon,imagen_amazon,producto_amazon,prime_amazon,review_amazon;
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
