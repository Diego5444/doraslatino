// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Configuración de Firebase
const app = initializeApp({
  apiKey: "AIzaSyAfqvmcg2Y6GOAQOVjFvXi46hp3NTCT6ZE",
  authDomain: "abby-cdb30.firebaseapp.com",
  databaseURL: "https://abby-cdb30-default-rtdb.firebaseio.com",
  projectId: "abby-cdb30",
  storageBucket: "abby-cdb30.appspot.com",
  messagingSenderId: "738241914654",
  appId: "1:738241914654:web:80351b3fed2f4dc3688b0f"
});

const db = getDatabase(app);

// ===== ELEMENTOS DEL DOM =====

// Elementos principales
const listasContenido = document.getElementById("listas-contenido");
const dramasDiv = document.getElementById("dramas");
const peliculasDiv = document.getElementById("peliculas");

// Menú y navegación
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const searchToggle = document.getElementById("search-toggle");
const btnAcerca = document.getElementById("btn-acerca");
const linkPolitica = document.getElementById("link-politica");

// Carrusel destacado
const destacadoEmision = document.getElementById("destacado-emision");
const carruselImg = document.getElementById("carrusel-img");
const carruselImgDerecha = document.getElementById("carrusel-img-derecha");
const carruselTitulo = document.getElementById("carrusel-titulo");
const carruselDescripcion = document.getElementById("carrusel-descripcion");
const carruselAno = document.getElementById("carrusel-ano");
const carruselAudio = document.getElementById("carrusel-audio");
const btnVer = document.getElementById("btn-ver");

// Búsqueda
const busquedaSection = document.getElementById("busqueda");
const buscador = document.getElementById("buscador");
const resultadosBusqueda = document.getElementById("busqueda-resultados");

// Sección "Acerca de"
const acercaDeSection = document.getElementById("acerca-de");
const btnVolverAcerca = document.getElementById("btn-volver-acerca");

// Detalle del contenido
const detalleSection = document.getElementById("detalle");
const btnVolver = document.getElementById("btn-volver");
const detalleImg = document.getElementById("detalle-img");
const detalleTitulo = document.getElementById("detalle-titulo");
const detalleDescripcion = document.getElementById("detalle-descripcion");
const detalleAno = document.getElementById("detalle-ano");
const detalleGenero = document.getElementById("detalle-genero");
const detalleAudio = document.getElementById("detalle-audio");
const detalleActors = document.getElementById("detalle-actors");
const capitulosLista = document.getElementById("capitulos-lista");

// Reproductor de video
const videoPlayer = document.getElementById("video-player");
const videoElement = document.getElementById("video");

// Modal de vista previa
const previewModal = document.getElementById("preview-modal");
const previewImg = document.getElementById("preview-img");
const previewTitle = document.getElementById("preview-title");
const previewDescripcion = document.getElementById("preview-descripcion");
const modalCerrar = document.getElementById("modal-cerrar");
// === CHAT DE PETICIONES ===

const btnPedirDrama = document.getElementById("btn-pedir-drama");
const modalPedir = document.getElementById("modal-pedir-drama");
const cerrarPedir = document.getElementById("cerrar-pedir-drama");
const pedirLogin = document.getElementById("pedir-drama-login");
const formularioPedir = document.getElementById("formulario-pedir");
const formPedir = document.getElementById("form-pedir-drama");
const listaPeticiones = document.getElementById("lista-peticiones");
const usuarioPedir = document.getElementById("usuario-pedir");
const clavePedir = document.getElementById("clave-pedir");
const btnLoginPedir = document.getElementById("btn-login-pedir");
const errorPedir = document.getElementById("error-pedir");

let usuarioPeticiones = null;

if (btnPedirDrama) {
  btnPedirDrama.addEventListener("click", () => {
    modalPedir.classList.remove("hidden");
    usuarioPeticiones = localStorage.getItem("usuarioDOGTV");
    if (usuarioPeticiones) {
      pedirLogin.classList.add("hidden");
      formularioPedir.classList.remove("hidden");
      cargarPeticiones();
    } else {
      pedirLogin.classList.remove("hidden");
      formularioPedir.classList.add("hidden");
    }
  });
}

if (cerrarPedir) {
  cerrarPedir.addEventListener("click", () => {
    modalPedir.classList.add("hidden");
  });
}

if (btnLoginPedir) {
  btnLoginPedir.addEventListener("click", async () => {
    const user = usuarioPedir.value.trim().toLowerCase();
    const pass = clavePedir.value.trim();

    const userRef = dbRef(db, `usuarios/${user}`);
    const snap = await get(userRef);
    if (snap.exists() && snap.val().clave === pass) {
      usuarioPeticiones = user;
      localStorage.setItem("usuarioDOGTV", user);
      pedirLogin.classList.add("hidden");
      formularioPedir.classList.remove("hidden");
      cargarPeticiones();
    } else {
      errorPedir.style.display = "block";
    }
  });
}

