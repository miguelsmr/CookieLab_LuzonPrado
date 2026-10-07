console.log("CookieLab iniciado");

// Duración de la cookie: 30 días (en segundos)
const TREINTA_DIAS = 30 * 24 * 60 * 60;

// Guardar: document.cookie = "clave=valor; max-age=segundos"
function guardarCookie(nombre, valor, segundos = TREINTA_DIAS) {
    document.cookie = nombre + "=" + encodeURIComponent(valor) + "; max-age=" + segundos + "; path=/";
}

// ===================== FASE 1: PEDIR Y GUARDAR EL NOMBRE =====================

const nombre = prompt("¡Hola! ¿Cómo te llamas?");

if (nombre !== null && nombre.trim() !== "") {
    guardarCookie("usuario", nombre.trim());
    alert("¡Bienvenido/a a CookieLab, " + nombre.trim() + "!");
}
