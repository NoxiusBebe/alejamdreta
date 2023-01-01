let guia = {
  "OWNER" : "Dueño del servidor",
  "ADMINISTRATOR" : "Administrador",
  "CREATE_INSTANT_INVITE" : "Crear invitación",
  "KICK_MEMBERS" : "Expulsar miembros",
  "BAN_MEMBERS" : "Banear miembros",
  "MANAGE_CHANNELS" : "Gestionar canales",
  "MANAGE_GUILD" : "Gestionar servidor",
  "ADD_REACTIONS" : "Añadir reacciones",
  "VIEW_AUDIT_LOG" : "Ver el registro de auditoría",
  "PRIORITY_SPEAKER" : "Prioridad de palabra",
  "STREAM" : "Video",
  "VIEW_CHANNEL" : "Ver canales",
  "SEND_MESSAGES" : "Enviar mensajes",
  "SEND_TTS_MESSAGES" : "Enviar mensajes de texto a voz",
  "MANAGE_MESSAGES" : "Gestionar mensajes",
  "EMBED_LINKS" : "Insertar enlaces",
  "ATTACH_FILES" : "Adjuntar archivos",
  "READ_MESSAGE_HISTORY" : "Leer el historial de mensajes",
  "MENTION_EVERYONE" : "Mencionar @everyone, @here y todos los roles",
  "USE_EXTERNAL_EMOJIS" : "Usar emojis externos",
  "CONNECT" : "Conectar",
  "SPEAK" : "Hablar",
  "MUTE_MEMBERS" : "Silenciar miembros",
  "DEAFEN_MEMBERS" : "Ensordecer miembros",
  "MOVE_MEMBERS" : "Mover miembros",
  "CHANGE_NICKNAME" : "Cambiar apodo",
  "MANAGE_NICKNAMES" : "Gestionar apodos",
  "MANAGE_ROLES" : "Gestionar roles",
  "MANAGE_WEBHOOKS" : "Gestionar webhooks",
  "MANAGE_EMOJIS" : "Gestionar emojis"
}

function convertir(perm_iniciales){
  let nuevos_permisos = {};
  for(var i in perm_iniciales) nuevos_permisos[guia[i]] = perm_iniciales[i];
  return nuevos_permisos;
}

module.exports = {convertir};