function cargarPeticiones() {
  onValue(dbRef(db, 'peticiones'), (snapshot) => {
    listaPeticiones.innerHTML = "";
    snapshot.forEach(child => {
      const peticion = child.val();
      const id = child.key;

      // Si ya existe el drama, no mostrar la petición
      if (Object.values(datosContenido).some(c => (c.Titulo || "").toLowerCase() === peticion.titulo.toLowerCase())) return;

      const div = document.createElement("div");
      div.innerHTML = `
        <div style="margin-bottom:10px;background:#333;padding:10px;border-radius:10px;">
          <img src="${peticion.imagen}" alt="Preview" style="width:100%;border-radius:8px;">
          <p style="margin:5px 0;"><strong>${peticion.titulo}</strong></p>
          <p style="font-size:12px;color:#ccc;">por ${peticion.usuario}</p>
        </div>`;
      listaPeticiones.appendChild(div);
    });
  });
}
// Variables globales
let datosContenido = {};
let intervalCarrusel = null;
let itemSeleccionadoPreview = null;
const palabrasProhibidas = [
  "puta", "mierda", "hpta", "malparido", "malparida", "maldita", "maldito",
  "estúpido", "estupido", "imbécil", "imbecil", "culo", "verga", "perra",
  "coño", "pendejo", "pendeja", "zorra", "idiota", "marica", "maricón", "maricona",
  "gonorrea", "gonorreita", "gonorreíta", "gonorreo", "come mierda", "come-mierda",
  "comemierda", "hijueputa", "hijueputas", "hijuep*", "hp", "hpta", "carechimba",
  "careverga", "careculo", "caremondá", "caremondáh", "caremondah", "caremalparido",
  "cagada", "cagado", "maldita sea", "malnacido", "malnacida", "jodido", "jodida",
  "chimba", "rechimba", "desgraciado", "desgraciada", "cojudo", "cojuda", "tarado",
  "tarada", "cabron", "cabrona", "pichurria", "pichurriento", "pinche", "puto",
  "puta madre", "chingada", "chingar", "chingadera", "chingados", "pelotudo",
  "pelotuda", "culicagado", "culicagada", "mariquita", "mamaguevo", "mamabicho",
  "baboso", "babosa", "bobo", "zángano", "lagarto", "arrastrado", "sapa", "zorra inmunda",
  "asqueroso", "asquerosa", "desgracia", "me vale verga", "vete a la mierda",
  "lambón", "lambona", "lamberico", "lambe culo", "come verga", "que te jodan",
  "vete al carajo", "maldito sea", "que chingados", "jódete", "pendeja", "huevón",
  "hueva", "mierdero", "culiado", "culiada", "culo roto", "malco", "retrasado",
  "tonto", "babosada", "imbecilazo", "paraco", "sapo", "marimonda", "sapito",
  "idioteces", "balurdo", "cojones", "verguero", "pelmazo", "berraco", "bestia",
  "coñazo", "coñeta", "berriondo", "marik", "marikn", "kulo", "m1erda", "mi3rda",
  "m13rda", "v3rga", "verhga", "pvt4", "p3rr4", "z0rr4", "zorra", "z0rra",
  "malpa", "malpa#", "mrd", "huevon", "guevon", "güevon", "mamón", "mamona",
  "joputa", "hueputa", "malpa#$", "idi0ta", "imb3cil", "g0n0rr34", "perr@", "kbron",
  ///ingle
  "fuck", "fucking", "shit", "bitch", "asshole", "bastard", "damn", "dick", "pussy",
  "cunt", "motherfucker", "son of a bitch", "suck my dick", "ass", "jerk", "retard",
  "douche", "whore", "slut", "fag", "faggot", "cock", "shithead", "bullshit", "dumbass",
  "twat", "cocksucker", "wanker", "prick", "piss off", "bollocks", "screw you",
  // Portugués
   "merda", "porra", "caralho", "puta", "puto", "vai se foder", "vai tomar no cu",
  "filho da puta", "bosta", "babaca", "cu", "viado", "desgraçado", "arrombado",
  "otário", "fdp", "piranha", "corno", "trouxa", "imbecil", "idiota", "cacete",
// Francés
  "putain", "merde", "salope", "connard", "con", "enculé", "ta gueule", "chiant",
  "bâtard", "pute", "fils de pute", "bordel", "cul", "nique ta mère", "trou du cul",
// Alemán
  "scheiße", "arschloch", "miststück", "verdammt", "hure", "fotze", "wichser",
  "fick dich", "hurensohn", "schlampe", "dummkopf", "idiot", "arsch", "kotzbrocken",
// Italiano
  "cazzo", "stronzo", "merda", "vaffanculo", "bastardo", "puttana", "figlio di puttana",
  "culo", "pezzo di merda", "porca puttana", "rompicoglioni", "minchia", "scemo",
// Variaciones con símbolos
  "p3rr4", "m13rd@", "v3rg@", "c0ñ0", "idi0t@", "g0n0rr34", "imb3c1l", "hpt@", "put@", "f*ck", "sh1t", "b!tch"
];

// ===== FUNCIONES DE NAVEGACIÓN Y CONTROL DE VISTAS =====

