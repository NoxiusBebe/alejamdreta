/* ―――――――――――――――――――――――――――――――――――――――― */
/* ⇒ DECLARACION DE LIBRERIAS Y RECURSOS ⇐ */
/* ―――――――――――――――――――――――――――――――――――――――― */
const Discord = require('discord.js');
const client = new Discord.Client();
const {Client, MessageAttachment} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db_discordhunter = new sqlite3.Database("./memoria/db_discordhunter.sqlite");

let stop_farmear = new Set();

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

  let estructura = "__Forma de usar el comando:__ `" + client.config.prefijos[message.guild.id] + "dh.supervivencia`\n" + "```js\n" + "[] -> Obligatorio\n" + "() -> Opcional\n" + "{} -> Aclaración\n" + "```";

  let f_permisos_user = [];
  let f_permisos_bot = [];

  await comprobar_permisos_usuario(client, message);
  await comprobar_permisos_bot(client, message);

  let g_permisos_user = {};
  let g_permisos_bot = {};

  let conv_permisos = require(`../../../../permissions.js`)
  g_permisos_user = await conv_permisos.convertir(permisos_user)
  g_permisos_bot = await conv_permisos.convertir(permisos_bot)

  for(var i in g_permisos_user) f_permisos_user.push(`● **${i}** ➩ ${g_permisos_user[i]}`)
  for(var i in g_permisos_bot) f_permisos_bot.push(`● **${i}** ➩ ${g_permisos_bot[i]}`)
  

  if(message.guild.me.hasPermission("EMBED_LINKS")){
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n")).setColor(`#9262FF`))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(new Discord.MessageEmbed().setDescription(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n")).setColor(`#9262FF`))
  }
  else{
    for(var i in permisos_user) if(permisos_user[i]==="❌") return message.channel.send(`⛔ __**No tienes permisos suficientes**__ ⛔\n\n`+f_permisos_user.join("\n"))
    for(var i in permisos_bot) if(permisos_bot[i]==="❌") return message.channel.send(`⛔ __**No tengo permisos suficientes**__ ⛔\n\n`+f_permisos_bot.join("\n"))
  }

  db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${message.author.id}'`, async (err, filas) => {
    if(err) return console.log(err.message + ` ${message.content} ERROR #1 supervivencia de DH`)
    if(!filas) return message.channel.send(new Discord.MessageEmbed().setDescription(`:m: **NO TIENES NINGUNA CUENTA CREADA.**\nSi quieres empezar tu aventura, el comando es: **${client.config.prefijos[message.guild.id]}dh.crear**`).setColor(`#9262FF`))

    if(client.config.estado_supervivencia[message.guild.id] === 1) return message.channel.send(new Discord.MessageEmbed().setDescription(":confused: El modo **SUPERVIVENCIA** ya está activo.\n\nPara entrar a la particda, teclea: *`"+client.config.prefijos[message.guild.id]+"+dh.sup`*").setColor(`#9262FF`))
    if(filas.estado_supervivencia===1) return message.channel.send(new Discord.MessageEmbed().setDescription(":sunglasses: Ya estás participando en un modo **SUPERVIVENCIA**.\n\nCuando acabes, podrás apuntarte a otra").setColor(`#9262FF`))
    if(filas.vida<=0) return message.channel.send(new Discord.MessageEmbed().setDescription(`:head_bandage: **No tienes salud**\n\nCúrate en la tienda`).setColor(`#9262FF`))

    let bonificacion;
    if(message.guild.id===client.config.servidor_soporte) bonificacion = client.config.dh_plus;
    else bonificacion = 1;

    let escudo;
    if(filas.escudo===":x:") escudo = 0;
    if(filas.escudo==="Madera") escudo = 100;
    if(filas.escudo==="Acero") escudo = 500;
    if(filas.escudo==="Bronce") escudo = 1000;
    if(filas.escudo==="Plata") escudo = 6000;
    if(filas.escudo==="Oro") escudo = 20000;
    if(filas.escudo==="Platino") escudo = 50000;
    if(filas.escudo==="Diamante") escudo = 100000;
    if(filas.escudo==="Divina") escudo = 500000;

    let golpe;
    if(filas.arma===1) golpe = 50;
    if(filas.arma===2) golpe = 70;
    if(filas.arma===3) golpe = 120;
    if(filas.arma===4) golpe = 190;
    if(filas.arma===5) golpe = 240;
    if(filas.arma===6) golpe = 340;
    if(filas.arma===7) golpe = 400;
    if(filas.arma===8) golpe = 480;
    if(filas.arma===9) golpe = 600;
    if(filas.arma===10) golpe = 750;
    if(filas.arma===11) golpe = 900;
    if(filas.arma===12) golpe = 1150;
    if(filas.arma===13) golpe = 2500;
    if(filas.arma===14) golpe = 4500;
    if(filas.arma===15) golpe = 7000;
    if(filas.arma===16) golpe = 7000;
    if(filas.arma===17) golpe = 11000;
    if(filas.arma===18) golpe = 11000;
    if(filas.arma===19) golpe = 11000;
    if(filas.arma===20) golpe = 15000;
    if(filas.arma===21) golpe = 18000;
    if(filas.arma===22) golpe = 25000;
    if(filas.arma===23) golpe = 30000;
    if(filas.arma===24) golpe = 40000;
    if(filas.arma===25) golpe = 50000;

    db_discordhunter.run(`INSERT INTO supervivencia(id, vida, escudo, daño, usuario_1) VALUES('${message.guild.id}', ${filas.vida}, ${escudo}, ${golpe}, '${message.author.id}')`, async function(err) {
      if(err) return console.log(err.message + ` ${message.content} ERROR #2 supervivencia de DH`)
      client.config.estado_supervivencia[message.guild.id] = 1;
      client.config.ronda_supervivencia[message.guild.id] = 1;
      message.channel.send(new Discord.MessageEmbed().setDescription(`:chains: **MODO SUPERVIVENCIA INICIADO** :chains:\n\n- La recuperacion de vida está desactivada\n- La recuperacion de escudo está desactivada\n- El cambio de arma está desactivado\n\n**(Cualquier cambio de estos realizados a lo largo del modo supervivencia, no se reflejarán en la partida)**\n\n Todo aquel que quiera unirse, deberá teclear: **${client.config.prefijos[message.guild.id]}+dh.sup**\n\n Empezamos en 15 segundos...`).setColor(`#9262FF`))

      db_discordhunter.run(`UPDATE usuarios SET estado_supervivencia = 1 WHERE id = '${message.author.id}'`, function(err) {
        if(err) return console.log(err.message + ` ${message.content} ERROR #3 supervivencia de DH`)
      })

      let villano1 = 0;
      let villano2 = 0;
      let villano3 = 0;
      let villano4 = 0;
      let villano5 = 0;
      let villano6 = 0;
      let villano7 = 0;
      let villano8 = 0;
      let villano9 = 0;
      let villano10 = 0;

      let vidaenemigo = 0;
      let golpeenemigo = 0;
      let vidaenemigoT;

      let fase_niveles = setInterval(async function() {
        db_discordhunter.get(`SELECT * FROM supervivencia WHERE id = '${message.guild.id}'`, async (err, filas2) => {
          if(err) return console.log(err.message + ` ${message.content} ERROR #4 supervivencia de DH`)
          if(!filas2){
            clearInterval(fase_niveles)
            return;
          }
          let dañoaliado = filas2.daño;
          let vidaaliado = filas2.vida;
          let escudoaliado = filas2.escudo;
          // ----------------------------------------------------------------------------------------------
          if(client.config.ronda_supervivencia[message.guild.id]>=1) vidaenemigo = vidaenemigo+500, golpeenemigo = golpeenemigo+100, villano1++;
          if(client.config.ronda_supervivencia[message.guild.id]>=3) vidaenemigo = vidaenemigo+800, golpeenemigo = golpeenemigo+200, villano2++;
          if(client.config.ronda_supervivencia[message.guild.id]>=6) vidaenemigo = vidaenemigo+1200, golpeenemigo = golpeenemigo+320, villano3++;
          if(client.config.ronda_supervivencia[message.guild.id]>=9) vidaenemigo = vidaenemigo+1700, golpeenemigo = golpeenemigo+580, villano4++;
          if(client.config.ronda_supervivencia[message.guild.id]>=12) vidaenemigo = vidaenemigo+2300, golpeenemigo = golpeenemigo+850, villano5++;
          if(client.config.ronda_supervivencia[message.guild.id]>=15) vidaenemigo = vidaenemigo+3000, golpeenemigo = golpeenemigo+1300, villano6++;
          if(client.config.ronda_supervivencia[message.guild.id]>=18) vidaenemigo = vidaenemigo+6000, golpeenemigo = golpeenemigo+1800, villano7++;
          if(client.config.ronda_supervivencia[message.guild.id]>=21) vidaenemigo = vidaenemigo+10000, golpeenemigo = golpeenemigo+2000, villano8++;
          if(client.config.ronda_supervivencia[message.guild.id]>=24) vidaenemigo = vidaenemigo+15000, golpeenemigo = golpeenemigo+2800, villano9++;
          if(client.config.ronda_supervivencia[message.guild.id]>=27) vidaenemigo = vidaenemigo+30000, golpeenemigo = golpeenemigo+4000, villano10++;

          vidaenemigoT = vidaenemigo
          do{
            vidaenemigoT = vidaenemigoT-dañoaliado
            if(vidaenemigoT<=0){
              let servericon = message.guild.iconURL();
              let embed = new Discord.MessageEmbed()
                .setDescription(`**:white_check_mark: SUPERVIVENCIA (RONDA ${client.config.ronda_supervivencia[message.guild.id]}) :crossed_swords:**`)
                .setColor("#61ff8e")
                .setThumbnail(servericon)
                .addField('**Vida del equipo enemigo:**', 0, true)
                .addField('**Daño del equipo enemigo:**', golpeenemigo, true)
                .addField("**----------------------------------**", "---------------------------------")
                .addField("Nivel 1: ", `${villano1} enemigos`, true)
                .addField("Nivel 2: ", `${villano2} enemigos`, true)
                .addField("Nivel 3: ", `${villano3} enemigos`, true)
                .addField("Nivel 4: ", `${villano4} enemigos`, true)
                .addField("Nivel 5: ", `${villano5} enemigos`, true)
                .addField("Nivel 6: ", `${villano6} enemigos`, true)
                .addField("Nivel 7: ", `${villano7} enemigos`, true)
                .addField("Nivel 8: ", `${villano8} enemigos`, true)
                .addField("Nivel 9: ", `${villano9} enemigos`, true)
                .addField("Nivel 10: ", `${villano10} enemigos`, true)
                .addField("**----------------------------------**", "---------------------------------")
                .addField('**Vida equipo:** ', vidaaliado.toFixed(2), true)
                .addField('**Escudo equipo:** ', escudoaliado.toFixed(2), true)
                .addField('**Daño equipo:** ', dañoaliado, true);
              await message.channel.send(embed)
              client.config.ronda_supervivencia[message.guild.id] = client.config.ronda_supervivencia[message.guild.id]+1;
              db_discordhunter.run(`UPDATE supervivencia SET vida = ${vidaaliado}, escudo = ${escudoaliado} WHERE id = '${message.guild.id}'`, function(err) {
                if(err) return console.log(err.message + ` ${message.content} ERROR #5 supervivencia de DH`)
                setTimeout(async function() { message.channel.send(`**:small_red_triangle_down: INICIANDO SIGUIENTE RONDA ...**`) }, 1500);
              })
            }
            else{
              if(escudoaliado<=0){
                escudoaliado = 0
                vidaaliado = vidaaliado - golpeenemigo;
                if(vidaaliado<=0){
                  let ronda_alcanzada = client.config.ronda_supervivencia[message.guild.id];
                  let servericon = message.guild.iconURL();
                  let embed = new Discord.MessageEmbed()
                    .setDescription(`**:no_entry: SUPERVIVENCIA (RONDA ${client.config.ronda_supervivencia[message.guild.id]}) :crossed_swords:**`)
                    .setColor("#ff6161")
                    .setThumbnail(servericon)
                    .addField('**Vida del equipo enemigo:**', vidaenemigoT, true)
                    .addField('**Daño del equipo enemigo:**', golpeenemigo, true)
                    .addField("**----------------------------------**", "---------------------------------")
                    .addField("Nivel 1: ", `${villano1} enemigos`, true)
                    .addField("Nivel 2: ", `${villano2} enemigos`, true)
                    .addField("Nivel 3: ", `${villano3} enemigos`, true)
                    .addField("Nivel 4: ", `${villano4} enemigos`, true)
                    .addField("Nivel 5: ", `${villano5} enemigos`, true)
                    .addField("Nivel 6: ", `${villano6} enemigos`, true)
                    .addField("Nivel 7: ", `${villano7} enemigos`, true)
                    .addField("Nivel 8: ", `${villano8} enemigos`, true)
                    .addField("Nivel 9: ", `${villano9} enemigos`, true)
                    .addField("Nivel 10: ", `${villano10} enemigos`, true)
                    .addField("**----------------------------------**", "---------------------------------")
                    .addField('**Vida equipo:** ', 0, true)
                    .addField('**Escudo equipo:** ', 0, true)
                    .addField('**Daño equipo:** ', dañoaliado, true);
                  await message.channel.send(embed);
                  client.config.estado_supervivencia[message.guild.id] = 0;
                  clearInterval(fase_niveles)
                  setTimeout(async function() {
                    message.channel.send(`**HASTA AQUI VUESTRA SUPERVIVENCIA :skull_crossbones:**\n\n**Vuestra recompensa será añadida.**`)
                    for(var i=1 ; i<=1800 ; i++){
                      if(filas2[`usuario_${i}`] && (filas2[`usuario_${i}`]!=null || filas2[`usuario_${i}`]!=undefined)){
                        await recompensa_supervivencia(filas2[`usuario_${i}`], client.config.ronda_supervivencia[message.guild.id], bonificacion)
                      }
                    }
                    db_discordhunter.run(`DELETE FROM supervivencia WHERE id = '${message.guild.id}'`, function(err) {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #6 supervivencia de DH`)
                    })

                    db_discordhunter.get(`SELECT * FROM ranking WHERE id = '${message.guild.id}'`, (err, filas3) => {
                      if(err) return console.log(err.message + ` ${message.content} ERROR #7 supervivencia de DH`)
                      if(filas3){
                        if(filas3.ronda < ronda_alcanzada){
                          db_discordhunter.run(`UPDATE ranking SET ronda = ${ronda_alcanzada}, nombre = '${message.guild.name}' WHERE id = '${message.guild.id}'`, function(err) {
                            if(err) return console.log(err.message + ` ${message.content} ERROR #8 supervivencia de DH`)
                          })
                        }
                      }
                      else{
                        db_discordhunter.run(`INSERT INTO ranking(id, ronda, nombre) VALUES('${message.guild.id}', ${ronda_alcanzada}, '${message.guild.name}')`, function(err) {
                          if(err) return console.log(err.message + ` ${message.content} ERROR #9 supervivencia de DH`)
                        })
                      }
                    })
                    clearInterval(fase_niveles)
                    client.config.estado_supervivencia[message.guild.id] = 0;
                    return;
                  }, 1500);
                }
              }
              else{
                escudoaliado = escudoaliado - golpeenemigo
                if(escudoaliado<=0) escudoaliado = 0;
              }
            }
          }while(vidaaliado>0 && vidaenemigoT>0);
        });
      }, 15000)
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

function recompensa_supervivencia(usuario, ronda, bonificacion){
  db_discordhunter.get(`SELECT * FROM usuarios WHERE id = '${usuario}'`, async (err, filas) => {
    if(err) return;
    if(!filas) return
    db_discordhunter.run(`UPDATE usuarios SET coins = ${filas.coins+(ronda*1000*bonificacion)}, xp = ${filas.xp+(ronda*100*bonificacion)}, estado_supervivencia = 0 WHERE id = '${usuario}'`, function(err) {
      if(err) return;
    })
  })
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------
// * ADAPTAR: SI
// * MEJORAR: SI
