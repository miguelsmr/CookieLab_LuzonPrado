console.log("CookieLab iniciado");

// Duración por defecto de las cookies: 30 días (en segundos)
const TREINTA_DIAS = 30 * 24 * 60 * 60;

// ===================== FUNCIONES DE COOKIES =====================

// Guardar: document.cookie = "clave=valor; max-age=segundos"
function guardarCookie(nombre, valor, segundos = TREINTA_DIAS) {
    document.cookie = nombre + "=" + encodeURIComponent(valor) + "; max-age=" + segundos + "; path=/";
}

// Leer: document.cookie devuelve todas juntas ("a=1; b=2"),
// así que buscamos la que empieza por "nombre="
function leerCookie(nombre) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        if (cookie.startsWith(nombre + "=")) {
            return decodeURIComponent(cookie.substring(nombre.length + 1));
        }
    }
    return null; // no existe
}

// Borrar: document.cookie = "clave=; max-age=0"
function borrarCookie(nombre) {
    document.cookie = nombre + "=; max-age=0; path=/";
}

// ===================== TEXTOS SEGÚN IDIOMA =====================

const textos = {
    es: {
        pregunta: "¡Hola! ¿Cómo te llamas?",
        bienvenida: "¡Bienvenido/a a CookieLab, ",
        holaDeNuevo: "Hola de nuevo, ",
        sinNombre: "Hola, visitante anónimo"
    },
    en: {
        pregunta: "Hi! What's your name?",
        bienvenida: "Welcome to CookieLab, ",
        holaDeNuevo: "Welcome back, ",
        sinNombre: "Hello, anonymous visitor"
    }
};

// ===================== ELEMENTOS DEL DOM =====================

const saludo = document.getElementById("saludo");
const selectTema = document.getElementById("tema");
const selectIdioma = document.getElementById("idioma");

// Idioma actual (si no hay cookie, español)
function idiomaActual() {
    return leerCookie("idioma") || "es";
}

// ===================== FASE 1: PEDIR Y GUARDAR EL NOMBRE =====================

function pedirNombre() {
    const t = textos[idiomaActual()];
    const nombre = prompt(t.pregunta);

    // Si cancela o lo deja vacío, no guardamos nada
    if (nombre === null || nombre.trim() === "") {
        return null;
    }

    guardarCookie("usuario", nombre.trim());
    return nombre.trim();
}

// ===================== FASE 2: SALUDO + GUARD =====================

function mostrarSaludo() {
    const t = textos[idiomaActual()];
    const usuario = leerCookie("usuario");

    if (usuario) {
        saludo.textContent = t.holaDeNuevo + usuario;
    } else {
        saludo.textContent = t.sinNombre;
    }
}

function comprobarUsuario() {
    const usuario = leerCookie("usuario");

    if (usuario === null) {
        // Primera visita: preguntamos y guardamos
        const nombre = pedirNombre();
        if (nombre) {
            const t = textos[idiomaActual()];
            alert(t.bienvenida + nombre + "!");
            saludo.textContent = t.bienvenida + nombre + "!";
            return;
        }
    }
    // Si ya existe, no preguntamos nada: solo saludamos
    mostrarSaludo();
}

// ===================== FASE 3: PREFERENCIAS =====================

function aplicarTema(tema) {
    if (tema === "claro") {
        document.body.classList.add("claro");
    } else {
        document.body.classList.remove("claro");
    }
}

function cargarPreferencias() {
    const tema = leerCookie("tema") || "oscuro";
    const idioma = idiomaActual();

    // Dejamos los desplegables con lo que hay guardado
    selectTema.value = tema;
    selectIdioma.value = idioma;
    document.documentElement.lang = idioma;

    aplicarTema(tema);
}

selectTema.addEventListener("change", () => {
    guardarCookie("tema", selectTema.value);
    aplicarTema(selectTema.value);
});

selectIdioma.addEventListener("change", () => {
    guardarCookie("idioma", selectIdioma.value);
    document.documentElement.lang = selectIdioma.value;
    // Volvemos a pintar los textos en el nuevo idioma
    mostrarSaludo();
});

// ===================== INICIO =====================

cargarPreferencias();
comprobarUsuario();
