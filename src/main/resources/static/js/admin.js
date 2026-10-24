/* =========================================================
   Spring eCommerce — admin.js (conectado al API)
   ========================================================= */
let tablaPedidos = null, tablaProductos = null, tablaClientes = null;
let graficoVentas = null;
let temaActual = 'dark';
let productosCache = [];

const formatoMoneda = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
});
const formatoNumero = new Intl.NumberFormat('es-ES');

const IDIOMA_TABLAS = {
    search: 'Buscar:', searchPlaceholder: 'Escribe para filtrar...',
    lengthMenu: 'Mostrar _MENU_ registros',
    info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
    infoEmpty: 'Sin registros', infoFiltered: '(filtrado de _MAX_)',
    zeroRecords: 'Sin resultados', emptyTable: 'Sin datos',
    paginate: { first: 'Primera', previous: 'Anterior', next: 'Siguiente', last: 'Última' }
};

function generarImagen(nombre, color) {
    const iniciales = (nombre || '?').split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#1b1030"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#g)"/>
    <text x="50%" y="52%" font-family="Segoe UI" font-size="72" font-weight="700"
          fill="rgba(255,255,255,.9)" text-anchor="middle" dominant-baseline="middle">${iniciales}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}

const claseEstadoPedido = e => ({
    'Pendiente': 'estado-pendiente', 'Procesando': 'estado-procesando',
    'Enviado': 'estado-enviado', 'Entregado': 'estado-entregado', 'Cancelado': 'estado-cancelado'
}[e] || 'estado-borrador');
const claseEstadoProducto = e => ({
    'Activo': 'estado-activo', 'Agotado': 'estado-agotado', 'Borrador': 'estado-borrador'
}[e] || 'estado-borrador');
const badgePedido = e => `<span class="estado-badge ${claseEstadoPedido(e)}">${e}</span>`;
const badgeProducto = e => `<span class="estado-badge ${claseEstadoProducto(e)}">${e}</span>`;

function aplicarTema(tema) {
    temaActual = tema;
    document.documentElement.setAttribute('data-bs-theme', tema);
    const icono = document.getElementById('iconoTemaAdmin');
    if (icono) icono.className = tema === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    if (graficoVentas) {
        const ct = tema === 'dark' ? '#a49cba' : '#6a6285';
        const cl = tema === 'dark' ? 'rgba(167,139,250,.2)' : 'rgba(109,40,217,.15)';
        graficoVentas.options.scales.x.ticks.color = ct;
        graficoVentas.options.scales.y.ticks.color = ct;
        graficoVentas.options.scales.y.grid.color = cl;
        graficoVentas.options.scales.x.grid.color = cl;
        graficoVentas.update();
    }
}

async function cargarUltimosPedidos() {
    const cuerpo = document.getElementById('tablaUltimosPedidos');
    if (!cuerpo) return;
    const r = await fetch('/api/ordenes');
    const ordenes = await r.json();
    cuerpo.innerHTML = ordenes.slice(0, 5).map(o => `
    <tr>
      <td class="fw-semibold">${o.numero || ('#' + o.id_orden)}</td>
      <td>${o.usuario?.nombre || 'Invitado'}</td>
      <td class="texto-suave">${(o.fechacreacion || '').toString().slice(0, 10)}</td>
      <td class="fw-semibold">${formatoMoneda.format(o.total || 0)}</td>
      <td>${badgePedido(o.estado || 'Pendiente')}</td>
    </tr>`).join('');
}

async function cargarTablaPedidos() {
    const r = await fetch('/api/ordenes');
    const ordenes = await r.json();
    if (tablaPedidos) { tablaPedidos.clear().rows.add(ordenes).draw(); return; }
    tablaPedidos = new DataTable('#tablaPedidos', {
        data: ordenes, language: IDIOMA_TABLAS, pageLength: 8,
        columns: [
            { data: 'numero', render: d => `<span class="fw-semibold">${d || ''}</span>` },
            { data: 'usuario', render: d => d?.nombre || 'Invitado' },
            { data: 'fechacreacion', render: d => `<span class="texto-suave">${(d || '').toString().slice(0, 10)}</span>` },
            { data: 'pago', render: d => d || '-' },
            { data: 'total', render: d => `<span class="fw-semibold">${formatoMoneda.format(d || 0)}</span>` },
            { data: 'estado', render: d => badgePedido(d || 'Pendiente') }
        ]
    });
}

