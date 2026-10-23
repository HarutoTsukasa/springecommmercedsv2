/* =========================================================
   Spring eCommerce — admin.js (Dashboard de administración)
   Sin login · Sin localStorage · Estado en memoria
   ========================================================= */

/* ---------------------------------------------------------
   1. Datos de ejemplo
   --------------------------------------------------------- */
let productos = [
  { id: 1, nombre: 'Auriculares Nova Pro',       categoria: 'Audio',      precio: 129.90, stock: 48, estado: 'Activo',   color: '#8b5cf6' },
  { id: 2, nombre: 'Smartwatch Pulse S2',        categoria: 'Wearables',  precio: 199.00, stock: 23, estado: 'Activo',   color: '#6d28d9' },
  { id: 3, nombre: 'Altavoz Bloom Mini',         categoria: 'Audio',      precio: 79.50,  stock: 0,  estado: 'Agotado',  color: '#a78bfa' },
  { id: 4, nombre: 'Teclado Mecánico Aurora',    categoria: 'Accesorios', precio: 149.99, stock: 31, estado: 'Activo',   color: '#7c3aed' },
  { id: 5, nombre: 'Ratón Inalámbrico Glide',    categoria: 'Accesorios', precio: 59.90,  stock: 76, estado: 'Activo',   color: '#9333ea' },
  { id: 6, nombre: 'Cámara Instant Spring Snap', categoria: 'Fotografía', precio: 239.00, stock: 12, estado: 'Activo',   color: '#5b21b6' },
  { id: 7, nombre: 'Mochila Urbana Vertex',      categoria: 'Lifestyle',  precio: 89.95,  stock: 5,  estado: 'Activo',   color: '#a855f7' },
  { id: 8, nombre: 'Lámpara de Escritorio Halo', categoria: 'Hogar',      precio: 64.00,  stock: 0,  estado: 'Borrador', color: '#7e22ce' }
];

const PEDIDOS = [
  { id: '#SP-1042', cliente: 'Lucía Ferrer',   fecha: '12/05/2025', pago: 'Tarjeta', total: 249.90, estado: 'Enviado' },
  { id: '#SP-1041', cliente: 'Marcos Delgado', fecha: '12/05/2025', pago: 'PayPal',  total: 79.50,  estado: 'Procesando' },
  { id: '#SP-1040', cliente: 'Elena Navarro',  fecha: '11/05/2025', pago: 'Bizum',   total: 398.00, estado: 'Entregado' },
  { id: '#SP-1039', cliente: 'Javier Ortega',  fecha: '11/05/2025', pago: 'Tarjeta', total: 149.99, estado: 'Pendiente' },
  { id: '#SP-1038', cliente: 'Sofía Ramírez',  fecha: '10/05/2025', pago: 'Tarjeta', total: 59.90,  estado: 'Cancelado' },
  { id: '#SP-1037', cliente: 'Daniela Castro', fecha: '10/05/2025', pago: 'PayPal',  total: 239.00, estado: 'Enviado' },
  { id: '#SP-1036', cliente: 'Pablo Iglesias', fecha: '09/05/2025', pago: 'Bizum',   total: 89.95,  estado: 'Entregado' },
  { id: '#SP-1035', cliente: 'Nerea Solís',    fecha: '09/05/2025', pago: 'Tarjeta', total: 328.90, estado: 'Procesando' },
  { id: '#SP-1034', cliente: 'Álvaro Benítez', fecha: '08/05/2025', pago: 'Tarjeta', total: 64.00,  estado: 'Entregado' },
  { id: '#SP-1033', cliente: 'Carmen Rivas',   fecha: '08/05/2025', pago: 'PayPal',  total: 199.00, estado: 'Pendiente' },
  { id: '#SP-1032', cliente: 'Iván Molina',    fecha: '07/05/2025', pago: 'Bizum',   total: 129.90, estado: 'Enviado' },
  { id: '#SP-1031', cliente: 'Paula Serrano',  fecha: '07/05/2025', pago: 'Tarjeta', total: 458.90, estado: 'Entregado' }
];

