/* =========================================================
   Spring eCommerce — main.js (Landing page)
   Sin login · Sin localStorage · Estado en memoria
   ========================================================= */

/* ---------------------------------------------------------
   1. Datos de ejemplo
   --------------------------------------------------------- */
const PRODUCTOS = [
  { id: 1, nombre: 'Auriculares Nova Pro',       categoria: 'Audio',      precio: 129.90, color: '#8b5cf6' },
  { id: 2, nombre: 'Smartwatch Pulse S2',        categoria: 'Wearables',  precio: 199.00, color: '#6d28d9' },
  { id: 3, nombre: 'Altavoz Bloom Mini',         categoria: 'Audio',      precio: 79.50,  color: '#a78bfa' },
  { id: 4, nombre: 'Teclado Mecánico Aurora',    categoria: 'Accesorios', precio: 149.99, color: '#7c3aed' },
  { id: 5, nombre: 'Ratón Inalámbrico Glide',    categoria: 'Accesorios', precio: 59.90,  color: '#9333ea' },
  { id: 6, nombre: 'Cámara Instant Spring Snap', categoria: 'Fotografía', precio: 239.00, color: '#5b21b6' },
  { id: 7, nombre: 'Mochila Urbana Vertex',      categoria: 'Lifestyle',  precio: 89.95,  color: '#a855f7' },
  { id: 8, nombre: 'Lámpara de Escritorio Halo', categoria: 'Hogar',      precio: 64.00,  color: '#7e22ce' }
];

const estado = {
  carrito: [],
  tema: 'dark'
};

/* ---------------------------------------------------------
   2. Utilidades
   --------------------------------------------------------- */
const formatoMoneda = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