function mostrarVistaInicial() {
  // Mostrar elementos principales
  listasContenido.classList.remove("hidden");
  destacadoEmision.classList.remove("hidden");
  menuToggle.classList.remove("hidden");
  searchToggle.classList.remove("hidden");
  
  // Ocultar otras secciones
  menu.classList.add("hidden");
  busquedaSection.classList.add("hidden");
  acercaDeSection.classList.add("hidden");
  detalleSection.classList.add("hidden");
  videoPlayer.classList.add("hidden");
  previewModal.classList.add("hidden");
  
  // Limpiar video
  if (videoElement) {
  videoElement.pause();
  videoElement.removeAttribute("src");
  videoElement.load(); // Limpia el buffer sin error
}
  
  // Mostrar todas las tarjetas
  document.querySelectorAll('.content-card').forEach(card => {
    card.classList.remove('hidden');
  });
  
  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ocultarElementosPrincipales() {
  listasContenido.classList.add("hidden");
  destacadoEmision.classList.add("hidden");
  menuToggle.classList.add("hidden");
  searchToggle.classList.add("hidden");
  menu.classList.add("hidden");
}

// ===== FUNCIONES DEL CARRUSEL =====

function iniciarCarrusel(items) {
  detenerCarrusel();
  
  if (!items || items.length === 0) {
    destacadoEmision.classList.add("hidden");
    return;
  }
  
  destacadoEmision.classList.remove("hidden");
  let index = 0;
  
  const mostrarItem = () => {
    const item = items[index];
    
    if (carruselImg) carruselImg.src = item.foto || "";
    if (carruselImgDerecha) carruselImgDerecha.src = item.foto || "";
    if (carruselTitulo) carruselTitulo.textContent = item.Titulo || "Sin título";
    if (carruselDescripcion) carruselDescripcion.textContent = item.descripción || "Sin descripción";
    if (carruselAno) carruselAno.textContent = item.Año || item.ano || "N/A";
    if (carruselAudio) carruselAudio.textContent = item.audio || "Latino";
    
    if (btnVer) {
      btnVer.onclick = () => mostrarDetalle(item);
    }
    
    const btnListaCarrusel = document.getElementById("btn-lista-carrusel");
const icono = btnListaCarrusel.querySelector(".corazon-icon");
const texto = btnListaCarrusel.querySelector(".texto-favorito");

if (esFavorito(item.id || item.Titulo)) {
  icono.textContent = "♥";
  texto.textContent = "GUARDADO";
} else {
  icono.textContent = "♡";
  texto.textContent = "MI LISTA";
}

btnListaCarrusel.onclick = () => {
  toggleFavorito(item, icono, texto);
};

    
    index = (index + 1) % items.length;
  };
  
  mostrarItem();
  intervalCarrusel = setInterval(mostrarItem, 6000);
}

function detenerCarrusel() {
  if (intervalCarrusel) {
    clearInterval(intervalCarrusel);
    intervalCarrusel = null;
  }
}

// ===== EVENT LISTENERS DEL MENÚ =====

// Toggle del menú hamburguesa
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// Toggle de búsqueda
searchToggle.addEventListener("click", () => {
  menu.classList.add("hidden");
  
  if (busquedaSection.classList.contains("hidden")) {
    // Mostrar búsqueda
    ocultarElementosPrincipales();
    busquedaSection.classList.remove("hidden");
    detenerCarrusel();
    buscador.focus();
  } else {
    // Ocultar búsqueda y volver a inicio
    busquedaSection.classList.add("hidden");
    buscador.value = "";
    resultadosBusqueda.innerHTML = "";
    mostrarVistaInicial();
    reanudarCarrusel();
  }
});

// Botón "Acerca de"
btnAcerca.addEventListener("click", () => {
  menu.classList.add("hidden");
  ocultarElementosPrincipales();
  acercaDeSection.classList.remove("hidden");
  detenerCarrusel();
});

// Botón volver de "Acerca de"
btnVolverAcerca.addEventListener("click", () => {
  acercaDeSection.classList.add("hidden");
  mostrarVistaInicial();
  reanudarCarrusel();
});

// Botón volver general
btnVolver.addEventListener("click", () => {
  detalleSection.classList.add("hidden");
  videoPlayer.classList.add("hidden");
  
  if (videoElement) {
    videoElement.pause();
    videoElement.src = "";
  }
  
  mostrarVistaInicial();
  reanudarCarrusel();
});



// ===== FUNCIONES DE BÚSQUEDA =====

buscador.addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase().trim();

  if (resultadosBusqueda) {
    resultadosBusqueda.innerHTML = "";
  }

  if (texto === "") {
    // 🏠 Si el buscador queda vacío, regresar a la vista principal
    busquedaSection.classList.add("hidden");
    mostrarVistaInicial();
    reanudarCarrusel();
    return;
  }

  
  // Filtrar contenido
  const encontrados = Object.values(datosContenido).filter(item =>
    item.foto && item.Titulo && (
      (item.Titulo || "").toLowerCase().includes(texto) ||
      (item.genero || "").toLowerCase().includes(texto) ||
      (item.descripción || "").toLowerCase().includes(texto) ||
      (item.actores || item.ars || "").toLowerCase().includes(texto)
    )
  );
  
  if (encontrados.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "sin-resultados";
    mensaje.textContent = `No se encontraron resultados para: "${texto}"`;
    mensaje.style.cssText = `
      color: #ccc;
      text-align: center;
      padding: 20px;
      font-style: italic;
    `;
    if (resultadosBusqueda) {
      resultadosBusqueda.appendChild(mensaje);
    }
  } else {
    encontrados.forEach(item => {
      if (resultadosBusqueda) {
        resultadosBusqueda.appendChild(crearCard(item));
      }
    });
  }
});

