/* =========================================================
   Spring eCommerce — main.js (Landing page · conectado al API)
   ========================================================= */
let PRODUCTOS = [];
const estado = { carrito: [], tema: 'dark', usuarioId: null };

const formatoMoneda = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
});

function generarImagen(nombre, color) {
    const iniciales = (nombre || '?')
        .split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase();
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#1b1030"/>
      </linearGradient></defs>
      <rect width="400" height="300" fill="url(#g)"/>
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

function aplicarTema(tema) {
    estado.tema = tema;
    document.documentElement.setAttribute('data-bs-theme', tema);
    const icono = document.getElementById('iconoTema');
    if (icono) icono.className = tema === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
}

function alternarTema() { aplicarTema(estado.tema === 'dark' ? 'light' : 'dark'); }

async function cargarProductos() {
    try {
        const r = await fetch('/api/productos');
        if (!r.ok) throw new Error(r.status);
        const raw = await r.json();
        PRODUCTOS = raw.map(p => ({
            id: p.id_producto,
            nombre: p.nombre,
            categoria: p.categoria || 'General',
            precio: p.precio,
            stock: p.cantidad,
            color: '#8b5cf6'
        }));
    } catch (e) {
        console.error('No se pudo cargar el catálogo', e);
        PRODUCTOS = [];
    }
}

function renderizarProductos() {
    const contenedor = document.getElementById('rejillaProductos');
    if (!contenedor) return;
    if (PRODUCTOS.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center texto-suave py-4">Cargando productos…</div>`;
        return;
    }
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
                    data-agregar="${producto.id}" ${producto.stock === 0 ? 'disabled' : ''}>
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
    if (!contenedor || PRODUCTOS.length === 0) return;
    const producto = PRODUCTOS[0];
    contenedor.innerHTML = `
    <img src="${generarImagen(producto.nombre, producto.color)}" class="card-img-top" alt="${producto.nombre}">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge-categoria">Más vendido</span>
        <span class="small texto-suave"><i class="bi bi-star-fill text-warning"></i> 4,9</span>
      </div>
      <h3 class="h5 fw-bold mb-1">${producto.nombre}</h3>
      <p class="small texto-suave mb-3">${producto.categoria}</p>
      <div class="d-flex align-items-center justify-content-between">
        <span class="precio fs-4 fw-bold text-purple">${formatoMoneda.format(producto.precio)}</span>
        <button class="btn btn-primary" type="button" data-agregar="${producto.id}">
          <i class="bi bi-cart-plus me-1"></i>Añadir
        </button>
      </div>
    </div>`;
}

function agregarAlCarrito(idProducto) {
    const producto = PRODUCTOS.find(p => p.id === Number(idProducto));
    if (!producto) return;
    const linea = estado.carrito.find(i => i.id === producto.id);
    if (linea) linea.cantidad += 1;
    else estado.carrito.push({
        id: producto.id, nombre: producto.nombre, precio: producto.precio,
        color: producto.color, cantidad: 1
    });
    actualizarContadorCarrito();
    renderizarCarrito();
    mostrarToast(`"${producto.nombre}" se añadió al carrito`);
}

function cambiarCantidad(idProducto, delta) {
    const linea = estado.carrito.find(i => i.id === Number(idProducto));
    if (!linea) return;
    linea.cantidad += delta;
    if (linea.cantidad <= 0) estado.carrito = estado.carrito.filter(i => i.id !== Number(idProducto));
    actualizarContadorCarrito();
    renderizarCarrito();
}

function vaciarCarrito() {
    estado.carrito = [];
    actualizarContadorCarrito();
    renderizarCarrito();
}

function actualizarContadorCarrito() {
    const total = estado.carrito.reduce((s, i) => s + i.cantidad, 0);
    const c = document.getElementById('contadorCarrito');
    if (c) c.textContent = total;
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
    const total = estado.carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
    contenedor.innerHTML = `
    <div class="flex-grow-1">
      ${estado.carrito.map(i => `
        <div class="item-carrito">
          <img src="${generarImagen(i.nombre, i.color)}" alt="${i.nombre}">
          <div class="flex-grow-1">
            <div class="fw-semibold small">${i.nombre}</div>
            <div class="small texto-suave">${formatoMoneda.format(i.precio)}</div>
          </div>
          <div class="control-cantidad">
            <button type="button" data-cantidad="${i.id}" data-delta="-1">−</button>
            <span class="small fw-bold">${i.cantidad}</span>
            <button type="button" data-cantidad="${i.id}" data-delta="1">+</button>
          </div>
        </div>`).join('')}
    </div>
    <div class="pt-3 mt-3 border-top">
      <div class="d-flex justify-content-between mb-3">
        <span class="texto-suave">Total</span>
        <span class="fw-bold fs-5 text-purple">${formatoMoneda.format(total)}</span>
      </div>
      <button class="btn btn-primary w-100 mb-2" type="button" id="botonFinalizarCompra">
        <i class="bi bi-bag-check me-2"></i>Finalizar compra
      </button>
      <button class="btn btn-soft w-100" type="button" id="botonVaciarCarrito">Vaciar carrito</button>
    </div>`;
}

async function finalizarCompra() {
    if (estado.carrito.length === 0) return;
    const payload = {
        usuarioId: estado.usuarioId,
        pago: 'Tarjeta',
        items: estado.carrito.map(i => ({ productoId: i.id, cantidad: i.cantidad }))
    };
    try {
        const r = await fetch('/api/ordenes/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!r.ok) {
            const err = await r.json().catch(() => ({}));
            throw new Error(err.message || 'Error al procesar la compra');
        }
        mostrarToast('¡Gracias por tu compra! Pedido creado correctamente.');
        vaciarCarrito();
        await cargarProductos();
        renderizarProductos();
    } catch (e) {
        mostrarToast('No se pudo finalizar la compra: ' + e.message);
    }
}

function registrarEventos() {
    document.getElementById('botonTema')?.addEventListener('click', alternarTema);

    document.addEventListener('click', evento => {
        const bAgregar = evento.target.closest('[data-agregar]');
        if (bAgregar) { agregarAlCarrito(bAgregar.dataset.agregar); return; }

        const bCant = evento.target.closest('[data-cantidad]');
        if (bCant) { cambiarCantidad(bCant.dataset.cantidad, Number(bCant.dataset.delta)); return; }

        if (evento.target.closest('#botonVaciarCarrito')) { vaciarCarrito(); return; }
        if (evento.target.closest('#botonFinalizarCompra')) { finalizarCompra(); }
    });

    const form = document.getElementById('formularioContacto');
    form?.addEventListener('submit', evento => {
        evento.preventDefault();
        if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
        const aviso = document.getElementById('mensajeContacto');
        aviso.classList.remove('d-none');
        form.reset();
        form.classList.remove('was-validated');
        setTimeout(() => aviso.classList.add('d-none'), 5000);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    aplicarTema('dark');
    await cargarProductos();
    renderizarProductos();
    renderizarProductoDestacado();
    renderizarCarrito();
    actualizarContadorCarrito();
    registrarEventos();
});