const CLIENTES = [
  { nombre: 'Lucía Ferrer',   email: 'lucia.ferrer@mail.com',   pedidos: 14, gasto: 1842.50, alta: '03/02/2024', estado: 'Activo' },
  { nombre: 'Marcos Delgado', email: 'marcos.delgado@mail.com', pedidos: 9,  gasto: 987.30,  alta: '18/04/2024', estado: 'Activo' },
  { nombre: 'Elena Navarro',  email: 'elena.navarro@mail.com',  pedidos: 21, gasto: 3120.00, alta: '11/11/2023', estado: 'VIP' },
  { nombre: 'Javier Ortega',  email: 'javier.ortega@mail.com',  pedidos: 4,  gasto: 349.98,  alta: '22/09/2024', estado: 'Activo' },
  { nombre: 'Sofía Ramírez',  email: 'sofia.ramirez@mail.com',  pedidos: 2,  gasto: 119.80,  alta: '07/01/2025', estado: 'Inactivo' },
  { nombre: 'Daniela Castro', email: 'daniela.castro@mail.com', pedidos: 11, gasto: 1570.20, alta: '29/06/2024', estado: 'Activo' },
  { nombre: 'Pablo Iglesias', email: 'pablo.iglesias@mail.com', pedidos: 6,  gasto: 512.60,  alta: '14/03/2024', estado: 'Activo' },
  { nombre: 'Nerea Solís',    email: 'nerea.solis@mail.com',    pedidos: 17, gasto: 2284.10, alta: '05/08/2023', estado: 'VIP' }
];

const VENTAS_MENSUALES = {
  etiquetas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  valores: [12400, 15800, 14200, 18900, 21700, 19800, 24300, 26100, 23400, 27900, 31200, 34800]
};

/* ---------------------------------------------------------
   2. Estado del módulo
   --------------------------------------------------------- */
let tablaPedidos = null;
let tablaProductos = null;
let tablaClientes = null;
let graficoVentas = null;
let temaActual = 'dark';

const formatoMoneda = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const formatoNumero = new Intl.NumberFormat('es-ES');

const IDIOMA_TABLAS = {
  search: 'Buscar:',
  searchPlaceholder: 'Escribe para filtrar...',
  lengthMenu: 'Mostrar _MENU_ registros',
  info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
  infoEmpty: 'Sin registros disponibles',
  infoFiltered: '(filtrado de _MAX_ registros totales)',
  zeroRecords: 'No se encontraron resultados',
  emptyTable: 'No hay datos disponibles en la tabla',
  paginate: { first: 'Primera', previous: 'Anterior', next: 'Siguiente', last: 'Última' }
};

/* ---------------------------------------------------------
   3. Utilidades
   --------------------------------------------------------- */