// ===== FUNCIONES PARA CREAR TARJETAS =====

function crearCard(item) {
  const card = document.createElement("div");
  card.className = "content-card";

  const img = document.createElement("img");
  img.src = item.foto;
  img.alt = item.Titulo || "Sin título";
  img.classList.add("card-img");

  const titulo = document.createElement("div");
  titulo.className = "card-title";
  titulo.textContent = item.Titulo || "Sin título";

  card.appendChild(img);
  card.appendChild(titulo);

  // Click en imagen o título: ir a detalle
  const verDetalle = () => {
    mostrarDetalle(item);
  };
  img.addEventListener("click", verDetalle);
  titulo.addEventListener("click", verDetalle);

  // Vista previa (modal) con toque prolongado
  let presionado;
  let fuePreview = false;

  const iniciarPreview = () => {
    fuePreview = false;
    presionado = setTimeout(() => {
      fuePreview = true;
      mostrarPreview(item);
    }, 500); // medio segundo para activar modal
  };

  const cancelarPreview = () => {
    clearTimeout(presionado);
  };

  // MOUSE
  card.addEventListener("mousedown", iniciarPreview);
  card.addEventListener("mouseup", cancelarPreview);
  card.addEventListener("mouseleave", cancelarPreview);

  // TOUCH (móvil/tablet)
  card.addEventListener("touchstart", iniciarPreview);
  card.addEventListener("touchend", (e) => {
    cancelarPreview();
    if (!fuePreview) {
      // Si no se activó el modal por tiempo prolongado, interpretar como toque normal
      const tocado = e.target;
      if (tocado === img || tocado === titulo) {
        mostrarDetalle(item);
      }
    }
  });
  card.addEventListener("touchcancel", cancelarPreview);

  return card;
}

// ===== FUNCIONES DE DETALLE =====