async function cargarTablaProductos() {
    const r = await fetch('/api/productos');
    productosCache = await r.json();
    if (tablaProductos) { tablaProductos.clear().rows.add(productosCache).draw(); return; }
    tablaProductos = new DataTable('#tablaProductos', {
        data: productosCache, language: IDIOMA_TABLAS, pageLength: 8,
        columns: [
            {
                data: 'nombre', render: (d, t, fila) => `
          <div class="d-flex align-items-center gap-2">
            <img src="${generarImagen(d, '#8b5cf6')}" class="miniatura" alt="">
            <span class="fw-semibold">${d}</span>
          </div>` },
            { data: 'categoria', render: d => `<span class="small texto-suave">${d || '-'}</span>` },
            { data: 'precio', render: d => `<span class="fw-semibold">${formatoMoneda.format(d || 0)}</span>` },
            { data: 'cantidad' },
            { data: 'estado', render: d => badgeProducto(d || 'Activo') },
            {
                data: null, orderable: false, searchable: false, className: 'text-end',
                render: (d, t, fila) => `
          <button class="btn btn-sm btn-soft me-1" data-editar="${fila.id_producto}" title="Editar">
            <i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" data-eliminar="${fila.id_producto}" title="Eliminar">
            <i class="bi bi-trash"></i></button>` }
        ]
    });
}

async function cargarTablaClientes() {
    const r = await fetch('/api/usuarios');
    const usuarios = await r.json();
    if (tablaClientes) { tablaClientes.clear().rows.add(usuarios).draw(); return; }
    tablaClientes = new DataTable('#tablaClientes', {
        data: usuarios, language: IDIOMA_TABLAS, pageLength: 8,
        columns: [
            { data: 'nombre', render: d => `<span class="fw-semibold">${d || '-'}</span>` },
            { data: 'email', render: d => `<span class="texto-suave small">${d || '-'}</span>` },
            { data: null, render: () => '—' },
            { data: null, render: () => '—' },
            { data: null, render: () => '—' },
            { data: 'rol', render: d => `<span class="estado-badge ${d === 'ADMIN' ? 'estado-procesando' : 'estado-activo'}">${d}</span>` }
        ]
    });
}

function inicializarGrafico() {
    const canvas = document.getElementById('graficoVentas');
    if (!canvas) return;
    const colorTexto = temaActual === 'dark' ? '#a49cba' : '#6a6285';
    const colorLinea = temaActual === 'dark' ? 'rgba(167,139,250,.2)' : 'rgba(109,40,217,.15)';
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, 'rgba(139,92,246,.55)');
    grad.addColorStop(1, 'rgba(139,92,246,0)');
    graficoVentas = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ventas (€)',
                data: [12400, 15800, 14200, 18900, 21700, 19800, 24300, 26100, 23400, 27900, 31200, 34800],
                borderColor: '#8b5cf6', backgroundColor: grad, borderWidth: 3, tension: .38, fill: true,
                pointBackgroundColor: '#8b5cf6', pointBorderColor: '#fff', pointBorderWidth: 2,
                pointRadius: 5, pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(23,18,39,.95)', borderColor: '#8b5cf6', borderWidth: 1,
                    callbacks: { label: c => formatoMoneda.format(c.parsed.y) }
                }
            },
            scales: {
                x: { ticks: { color: colorTexto }, grid: { color: colorLinea } },
                y: {
                    beginAtZero: true, ticks: { color: colorTexto, callback: v => formatoNumero.format(v) + ' €' },
                    grid: { color: colorLinea }
                }
            }
        }
    });
}

const TITULOS_SECCION = { dashboard: 'Dashboard', pedidos: 'Pedidos', productos: 'Productos', clientes: 'Clientes' };
function mostrarSeccion(nombre) {
    document.querySelectorAll('.seccion-panel').forEach(s => s.classList.add('d-none'));
    document.getElementById(`seccion-${nombre}`)?.classList.remove('d-none');
    document.querySelectorAll('.nav-panel .nav-link[data-seccion]').forEach(e => {
        e.classList.toggle('active', e.dataset.seccion === nombre);
    });
    const t = document.getElementById('tituloSeccion');
    if (t) t.textContent = TITULOS_SECCION[nombre] || 'Dashboard';
    document.getElementById('sidebar')?.classList.remove('abierto');
    document.getElementById('sidebarBackdrop')?.classList.remove('visible');
}

