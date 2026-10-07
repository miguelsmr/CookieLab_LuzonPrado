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
        sinNombre: "Hola, visitante anónimo",
        visitas: (n) => "Has visitado esta página " + n + (n === 1 ? " vez" : " veces"),
        ultimaVisita: "Tu última visita fue el ",
        primeraVisita: "Es tu primera visita 🎉"
    },
    en: {
        pregunta: "Hi! What's your name?",
        bienvenida: "Welcome to CookieLab, ",
        holaDeNuevo: "Welcome back, ",
        sinNombre: "Hello, anonymous visitor",
        visitas: (n) => "You have visited this page " + n + (n === 1 ? " time" : " times"),
        ultimaVisita: "Your last visit was on ",
        primeraVisita: "This is your first visit 🎉"
    }
};

// ===================== ELEMENTOS DEL DOM =====================

const saludo = document.getElementById("saludo");
const pVisitas = document.getElementById("visitas");
const pUltimaVisita = document.getElementById("ultimaVisita");
const selectTema = document.getElementById("tema");
const selectIdioma = document.getElementById("idioma");
const btnCambiarNombre = document.getElementById("btnCambiarNombre");
const btnOlvidarme = document.getElementById("btnOlvidarme");
const btnCookieCorta = document.getElementById("btnCookieCorta");
const estadoCookieCorta = document.getElementById("estadoCookieCorta");
const visorCookies = document.getElementById("visorCookies");

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
    actualizarVisor();
});

selectIdioma.addEventListener("change", () => {
    guardarCookie("idioma", selectIdioma.value);
    document.documentElement.lang = selectIdioma.value;
    // Volvemos a pintar los textos en el nuevo idioma
    mostrarSaludo();
    mostrarVisitas();
    mostrarUltimaVisita();
    actualizarVisor();
});

// ===================== FASE 4: CONTADOR DE VISITAS =====================

let numVisitas = 0;

function contarVisita() {
    const visitas = leerCookie("visitas");

    if (visitas === null) {
        numVisitas = 1;
    } else {
        // La cookie es texto: la pasamos a número antes de sumar
        numVisitas = Number(visitas) + 1;
    }

    guardarCookie("visitas", numVisitas);
}

function mostrarVisitas() {
    const t = textos[idiomaActual()];
    pVisitas.textContent = t.visitas(numVisitas);
}

// ===================== EXTRA: FECHA DE LA ÚLTIMA VISITA =====================

let ultimaVisita = null;

function registrarVisita() {
    // Leemos la fecha anterior ANTES de guardar la de hoy
    ultimaVisita = leerCookie("ultimaVisita");
    guardarCookie("ultimaVisita", new Date().toISOString());
}

function mostrarUltimaVisita() {
    const idioma = idiomaActual();
    const t = textos[idioma];

    if (ultimaVisita === null) {
        pUltimaVisita.textContent = t.primeraVisita;
    } else {
        const fecha = new Date(ultimaVisita);
        const locale = idioma === "es" ? "es-ES" : "en-GB";
        pUltimaVisita.textContent = t.ultimaVisita +
            fecha.toLocaleDateString(locale) + " " + fecha.toLocaleTimeString(locale);
    }
}

// ===================== FASE 5: PANEL DE CONTROL =====================

btnCambiarNombre.addEventListener("click", () => {
    const nombre = pedirNombre();
    if (nombre) {
        mostrarSaludo();
        actualizarVisor();
    }
});

btnOlvidarme.addEventListener("click", () => {
    const confirmado = confirm("¿Seguro que quieres que CookieLab te olvide? Se borrarán todos tus datos.");

    if (confirmado) {
        const nombres = ["usuario", "tema", "idioma", "visitas", "ultimaVisita", "temporal"];
        nombres.forEach(borrarCookie);

        aplicarTema("oscuro");
        selectTema.value = "oscuro";
        selectIdioma.value = "es";
        saludo.textContent = "Te hemos olvidado. Recarga la página para empezar de cero.";
        pVisitas.textContent = "";
        pUltimaVisita.textContent = "";
        actualizarVisor();
    }
});

// ===================== EXTRA: CADUCIDAD CORTA =====================

btnCookieCorta.addEventListener("click", () => {
    guardarCookie("temporal", "dura1minuto", 60);
    actualizarVisor();
});

function comprobarCookieCorta() {
    if (leerCookie("temporal")) {
        estadoCookieCorta.textContent = "✅ La cookie 'temporal' existe (caduca en 60 s)";
    } else {
        estadoCookieCorta.textContent = "❌ La cookie 'temporal' no existe";
    }
}

// ===================== VISOR DE COOKIES =====================

function actualizarVisor() {
    visorCookies.textContent = decodeURIComponent(document.cookie) || "(no hay cookies)";
    comprobarCookieCorta();
}

// Cada segundo refrescamos el visor para ver cómo caduca la cookie corta
setInterval(actualizarVisor, 1000);

// ===================== INICIO =====================

cargarPreferencias();
comprobarUsuario();
contarVisita();
mostrarVisitas();
registrarVisita();
mostrarUltimaVisita();
actualizarVisor();