function generarImagen(nombre, color) {
  const iniciales = nombre
    .split(' ')
    .filter(Boolean)
    .map(palabra => palabra[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="#1b1030"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#g)"/>
      <circle cx="330" cy="60" r="70" fill="rgba(255,255,255,.08)"/>
      <circle cx="60" cy="250" r="90" fill="rgba(255,255,255,.06)"/>
      <text x="50%" y="52%" font-family="Segoe UI, Arial, sans-serif" font-size="92"
            font-weight="700" fill="rgba(255,255,255,.9)" text-anchor="middle"
            dominant-baseline="middle">${iniciales}</text>
    </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}

function mostrarToast(mensaje) {
  const elemento = document.getElementById('toastApp');
  document.getElementById('toastMensaje').textContent = mensaje;
  bootstrap.Toast.getOrCreateInstance(elemento, { delay: 2200 }).show();
}

/* ---------------------------------------------------------
   3. Tema
   --------------------------------------------------------- */
function aplicarTema(tema) {
  estado.tema = tema;
  document.documentElement.setAttribute('data-bs-theme', tema);

  const icono = document.getElementById('iconoTema');
  if (icono) {
    icono.className = tema === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  }
}

function alternarTema() {
  aplicarTema(estado.tema === 'dark' ? 'light' : 'dark');
}

/* ---------------------------------------------------------
   4. Render de productos
   --------------------------------------------------------- */
function renderizarProductos() {
  const contenedor = document.getElementById('rejillaProductos');
  if (!contenedor) return;

  contenedor.innerHTML = PRODUCTOS.map(producto => `
    <div class="col-12 col-sm-6 col-lg-3">
      <article class="card producto-card h-100">
        <img src="${generarImagen(producto.nombre, producto.color)}"
             class="card-img-top" alt="${producto.nombre}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <span class="badge-categoria align-self-start">${producto.categoria}</span>
          <h3 class="h6 fw-bold mt-2 mb-3">${producto.nombre}</h3>
          <div class="mt-auto d-flex align-items-center justify-content-between gap-2">
            <span class="precio">${formatoMoneda.format(producto.precio)}</span>
            <button class="btn btn-primary btn-sm" type="button"
                    data-agregar="${producto.id}" aria-label="Añadir ${producto.nombre} al carrito">
              <i class="bi bi-plus-lg"></i> Añadir
            </button>
          </div>
        </div>
      </article>
    </div>
  `).join('');
}

function renderizarProductoDestacado() {
  const contenedor = document.getElementById('productoDestacado');
  if (!contenedor) return;

  const producto = PRODUCTOS[0];
  contenedor.innerHTML = `
    <img src="${generarImagen(producto.nombre, producto.color)}" class="card-img-top" alt="${producto.nombre}">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge-categoria">Más vendido</span>
        <span class="small texto-suave"><i class="bi bi-star-fill text-warning"></i> 4,9</span>
      </div>
      <h3 class="h5 fw-bold mb-1">${producto.nombre}</h3>
      <p class="small texto-suave mb-3">Cancelación activa de ruido, 40 h de batería y estuche de carga rápida.</p>
      <div class="d-flex align-items-center justify-content-between">
        <span class="precio fs-4 fw-bold text-purple">${formatoMoneda.format(producto.precio)}</span>
        <button class="btn btn-primary" type="button" data-agregar="${producto.id}">
          <i class="bi bi-cart-plus me-1"></i>Añadir
        </button>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------
   5. Carrito (en memoria)
   --------------------------------------------------------- */
function agregarAlCarrito(idProducto) {
  const producto = PRODUCTOS.find(p => p.id === Number(idProducto));
  if (!producto) return;

  const linea = estado.carrito.find(item => item.id === producto.id);
  if (linea) {
    linea.cantidad += 1;
  } else {
    estado.carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      color: producto.color,
      cantidad: 1
    });
  }

  actualizarContadorCarrito();
  renderizarCarrito();
  mostrarToast(`"${producto.nombre}" se añadió al carrito`);
}

function cambiarCantidad(idProducto, delta) {
  const linea = estado.carrito.find(item => item.id === Number(idProducto));
  if (!linea) return;

  linea.cantidad += delta;
  if (linea.cantidad <= 0) {
    estado.carrito = estado.carrito.filter(item => item.id !== Number(idProducto));
  }

  actualizarContadorCarrito();
  renderizarCarrito();
}

function vaciarCarrito() {
  estado.carrito = [];
  actualizarContadorCarrito();
  renderizarCarrito();
}

function actualizarContadorCarrito() {
  const totalUnidades = estado.carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const contador = document.getElementById('contadorCarrito');
  if (contador) contador.textContent = totalUnidades;
}

function renderizarCarrito() {
  const contenedor = document.getElementById('carritoContenido');
  if (!contenedor) return;

  if (estado.carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="text-center my-auto py-5">
        <i class="bi bi-cart-x fs-1 text-purple"></i>
        <p class="mt-3 mb-1 fw-semibold">Tu carrito está vacío</p>
        <p class="small texto-suave">Añade productos para empezar tu compra.</p>
      </div>`;
    return;
  }

  const total = estado.carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  contenedor.innerHTML = `
    <div class="flex-grow-1">
      ${estado.carrito.map(item => `
        <div class="item-carrito">
          <img src="${generarImagen(item.nombre, item.color)}" alt="${item.nombre}">
          <div class="flex-grow-1">
            <div class="fw-semibold small">${item.nombre}</div>
            <div class="small texto-suave">${formatoMoneda.format(item.precio)}</div>
          </div>
          <div class="control-cantidad">
            <button type="button" data-cantidad="${item.id}" data-delta="-1" aria-label="Quitar una unidad">−</button>
            <span class="small fw-bold">${item.cantidad}</span>
            <button type="button" data-cantidad="${item.id}" data-delta="1" aria-label="Añadir una unidad">+</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="pt-3 mt-3 border-top">
      <div class="d-flex justify-content-between mb-3">
        <span class="texto-suave">Total</span>
        <span class="fw-bold fs-5 text-purple">${formatoMoneda.format(total)}</span>
      </div>
      <button class="btn btn-primary w-100 mb-2" type="button" id="botonFinalizarCompra">
        <i class="bi bi-bag-check me-2"></i>Finalizar compra
      </button>
      <button class="btn btn-soft w-100" type="button" id="botonVaciarCarrito">
        Vaciar carrito
      </button>
    </div>
  `;
}

/* ---------------------------------------------------------
   6. Eventos
   --------------------------------------------------------- */
function registrarEventos() {
  document.getElementById('botonTema')?.addEventListener('click', alternarTema);

  document.addEventListener('click', evento => {
    const botonAgregar = evento.target.closest('[data-agregar]');
    if (botonAgregar) {
      agregarAlCarrito(botonAgregar.dataset.agregar);
      return;
    }

    const botonCantidad = evento.target.closest('[data-cantidad]');
    if (botonCantidad) {
      cambiarCantidad(botonCantidad.dataset.cantidad, Number(botonCantidad.dataset.delta));
      return;
    }

    if (evento.target.closest('#botonVaciarCarrito')) {
      vaciarCarrito();
      return;
    }

    if (evento.target.closest('#botonFinalizarCompra')) {
      mostrarToast('¡Gracias por tu compra! (demostración)');
      vaciarCarrito();
    }
  });

  const formularioContacto = document.getElementById('formularioContacto');
  formularioContacto?.addEventListener('submit', evento => {
    evento.preventDefault();

    if (!formularioContacto.checkValidity()) {
      formularioContacto.classList.add('was-validated');
      return;
    }

    const aviso = document.getElementById('mensajeContacto');
    aviso.classList.remove('d-none');
    formularioContacto.reset();
    formularioContacto.classList.remove('was-validated');

    setTimeout(() => aviso.classList.add('d-none'), 5000);
  });
}

/* ---------------------------------------------------------
   7. Arranque
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  aplicarTema('dark');
  renderizarProductos();
  renderizarProductoDestacado();
  renderizarCarrito();
  actualizarContadorCarrito();
  registrarEventos();
});