console.log("CookieLab iniciado");

const TREINTA_DIAS = 30 * 24 * 60 * 60;

// ===================== FUNCIONES DE COOKIES =====================

function guardarCookie(nombre, valor, segundos = TREINTA_DIAS) {
    document.cookie = nombre + "=" + encodeURIComponent(valor) + "; max-age=" + segundos + "; path=/";
}

// document.cookie devuelve todas juntas ("a=1; b=2"), buscamos la que empieza por "nombre="
function leerCookie(nombre) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        if (cookie.startsWith(nombre + "=")) {
            return decodeURIComponent(cookie.substring(nombre.length + 1));
        }
    }
    return null;
}

const saludo = document.getElementById("saludo");

// ===================== FASE 1: PEDIR Y GUARDAR EL NOMBRE =====================

function pedirNombre() {
    const nombre = prompt("¡Hola! ¿Cómo te llamas?");
    if (nombre === null || nombre.trim() === "") {
        return null;
    }
    guardarCookie("usuario", nombre.trim());
    return nombre.trim();
}

// ===================== FASE 2: EL GUARD =====================

const usuario = leerCookie("usuario");

if (usuario === null) {
    // Primera visita: preguntamos y guardamos
    const nombre = pedirNombre();
    if (nombre) {
        alert("¡Bienvenido/a a CookieLab, " + nombre + "!");
        saludo.textContent = "Hola, " + nombre;
    } else {
        saludo.textContent = "Hola, visitante anónimo";
    }
} else {
    // Ya existe: no preguntamos nada
    saludo.textContent = "Hola de nuevo, " + usuario;
}
