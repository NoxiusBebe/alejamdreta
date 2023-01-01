/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const { ShardingManager } = require('discord.js');

client.config = require('./config.js');
const manager = new ShardingManager('./main.js', { token: client.config.token });

/* ―――――――――――――――――――――――――――― */
/* ⇒ EJECUCION DE LOS SHARDS ⇐ */
/* ―――――――――――――――――――――――――――― */
let decoracion_ar = "═════════════════";
let decoracion_ab = "═════════════════";

manager.spawn();
manager.on('shardCreate', shard => {
  if((shard.id%10)===0) decoracion_ab=decoracion_ab+"═", decoracion_ar=decoracion_ab;
  console.log(`╔`+decoracion_ar+`╗`);
  console.log(`║Cargando shard nº${shard.id}║`);
  console.log(`╚`+decoracion_ab+`╝`);
})
