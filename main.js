/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
require('discord-buttons')(client);

let { readdirSync } = require('fs');

client.config = require('./config.js');
client.comandos = new Discord.Collection();

/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ EJECUCION DE LOS COMANDOS GRATUITOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
for(const file of readdirSync('./comandos/Ayuda/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Ayuda/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}

for(const file of readdirSync('./comandos/Acciones/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Acciones/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Administrador/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Administrador/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Audio/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Audio/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Casino/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Casino/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Config.Canales/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Config.Canales/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Config.Roles/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Config.Roles/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Config.Servidor/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Config.Servidor/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Estadisticas/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Estadisticas/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Guarderia/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Guarderia/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Informacion/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Informacion/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Juegos/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Juegos/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Listas/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Listas/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Memes/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Memes/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Niveles/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Niveles/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Pokemon/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Pokemon/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Social/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Social/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Utilidad/Gratis/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Utilidad/Gratis/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}

for(const file of readdirSync('./comandos/Discord Hunter/Gratis/Prestigio 1/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Discord Hunter/Gratis/Prestigio 1/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Discord Hunter/Gratis/Prestigio 2/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Discord Hunter/Gratis/Prestigio 2/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Discord Hunter/Gratis/Prestigio 3/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Discord Hunter/Gratis/Prestigio 3/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}

/* ―――――――――――――――――――――――――――――――――――――― */
/* ⇒ EJECUCION DE LOS COMANDOS PREMIUM ⇐ */
/* ―――――――――――――――――――――――――――――――――――――― */

for(const file of readdirSync('./comandos/Administrador/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Administrador/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Audio/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Audio/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Casino/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Casino/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Config.Canales/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Config.Canales/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Config.Roles/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Config.Roles/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Config.Servidor/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Config.Servidor/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Estadisticas/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Estadisticas/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Guarderia/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Guarderia/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Informacion/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Informacion/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Juegos/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Juegos/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Listas/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Listas/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Memes/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Memes/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Niveles/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Niveles/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Pokemon/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Pokemon/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Social/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Social/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Utilidad/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Utilidad/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}

for(const file of readdirSync('./comandos/Discord Hunter/Premium/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Discord Hunter/Premium/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}

for(const file of readdirSync('./comandos/Tematicos/Carnaval/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Tematicos/Carnaval/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Tematicos/Halloween/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Tematicos/Halloween/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Tematicos/Navidad/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Tematicos/Navidad/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Tematicos/Pascua/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Tematicos/Pascua/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Tematicos/San Valentin/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Tematicos/San Valentin/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}
for(const file of readdirSync('./comandos/Tematicos/Verano/')){
  if(file.endsWith(".js")) {
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./comandos/Tematicos/Verano/${file}`);
    client.comandos.set(fileName, fileContents);
  }
}

/* ――――――――――――――――――――――――――――― */
/* ⇒ EJECUCION DE LOS EVENTOS ⇐ */
/* ――――――――――――――――――――――――――――― */
for(const file of readdirSync('./eventos/')){
  if(file.endsWith(".js")){
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./eventos/${file}`);
    client.on(fileName, fileContents.bind(null, client));
    delete require.cache[require.resolve(`./eventos/${file}`)];
  }
}
for(const file of readdirSync('./eventos/message-automatas/')){
  if(file.endsWith(".js")){
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./eventos/message-automatas/${file}`);
    client.on(fileName, fileContents.bind(null, client));
    delete require.cache[require.resolve(`./eventos/message-automatas/${file}`)];
  }
}
for(const file of readdirSync('./eventos/message-comandos/')){
  if(file.endsWith(".js")){
    let fileName = file.substring(0, file.length - 3);
    let fileContents = require(`./eventos/message-comandos/${file}`);
    client.on(fileName, fileContents.bind(null, client));
    delete require.cache[require.resolve(`./eventos/message-comandos/${file}`)];
  }
}

/* ―――――――――――――――――――――――――――――― */
/* ⇒ INICIO DE ALEJANDRETA 3.0 ⇐ */
/* ―――――――――――――――――――――――――――――― */
client.login(client.config.token).catch(err => {
  console.error(`﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎`);
  console.error(`⌧   Error al iniciar sesion   ⌧`);
  console.error(`﹊﹊﹊﹊﹊﹊﹊﹊﹊﹊﹊﹊﹊﹊﹊﹊﹊﹊`);
  console.error(err)
});