function mostrarDetalle(item) {
  detenerCarrusel();
  ocultarElementosPrincipales();
  busquedaSection.classList.add("hidden");
  acercaDeSection.classList.add("hidden");
    favoritosSection.classList.add("hidden"); // << Esta línea es la clave
    chatContenidoID = item.id || item.Titulo;


  detalleSection.classList.remove("hidden");
  
  // Llenar información
  if (detalleImg) detalleImg.src = item.foto || "";
  if (detalleTitulo) detalleTitulo.textContent = item.Titulo || "Sin título";
  if (detalleDescripcion) detalleDescripcion.textContent = item.descripción || "Sin descripción";
  if (detalleAno) detalleAno.textContent = item.Año || item.ano || "N/A";
  if (detalleGenero) detalleGenero.textContent = item.genero || "N/A";
  if (detalleAudio) detalleAudio.textContent = item.audio || "N/A";
  if (detalleActors) detalleActors.textContent = item.actores || item.ars || "N/A";
  
  const btnFav = document.getElementById("btn-favorito-detalle");
const icono = btnFav.querySelector(".corazon-icon");

if (esFavorito(item.id || item.Titulo)) {
  icono.textContent = "♥";
} else {
  icono.textContent = "♡";
}

btnFav.onclick = () => {
  toggleFavorito(item, icono);
};
  
  // Limpiar capítulos anteriores
  if (capitulosLista) {
    capitulosLista.innerHTML = "";
  }
  
  // Generar botones de capítulos
  const capitulos = Object.entries(item)
    .filter(([key, value]) => key.toUpperCase().startsWith("CAPITULO") && value)
    .sort((a, b) => {
      const numA = parseInt(a[0].replace(/\D/g, "")) || 0;
      const numB = parseInt(b[0].replace(/\D/g, "")) || 0;
      return numA - numB;
    });
  
  capitulos.forEach(([key, url]) => {
    const btn = document.createElement("button");
    btn.className = "capitulo-btn";
    btn.textContent = key.replace(/_/g, " ").replace(/capitulo/gi, "Capítulo");
    btn.style.cssText = `
      display: block;
      width: 100%;
      margin: 5px 0;
      padding: 10px;
      background: #333;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
    `;
    
    btn.addEventListener("mouseover", () => {
      btn.style.background = "#555";
    });
    
    btn.addEventListener("mouseout", () => {
      btn.style.background = "#333";
    });
    
    btn.addEventListener("click", () => {
      cargarVideo(url);
    });
    
    if (capitulosLista) {
      capitulosLista.appendChild(btn);
    }
  });
  
  // Scroll hacia el detalle
  setTimeout(() => {
    detalleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ===== FUNCIONES DEL REPRODUCTOR =====

function cargarVideo(url) {
  if (!videoElement || !url) return;
  
  videoElement.src = url;
  videoPlayer.classList.remove("hidden");
  
  videoElement.play().catch(error => {
    console.error("Error al reproducir video:", error);
    alert("Error al cargar el video. Por favor, intenta de nuevo.");
  });
  
  // Scroll hacia el reproductor
  setTimeout(() => {
    videoPlayer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Event listeners del video
if (videoElement) {
  videoElement.addEventListener('ended', () => {
    videoPlayer.classList.add("hidden");
    videoElement.src = "";
  });
  
  videoElement.addEventListener('error', (e) => {
   const btnFullscreen = document.getElementById("btn-fullscreen");

if (btnFullscreen && videoElement) {
  btnFullscreen.addEventListener("click", () => {
    console.log("Intentando poner el video en pantalla completa");

    if (!videoElement.src) {
      alert("No hay video cargado para mostrar en pantalla completa.");
      return;
    }

    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen().catch((err) => {
        console.error("Error al solicitar fullscreen:", err);
        alert("No se pudo activar pantalla completa.");
      });
    } else if (videoElement.webkitRequestFullscreen) {
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      videoElement.msRequestFullscreen();
    } else {
      alert("Tu navegador no soporta pantalla completa.");
    }
  });
}

    console.error("Error en el video:", e);
    alert("Error al reproducir el video. Verifica la conexión a internet.");
  });
}

// ===== FUNCIONES DEL MODAL DE PREVIEW =====

function mostrarPreview(item) {
  itemSeleccionadoPreview = item;
  
  if (previewImg) previewImg.src = item.foto || "";
  if (previewTitle) previewTitle.textContent = item.Titulo || "Sin título";
  if (previewDescripcion) {
    const desc = item.descripción || "Sin descripción";
    previewDescripcion.textContent = desc.length > 150 ? desc.substring(0, 150) + "..." : desc;
  }
  
  previewModal.classList.remove("hidden");
}

// Cerrar modal
modalCerrar.addEventListener("click", () => {
  previewModal.classList.add("hidden");
  itemSeleccionadoPreview = null;
});

previewModal.addEventListener("click", (e) => {
  if (e.target === previewModal) {
    previewModal.classList.add("hidden");
    itemSeleccionadoPreview = null;
  }
});

// Agregar botón "Ver más" al modal
const modalContent = document.querySelector(".modal-content");
if (modalContent) {
  const verMasBtn = document.createElement("button");
  verMasBtn.textContent = "Ver más";
  verMasBtn.className = "ver-mas-btn";
  verMasBtn.style.cssText = `
    margin-top: 15px;
    background: #06D9FF;
    border: none;
    color: #000;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.3s;
    width: 100%;
  `;
  
  verMasBtn.addEventListener("mouseover", () => {
    verMasBtn.style.backgroundColor = "#05B8D9";
    verMasBtn.style.transform = "scale(1.05)";
  });
  
  verMasBtn.addEventListener("mouseout", () => {
    verMasBtn.style.backgroundColor = "#06D9FF";
    verMasBtn.style.transform = "scale(1)";
  });
  
  verMasBtn.addEventListener("click", () => {
    if (itemSeleccionadoPreview) {
      previewModal.classList.add("hidden");
      mostrarDetalle(itemSeleccionadoPreview);
      itemSeleccionadoPreview = null;
    }
  });
  
  modalContent.appendChild(verMasBtn);
}

// ===== FUNCIONES DE ACORDEÓN =====

function inicializarAcordeon() {
  const headers = document.querySelectorAll('.acordeon-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.acordeon-content');
      const isActive = item.classList.contains('active');
      
      // Cerrar todos los acordeones
      document.querySelectorAll('.acordeon-item').forEach(i => {
        i.classList.remove('active');
        const c = i.querySelector('.acordeon-content');
        if (c) c.style.display = 'none';
      });
      
      // Abrir el seleccionado si no estaba activo
      if (!isActive) {
        item.classList.add('active');
        if (content) content.style.display = 'block';
      }
    });
  });
}

// ===== FUNCIONES PRINCIPALES =====

function renderizarContenido(data) {
  // Limpiar contenedores
  if (dramasDiv) dramasDiv.innerHTML = "";
  if (peliculasDiv) peliculasDiv.innerHTML = "";
  
  const itemsDestacados = [];
  
  for (const key in data) {
    const item = data[key];
    
    // Validar que el item tenga los datos mínimos
    if (!item.foto || !item.Titulo) continue;
    
    const tipo = (item.tipo || "").toLowerCase().trim();
    const estreno = (item.estreno || "").toLowerCase().trim();
    
    // Items para el carrusel (destacados)
    if (estreno === "true") {
      itemsDestacados.push(item);
    }
    
    // Categorizar por tipo
    if (["dorama", "dramas", "drama"].includes(tipo) && dramasDiv) {
      dramasDiv.appendChild(crearCard(item));
    } else if (["película", "pelicula", "movie"].includes(tipo) && peliculasDiv) {
      peliculasDiv.appendChild(crearCard(item));
    }
  }
  
  // Iniciar carrusel con items destacados
  if (itemsDestacados.length > 0) {
    iniciarCarrusel(itemsDestacados);
  }
}

function reanudarCarrusel() {
  const itemsDestacados = Object.values(datosContenido).filter(item => 
    item.foto && item.Titulo && (item.estreno || "").toLowerCase() === "true"
  );
  
  if (itemsDestacados.length > 0 && !listasContenido.classList.contains("hidden")) {
    iniciarCarrusel(itemsDestacados);
  }
}

// ===== CONTROL DE VISIBILIDAD DE PÁGINA =====

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    detenerCarrusel();
  } else {
    // Solo reanudar si estamos en la vista principal
    if (!listasContenido.classList.contains("hidden") && !destacadoEmision.classList.contains("hidden")) {
      reanudarCarrusel();
    }
  }
});