function abrirModalProducto(idProducto = null) {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalProducto'));
    const titulo = document.getElementById('tituloModalProducto');
    if (idProducto) {
        const p = productosCache.find(x => x.id_producto === Number(idProducto));
        if (!p) return;
        titulo.textContent = 'Editar producto';
        document.getElementById('productoId').value = p.id_producto;
        document.getElementById('productoNombre').value = p.nombre;
        document.getElementById('productoCategoria').value = p.categoria || '';
        document.getElementById('productoPrecio').value = p.precio;
        document.getElementById('productoStock').value = p.cantidad;
        document.getElementById('productoEstado').value = p.estado || 'Activo';
    } else {
        titulo.textContent = 'Nuevo producto';
        document.getElementById('formularioProducto').reset();
        document.getElementById('productoId').value = '';
    }
    modal.show();
}

async function guardarProducto(evento) {
    evento.preventDefault();
    const form = document.getElementById('formularioProducto');
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

    const id = document.getElementById('productoId').value;
    const payload = {
        nombre: document.getElementById('productoNombre').value.trim(),
        categoria: document.getElementById('productoCategoria').value.trim(),
        precio: parseFloat(document.getElementById('productoPrecio').value),
        cantidad: parseInt(document.getElementById('productoStock').value, 10),
        estado: document.getElementById('productoEstado').value
    };
    try {
        const url = id ? `/api/productos/${id}` : '/api/productos';
        const method = id ? 'PUT' : 'POST';
        const r = await fetch(url, {
            method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!r.ok) throw new Error('Error al guardar');
        form.classList.remove('was-validated');
        bootstrap.Modal.getInstance(document.getElementById('modalProducto'))?.hide();
        await cargarTablaProductos();
    } catch (e) {
        alert('No se pudo guardar: ' + e.message);
    }
}

async function eliminarProducto(idProducto) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
        await fetch(`/api/productos/${idProducto}`, { method: 'DELETE' });
        await cargarTablaProductos();
    } catch (e) {
        alert('No se pudo eliminar: ' + e.message);
    }
}

function registrarEventos() {
    document.getElementById('botonMenu')?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.toggle('abierto');
        document.getElementById('sidebarBackdrop')?.classList.toggle('visible');
    });
    document.getElementById('sidebarBackdrop')?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.remove('abierto');
        document.getElementById('sidebarBackdrop')?.classList.remove('visible');
    });
    document.querySelectorAll('.nav-panel .nav-link[data-seccion]').forEach(e => {
        e.addEventListener('click', ev => { ev.preventDefault(); mostrarSeccion(e.dataset.seccion); });
    });
    document.querySelectorAll('[data-ir-a]').forEach(b => {
        b.addEventListener('click', () => mostrarSeccion(b.dataset.irA));
    });
    document.getElementById('botonNuevoProducto')?.addEventListener('click', () => abrirModalProducto());
    document.getElementById('formularioProducto')?.addEventListener('submit', guardarProducto);
    document.addEventListener('click', evento => {
        const be = evento.target.closest('[data-editar]'); if (be) { abrirModalProducto(be.dataset.editar); return; }
        const bx = evento.target.closest('[data-eliminar]'); if (bx) { eliminarProducto(bx.dataset.eliminar); }
    });
}

function initSafe(fn, nombre) { try { return fn(); } catch (e) { console.error('Fallo ' + nombre, e); } }

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('botonTemaAdmin')?.addEventListener('click', () => {
        aplicarTema(temaActual === 'dark' ? 'light' : 'dark');
    });
    aplicarTema('dark');
    initSafe(registrarEventos, 'listeners');
    initSafe(inicializarGrafico, 'grafico');
    initSafe(() => cargarUltimosPedidos().catch(e => console.error(e)), 'ultimos pedidos');
    initSafe(() => cargarTablaPedidos().catch(e => console.error(e)), 'tabla pedidos');
    initSafe(() => cargarTablaProductos().catch(e => console.error(e)), 'tabla productos');
    initSafe(() => cargarTablaClientes().catch(e => console.error(e)), 'tabla clientes');
});