function generarImagen(nombre, color) {
  const iniciales = nombre
    .split(' ')
    .filter(Boolean)
    .map(palabra => palabra[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="#1b1030"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#g)"/>
      <text x="50%" y="52%" font-family="Segoe UI, Arial, sans-serif" font-size="72"
            font-weight="700" fill="rgba(255,255,255,.9)" text-anchor="middle"
            dominant-baseline="middle">${iniciales}</text>
    </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}

function claseEstadoPedido(estado) {
  const mapa = {
    'Pendiente':  'estado-pendiente',
    'Procesando': 'estado-procesando',
    'Enviado':    'estado-enviado',
    'Entregado':  'estado-entregado',
    'Cancelado':  'estado-cancelado'
  };
  return mapa[estado] || 'estado-borrador';
}

function claseEstadoProducto(estado) {
  const mapa = {
    'Activo':   'estado-activo',
    'Agotado':  'estado-agotado',
    'Borrador': 'estado-borrador'
  };
  return mapa[estado] || 'estado-borrador';
}

function badgePedido(estado) {
  return `<span class="estado-badge ${claseEstadoPedido(estado)}">${estado}</span>`;
}

function badgeProducto(estado) {
  return `<span class="estado-badge ${claseEstadoProducto(estado)}">${estado}</span>`;
}

/* ---------------------------------------------------------
   4. Tema
   --------------------------------------------------------- */
function aplicarTema(tema) {
  temaActual = tema;
  document.documentElement.setAttribute('data-bs-theme', tema);

  const icono = document.getElementById('iconoTemaAdmin');
  if (icono) {
    icono.className = tema === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  }

  if (graficoVentas) {
    const colorTexto = tema === 'dark' ? '#a49cba' : '#6a6285';
    const colorLinea = tema === 'dark' ? 'rgba(167, 139, 250, .2)' : 'rgba(109, 40, 217, .15)';

    graficoVentas.options.scales.x.ticks.color = colorTexto;
    graficoVentas.options.scales.y.ticks.color = colorTexto;
    graficoVentas.options.scales.y.grid.color = colorLinea;
    graficoVentas.options.scales.x.grid.color = colorLinea;
    graficoVentas.update();
  }
}

/* ---------------------------------------------------------
   5. Últimos pedidos
   --------------------------------------------------------- */
function renderizarUltimosPedidos() {
  const cuerpo = document.getElementById('tablaUltimosPedidos');
  if (!cuerpo) return;

  cuerpo.innerHTML = PEDIDOS.slice(0, 5).map(pedido => `
    <tr>
      <td class="fw-semibold">${pedido.id}</td>
      <td>${pedido.cliente}</td>
      <td class="texto-suave">${pedido.fecha}</td>
      <td class="fw-semibold">${formatoMoneda.format(pedido.total)}</td>
      <td>${badgePedido(pedido.estado)}</td>
    </tr>
  `).join('');
}

/* ---------------------------------------------------------
   6. DataTables
   --------------------------------------------------------- */
function inicializarTablaPedidos() {
  tablaPedidos = new DataTable('#tablaPedidos', {
    data: PEDIDOS,
    language: IDIOMA_TABLAS,
    pageLength: 8,
    order: [[2, 'desc']],
    columns: [
      { data: 'id',      render: d => `<span class="fw-semibold">${d}</span>` },
      { data: 'cliente' },
      { data: 'fecha',   render: d => `<span class="texto-suave">${d}</span>` },
      { data: 'pago' },
      { data: 'total',   render: d => `<span class="fw-semibold">${formatoMoneda.format(d)}</span>` },
      { data: 'estado',  render: d => badgePedido(d) }
    ]
  });
}

function inicializarTablaProductos() {
  tablaProductos = new DataTable('#tablaProductos', {
    data: productos,
    language: IDIOMA_TABLAS,
    pageLength: 8,
    order: [[0, 'asc']],
    columns: [
      {
        data: 'nombre',
        render: (d, t, fila) => `
          <div class="d-flex align-items-center gap-2">
            <img src="${generarImagen(fila.nombre, fila.color)}" class="miniatura" alt="">
            <span class="fw-semibold">${d}</span>
          </div>`
      },
      { data: 'categoria', render: d => `<span class="small texto-suave">${d}</span>` },
      { data: 'precio',    render: d => `<span class="fw-semibold">${formatoMoneda.format(d)}</span>` },
      { data: 'stock' },
      { data: 'estado',    render: d => badgeProducto(d) },
      {
        data: null,
        orderable: false,
        searchable: false,
        className: 'text-end',
        render: (d, t, fila) => `
          <button class="btn btn-sm btn-soft me-1" data-editar="${fila.id}" title="Editar">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-eliminar="${fila.id}" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>`
      }
    ]
  });
}

function inicializarTablaClientes() {
  tablaClientes = new DataTable('#tablaClientes', {
    data: CLIENTES,
    language: IDIOMA_TABLAS,
    pageLength: 8,
    order: [[2, 'desc']],
    columns: [
      { data: 'nombre', render: d => `<span class="fw-semibold">${d}</span>` },
      { data: 'email',  render: d => `<span class="texto-suave small">${d}</span>` },
      { data: 'pedidos' },
      { data: 'gasto',  render: d => `<span class="fw-semibold">${formatoMoneda.format(d)}</span>` },
      { data: 'alta',   render: d => `<span class="texto-suave small">${d}</span>` },
      {
        data: 'estado',
        render: d => {
          const clase = d === 'VIP' ? 'estado-procesando' : (d === 'Activo' ? 'estado-activo' : 'estado-borrador');
          return `<span class="estado-badge ${clase}">${d}</span>`;
        }
      }
    ]
  });
}

function refrescarTablaProductos() {
  if (!tablaProductos) return;
  tablaProductos.clear();
  tablaProductos.rows.add(productos);
  tablaProductos.draw();
}

/* ---------------------------------------------------------
   7. Gráfico de ventas
   --------------------------------------------------------- */
function inicializarGrafico() {
  const canvas = document.getElementById('graficoVentas');
  if (!canvas) return;

  const colorTexto = temaActual === 'dark' ? '#a49cba' : '#6a6285';
  const colorLinea = temaActual === 'dark' ? 'rgba(167, 139, 250, .2)' : 'rgba(109, 40, 217, .15)';

  const contexto = canvas.getContext('2d');
  const degradado = contexto.createLinearGradient(0, 0, 0, 300);
  degradado.addColorStop(0, 'rgba(139, 92, 246, .55)');
  degradado.addColorStop(1, 'rgba(139, 92, 246, 0)');

  graficoVentas = new Chart(contexto, {
    type: 'line',
    data: {
      labels: VENTAS_MENSUALES.etiquetas,
      datasets: [{
        label: 'Ventas (€)',
        data: VENTAS_MENSUALES.valores,
        borderColor: '#8b5cf6',
        backgroundColor: degradado,
        borderWidth: 3,
        tension: .38,
        fill: true,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(23, 18, 39, .95)',
          borderColor: '#8b5cf6',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (contextoItem) => `${formatoMoneda.format(contextoItem.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: colorTexto, font: { size: 12 } },
          grid: { color: colorLinea, drawBorder: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: colorTexto,
            font: { size: 12 },
            callback: (valor) => formatoNumero.format(valor) + ' €'
          },
          grid: { color: colorLinea, drawBorder: false }
        }
      }
    }
  });
}

/* ---------------------------------------------------------
   8. Navegación entre secciones
   --------------------------------------------------------- */
const TITULOS_SECCION = {
  dashboard: 'Dashboard',
  pedidos:   'Pedidos',
  productos: 'Productos',
  clientes:  'Clientes'
};

function mostrarSeccion(nombre) {
  document.querySelectorAll('.seccion-panel').forEach(s => s.classList.add('d-none'));
  document.getElementById(`seccion-${nombre}`)?.classList.remove('d-none');

  document.querySelectorAll('.nav-panel .nav-link[data-seccion]').forEach(enlace => {
    enlace.classList.toggle('active', enlace.dataset.seccion === nombre);
  });

  const titulo = document.getElementById('tituloSeccion');
  if (titulo) titulo.textContent = TITULOS_SECCION[nombre] || 'Dashboard';

  document.getElementById('sidebar')?.classList.remove('abierto');
  document.getElementById('sidebarBackdrop')?.classList.remove('visible');
}

/* ---------------------------------------------------------
   9. CRUD de productos
   --------------------------------------------------------- */
function abrirModalProducto(idProducto = null) {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalProducto'));
  const titulo = document.getElementById('tituloModalProducto');

  if (idProducto) {
    const producto = productos.find(p => p.id === Number(idProducto));
    if (!producto) return;

    titulo.textContent = 'Editar producto';
    document.getElementById('productoId').value        = producto.id;
    document.getElementById('productoNombre').value    = producto.nombre;
    document.getElementById('productoCategoria').value = producto.categoria;
    document.getElementById('productoPrecio').value   = producto.precio;
    document.getElementById('productoStock').value    = producto.stock;
    document.getElementById('productoEstado').value   = producto.estado;
  } else {
    titulo.textContent = 'Nuevo producto';
    document.getElementById('formularioProducto').reset();
    document.getElementById('productoId').value = '';
  }

  modal.show();
}

function guardarProducto(evento) {
  evento.preventDefault();

  const formulario = document.getElementById('formularioProducto');
  if (!formulario.checkValidity()) {
    formulario.classList.add('was-validated');
    return;
  }

  const id = document.getElementById('productoId').value;
  const datos = {
    nombre:    document.getElementById('productoNombre').value.trim(),
    categoria: document.getElementById('productoCategoria').value.trim(),
    precio:    parseFloat(document.getElementById('productoPrecio').value),
    stock:     parseInt(document.getElementById('productoStock').value, 10),
    estado:    document.getElementById('productoEstado').value
  };

  if (id) {
    const indice = productos.findIndex(p => p.id === Number(id));
    if (indice !== -1) {
      productos[indice] = { ...productos[indice], ...datos };
    }
  } else {
    const nuevoId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    const color = `hsl(${Math.floor(Math.random() * 60) + 250}, 70%, 55%)`;
    productos.push({ id: nuevoId, color, ...datos });
  }

  refrescarTablaProductos();
  formulario.classList.remove('was-validated');
  bootstrap.Modal.getInstance(document.getElementById('modalProducto'))?.hide();
}

function eliminarProducto(idProducto) {
  if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

  productos = productos.filter(p => p.id !== Number(idProducto));
  refrescarTablaProductos();
}

/* ---------------------------------------------------------
   10. Listeners
   --------------------------------------------------------- */
function registrarEventos() {
  document.getElementById('botonMenu')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('abierto');
    document.getElementById('sidebarBackdrop')?.classList.toggle('visible');
  });

  document.getElementById('sidebarBackdrop')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('abierto');
    document.getElementById('sidebarBackdrop')?.classList.remove('visible');
  });

  document.querySelectorAll('.nav-panel .nav-link[data-seccion]').forEach(enlace => {
    enlace.addEventListener('click', evento => {
      evento.preventDefault();
      mostrarSeccion(enlace.dataset.seccion);
    });
  });

  document.querySelectorAll('[data-ir-a]').forEach(boton => {
    boton.addEventListener('click', () => mostrarSeccion(boton.dataset.irA));
  });

  document.getElementById('botonNuevoProducto')?.addEventListener('click', () => abrirModalProducto());
  document.getElementById('formularioProducto')?.addEventListener('submit', guardarProducto);

  document.addEventListener('click', evento => {
    const botonEditar = evento.target.closest('[data-editar]');
    if (botonEditar) {
      abrirModalProducto(botonEditar.dataset.editar);
      return;
    }

    const botonEliminar = evento.target.closest('[data-eliminar]');
    if (botonEliminar) {
      eliminarProducto(botonEliminar.dataset.eliminar);
    }
  });
}

/* ---------------------------------------------------------
   11. Arranque — sin login, directo al dashboard
   --------------------------------------------------------- */

/**
 * Ejecuta una función de inicialización protegida con try/catch.
 * Si una parte falla (CDN, DataTables, Chart.js...), el resto
 * del dashboard (incluido el botón de tema) sigue funcionando.
 */
function inicializarConSeguridad(fn, nombre) {
  try {
    fn();
  } catch (error) {
    console.error(`[Spring admin] Error al inicializar ${nombre}:`, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Listener del botón de tema PRIMERO, para que nunca dependa
  //    del éxito de las tablas o del gráfico.
  const botonTema = document.getElementById('botonTemaAdmin');
  if (botonTema) {
    botonTema.addEventListener('click', () => {
      aplicarTema(temaActual === 'dark' ? 'light' : 'dark');
    });
  }

  // 2. Aplicar el tema oscuro por defecto.
  aplicarTema('dark');

  // 3. Registrar el resto de listeners de la interfaz.
  inicializarConSeguridad(registrarEventos, 'listeners de la interfaz');

  // 4. Inicializar cada bloque por separado (uno no bloquea a otro).
  inicializarConSeguridad(renderizarUltimosPedidos, 'últimos pedidos');
  inicializarConSeguridad(inicializarGrafico, 'gráfico de ventas');
  inicializarConSeguridad(inicializarTablaPedidos, 'tabla de pedidos');
  inicializarConSeguridad(inicializarTablaProductos, 'tabla de productos');
  inicializarConSeguridad(inicializarTablaClientes, 'tabla de clientes');
});