// ===== CERRAR MENÚS AL HACER CLICK FUERA =====

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// ===== TECLAS DE ACCESO RÁPIDO =====

document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'Escape':
      // Cerrar modales y menús
      previewModal.classList.add("hidden");
      menu.classList.add("hidden");
      itemSeleccionadoPreview = null;
      break;
    case '/':
      // Activar búsqueda
      if (!busquedaSection.classList.contains("hidden")) {
        e.preventDefault();
        buscador.focus();
      }
      break;
  }
});

// ===== INICIALIZACIÓN =====

// Cargar datos desde Firebase
onValue(ref(db, 'contenido_db_adm'), (snapshot) => {
  datosContenido = snapshot.val() || {};
  renderizarContenido(datosContenido);
});

// Inicializar acordeón cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  inicializarAcordeon();
});

// ===== FAVORITOS =====

const btnFavoritos = document.getElementById("btn-favoritos");
const favoritosSection = document.getElementById("favoritos");
const btnVolverFavoritos = document.getElementById("btn-volver-favoritos");
const favoritosLista = document.getElementById("favoritos-lista");
// === CHAT POR CONTENIDO ===

import { ref as dbRef, set, push, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const chatModal = document.getElementById("chat-modal");
const cerrarChat = document.getElementById("cerrar-chat");
const chatLogin = document.getElementById("chat-login");
const chatArea = document.getElementById("chat-area");
const chatUsuarioInput = document.getElementById("chat-usuario");
const chatClaveInput = document.getElementById("chat-clave");
const chatLoginBtn = document.getElementById("chat-login-btn");
const chatLoginError = document.getElementById("chat-login-error");
const chatMensajes = document.getElementById("chat-mensajes");
const chatForm = document.getElementById("chat-form");
const chatTextoInput = document.getElementById("chat-texto");
const btnChat = document.getElementById("btn-chat");

let chatContenidoID = null;
let usuarioActual = null;

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos") || "{}");
}

function guardarFavoritos(favoritos) {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function esFavorito(id) {
  const favs = obtenerFavoritos();
  return Boolean(favs[id]);
}

function agregarAFavoritos(item) {
  const favs = obtenerFavoritos();
  favs[item.id || item.Titulo] = item;
  guardarFavoritos(favs);
}

function removerDeFavoritos(id) {
  const favs = obtenerFavoritos();
  delete favs[id];
  guardarFavoritos(favs);
}

function toggleFavorito(item, icono, texto) {
  const id = item.id || item.Titulo;
  if (esFavorito(id)) {
    removerDeFavoritos(id);
    icono.textContent = "♡";
    if (texto) texto.textContent = "MI LISTA";
  } else {
    agregarAFavoritos(item);
    icono.textContent = "♥";
    if (texto) texto.textContent = "GUARDADO";
  }
}

function mostrarFavoritos() {
  ocultarElementosPrincipales();
  favoritosSection.classList.remove("hidden");

  const favs = obtenerFavoritos();
  favoritosLista.innerHTML = "";

  const values = Object.values(favs);
  if (values.length === 0) {
    favoritosLista.innerHTML = `
      <div class="favoritos-vacio">
        <h3>No tienes favoritos aún</h3>
        <p>Agrega contenido a tu lista de favoritos para verlo aquí</p>
      </div>`;
    return;
  }

  values.forEach(item => {
    favoritosLista.appendChild(crearCard(item));
  });
}

btnFavoritos.addEventListener("click", () => {
  menu.classList.add("hidden");
  mostrarFavoritos();
});

btnVolverFavoritos.addEventListener("click", () => {
  favoritosSection.classList.add("hidden");
  mostrarVistaInicial();
  reanudarCarrusel();
});

// Abrir modal de chat al presionar el botón

btnChat.addEventListener("click", async () => {
  if (!chatContenidoID) return;

  const rawIP = await obtenerIP();
  const ip = rawIP.replace(/\./g, "_");

  const bloqueadoRef = dbRef(db, `bloqueados/${ip}`);
  const snapshot = await get(bloqueadoRef);

  if (snapshot.exists()) {
    const datos = snapshot.val();
    mostrarModalBloqueado(datos);
    return;
  }

  chatModal.classList.remove("hidden");
  usuarioActual = localStorage.getItem("usuarioDOGTV");

  if (usuarioActual) {
    chatLogin.classList.add("hidden");
    chatArea.classList.remove("hidden");
    escucharMensajes(chatContenidoID);
  } else {
    chatLogin.classList.remove("hidden");
    chatArea.classList.add("hidden");
  }
});

// Cerrar modal
cerrarChat.addEventListener("click", () => {
  chatModal.classList.add("hidden");
  chatMensajes.innerHTML = "";
});

// Login con nombre de usuario y contraseña

chatLoginBtn.addEventListener("click", async () => {
  const usuario = chatUsuarioInput.value.trim().toLowerCase();
  const clave = chatClaveInput.value.trim();

  if (!usuario || !clave) return;

  const userRef = dbRef(db, `usuarios/${usuario}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    if (data.clave === clave) {
      localStorage.setItem("usuarioDOGTV", usuario);
      usuarioActual = usuario;
      chatLogin.classList.add("hidden");
      chatArea.classList.remove("hidden");
      escucharMensajes(chatContenidoID);
    } else {
      chatLoginError.textContent = "Contraseña incorrecta";
      chatLoginError.style.display = "block";
    }
  } else {
    // ✅ Verificar IP antes de permitir crear cuenta
    const rawIP = await obtenerIP();
    const ip = rawIP.replace(/\./g, "_");
    const bloqueadoRef = dbRef(db, `bloqueados/${ip}`);
    const bloqueadoSnap = await get(bloqueadoRef);

    if (bloqueadoSnap.exists()) {
      const datos = bloqueadoSnap.val();
      mostrarModalBloqueado(datos);
      return;
    }

    // ✅ Crear cuenta si no está bloqueado
    await set(userRef, { clave });
    localStorage.setItem("usuarioDOGTV", usuario);
    usuarioActual = usuario;
    chatLogin.classList.add("hidden");
    chatArea.classList.remove("hidden");
    escucharMensajes(chatContenidoID);
  }
});

// Escuchar mensajes del contenido actual
function escucharMensajes(contenidoID) {
  const mensajesRef = dbRef(db, `chats/${contenidoID}/mensajes`);

  onValue(mensajesRef, (snapshot) => {
    chatMensajes.innerHTML = "";
    snapshot.forEach(child => {
      const msg = child.val();
    const div = document.createElement("div");
div.className = "mensaje";
div.classList.add(msg.usuario === usuarioActual ? "propio" : "otro");

const contenido = document.createElement("span");
contenido.textContent = `${msg.usuario}: ${msg.texto}`;
div.appendChild(contenido);

// Si NO es del usuario actual, añadimos botón de reportar
if (msg.usuario !== usuarioActual) {
  const btnReportar = document.createElement("button");
  btnReportar.textContent = "🚩";
  btnReportar.title = "Reportar mensaje";
  btnReportar.style.marginLeft = "10px";
  btnReportar.style.background = "transparent";
  btnReportar.style.border = "none";
  btnReportar.style.cursor = "pointer";
  btnReportar.style.color = "crimson";
  btnReportar.onclick = () => {
    reportarMensaje(msg);
  };
  div.appendChild(btnReportar);
}
chatMensajes.appendChild(div);
    });

    // Auto-scroll al final
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
  });
}

// Enviar mensaje
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const texto = chatTextoInput.value.trim();
  if (!texto || !usuarioActual || !chatContenidoID) return;

  // Verificar si IP está bloqueada
  const rawIP = await obtenerIP();
  const ip = rawIP.replace(/\./g, "_");
  const bloqueadoRef = dbRef(db, `bloqueados/${ip}`);
  const bloqueadoSnap = await get(bloqueadoRef);

  if (bloqueadoSnap.exists()) {
    const datos = bloqueadoSnap.val();
    mostrarModalBloquead(datos);
    return; // 🚫 Bloqueado: no puede enviar mensaje
  }

  // --- FILTRO DE PALABRAS PROHIBIDAS ---
  const contieneOfensa = palabrasProhibidas.some(palabra =>
    texto.toLowerCase().includes(palabra)
  );

  if (contieneOfensa) {
    await verificarOfensa(usuarioActual, texto); // Llamamos función de verificación
    return;
  }

  // ✅ Enviar mensaje si todo está permitido
  const mensajesRef = dbRef(db, `chats/${chatContenidoID}/mensajes`);
  await push(mensajesRef, {
    usuario: usuarioActual,
    texto,
    fecha: Date.now()
  });

  chatTextoInput.value = "";
});

async function obtenerIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip || "IP no detectada";
  } catch (e) {
    return "Desconocida";
  }
}


// === FUNCIONES DE ADVERTENCIA POR OFENSAS ===

async function verificarOfensa(usuario, mensajeOfensivo) {
  const intentosRef = dbRef(db, `reportes/${usuario}`);
  const snapshot = await get(intentosRef);
  let datos = snapshot.exists() ? snapshot.val() : { intentos: 0, historial: [] };

  datos.intentos += 1;
  const rawIP = await obtenerIP();
  const ip = rawIP.replace(/\./g, "_"); // Reemplaza puntos por _

  datos.historial.push({
    mensaje: mensajeOfensivo,
    fecha: new Date().toISOString(),
    ip: rawIP // Aquí sí guardamos la IP real para mostrarla
  });

  await set(intentosRef, datos);

  if (datos.intentos >= 3) {
    const bloqueadoRef = dbRef(db, `bloqueados/${ip}`);
    await set(bloqueadoRef, {
      usuario,
      motivo: "Lenguaje ofensivo",
      historial: datos.historial
    });
    mostrarModalBloqueado(datos);
  } else {
    mostrarModalAdvertencia(datos.intentos);
  }
}

//pueba 1

function mostrarModalBloqueado(datos) {
  const modal = document.getElementById("modal-bloqueo");
  const historialDiv = document.getElementById("historial-bloqueo");
  const cerrar = document.getElementById("cerrar-modal-bloqueo");

  historialDiv.innerHTML = "";
  if (Array.isArray(datos.historial)) {
    datos.historial.forEach(entry => {
      const p = document.createElement("p");
      p.innerHTML = `
        <strong>🕒 ${new Date(entry.fecha).toLocaleString()}</strong><br/>
        <em>Mensaje:</em> "${entry.mensaje}"<br/>
        <em>IP:</em> ${entry.ip}
      `;
      p.style.borderBottom = "1px solid #444";
      p.style.paddingBottom = "5px";
      p.style.marginBottom = "10px";
      historialDiv.appendChild(p);
    });
  }

  modal.classList.remove("hidden");

  cerrar.onclick = () => {
    modal.classList.add("hidden");
  };
}
function mostrarModalAdvertencia(intentos) {
  const modal = document.getElementById("modal-advertencia");
  const corazones = document.getElementById("estado-corazones");
  const cerrar = document.getElementById("cerrar-modal-advertencia");

  // Mostrar corazones según advertencias
  if (intentos === 1) corazones.textContent = "❤️❤️🖤";
  else if (intentos === 2) corazones.textContent = "❤️🖤🖤";
  else corazones.textContent = "🖤🖤🖤";

  modal.classList.remove("hidden");

  cerrar.onclick = () => {
    modal.classList.add("hidden");
  };
}
///prueba 2
// Variable temporal para guardar el mensaje seleccionado
let mensajeAReportar = null;

// Mostrar el modal con el mensaje seleccionado
function reportarMensaje(msg) {
  mensajeAReportar = msg; // Guardamos mensaje a reportar
  const modal = document.getElementById("modal-reporte");
  const mensajeReportado = document.getElementById("mensaje-reportado");

  mensajeReportado.textContent = `"${msg.usuario}: ${msg.texto}"`;

  // Limpiar campos anteriores
  document.querySelectorAll("input[name='motivo-reporte']").forEach(r => r.checked = false);
  document.getElementById("comentario-reporte").value = "";

  modal.classList.remove("hidden");
}

// Botones del modal de reporte
const btnEnviarReporte = document.getElementById("enviar-reporte");
const btnCancelarReporte = document.getElementById("cancelar-reporte");
const modalReporte = document.getElementById("modal-reporte");

btnCancelarReporte.addEventListener("click", () => {
  modalReporte.classList.add("hidden");
});
// Referencias del modal de agradecimiento
const modalGracias = document.getElementById("modal-gracias-reporte");
const cerrarModalGracias = document.getElementById("cerrar-modal-gracias");
const usuarioGracias = document.getElementById("usuario-gracias");

cerrarModalGracias.addEventListener("click", () => {
  modalGracias.classList.add("hidden");
});

btnEnviarReporte.addEventListener("click", async () => {
  if (!mensajeAReportar) return;

  const motivo = document.querySelector("input[name='motivo-reporte']:checked");
  const comentario = document.getElementById("comentario-reporte").value.trim();

  if (!motivo) {
    alert("Selecciona un motivo para el reporte.");
    return;
  }

  const reporte = {
    usuarioReportado: mensajeAReportar.usuario,
    texto: mensajeAReportar.texto,
    motivo: motivo.value,
    comentario: comentario || "",
    fecha: new Date().toISOString(),
    por: usuarioActual || "Anónimo"
  };

  const refReporte = dbRef(db, `reportesManual/${chatContenidoID}`);
  await push(refReporte, reporte);

  modalReporte.classList.add("hidden");

// Mostrar modal de agradecimiento
usuarioGracias.textContent = usuarioActual || "Usuario";
modalGracias.classList.remove("hidden");

});

//prueba 3
// ===== FUNCIONES GLOBALES PARA DEBUGGING =====

window.dogTVApp = {
  data: () => datosContenido,
  restart: () => {
    detenerCarrusel();
    mostrarVistaInicial();
    reanudarCarrusel();
  },
  search: (term) => {
    buscador.value = term;
    buscador.dispatchEvent(new Event('input'));
  }
  //funcion prueba
};


// ===== SUBIR IMAGEN AL SELECCIONAR Y MOSTRAR PREVIEW =====

import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const inputImagen = document.getElementById("imagen-pedido");
const previewImagen = document.getElementById("preview-pedido");

let urlImagenSubida = "";

if (inputImagen) {
  inputImagen.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vista previa
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (previewImagen) {
        previewImagen.src = ev.target.result;
        previewImagen.style.display = "block";
      }
    };
    reader.readAsDataURL(file);

    // Subir a Firebase Storage
    const storage = getStorage();
    const nombreUnico = `peticiones/${Date.now()}_${file.name}`;
    const storageRef = sRef(storage, nombreUnico);
    await uploadBytes(storageRef, file);
    urlImagenSubida = await getDownloadURL(storageRef);
  });
}

// Reemplazar el valor de imagen al enviar formulario
if (formPedir) {
  formPedir.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo-pedido").value.trim();
    if (!titulo || !urlImagenSubida || !usuarioPeticiones) return;

    await push(dbRef(db, "peticiones"), {
      titulo,
      imagen: urlImagenSubida,
      usuario: usuarioPeticiones,
      timestamp: Date.now()
    });

    formPedir.reset();
    urlImagenSubida = "";
    if (previewImagen) {
      previewImagen.src = "";
      previewImagen.style.display = "none";
    }
    cargarPeticiones();
  });
}
