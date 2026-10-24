package com.htx.ecommerceds.service.impl;

import com.htx.ecommerceds.dto.CheckoutRequest;
import com.htx.ecommerceds.model.DetalleOrden;
import com.htx.ecommerceds.model.Orden;
import com.htx.ecommerceds.model.Producto;
import com.htx.ecommerceds.model.Usuario;
import com.htx.ecommerceds.repository.OrdenRepository;
import com.htx.ecommerceds.repository.ProductoRepository;
import com.htx.ecommerceds.repository.UsuarioRepository;
import com.htx.ecommerceds.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrdenServiceImpl implements OrdenService {

	private final OrdenRepository ordenRepository;
	private final ProductoRepository productoRepository;
	private final UsuarioRepository usuarioRepository;

	@Override
	public List<Orden> listar() {
		return ordenRepository.findAll();
	}

	@Override
	public Optional<Orden> buscarPorId(Integer id) {
		return ordenRepository.findById(id);
	}

	@Override
	public Orden guardar(Orden orden) {
		return ordenRepository.save(orden);
	}

	@Override
	public Orden actualizar(Integer id, Orden datos) {
		return ordenRepository.findById(id).map(o -> {
			o.setEstado(datos.getEstado());
			o.setPago(datos.getPago());
			return ordenRepository.save(o);
		}).orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + id));
	}

	@Override
	public void eliminar(Integer id) {
		ordenRepository.deleteById(id);
	}

	@Override
	@Transactional
	public Orden checkout(CheckoutRequest request) {
		if (request.items() == null || request.items().isEmpty()) {
			throw new IllegalArgumentException("El carrito está vacío");
		}

		Usuario usuario = null;
		if (request.usuarioId() != null) {
			usuario = usuarioRepository.findById(request.usuarioId())
					.orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
		}

		Orden orden = new Orden();
		orden.setNumero("ORD-" + System.currentTimeMillis());
		orden.setFechacreacion(LocalDateTime.now());
		orden.setEstado("Pendiente");
		orden.setPago(request.pago() != null ? request.pago() : "Tarjeta");
		orden.setUsuario(usuario);

		List<DetalleOrden> detalles = new ArrayList<>();
		BigDecimal total = BigDecimal.ZERO;

		for (CheckoutRequest.Item item : request.items()) {
			Producto producto = productoRepository.findById(item.productoId())
					.orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + item.productoId()));

			if (producto.getCantidad() == null || producto.getCantidad() < item.cantidad()) {
				throw new IllegalArgumentException("Stock insuficiente para: " + producto.getNombre());
			}

			DetalleOrden d = new DetalleOrden();
			d.setOrden(orden);
			d.setProducto(producto);
			d.setNombre(producto.getNombre());
			d.setCantidad(item.cantidad());
			d.setPrecio(producto.getPrecio());

			BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(item.cantidad()));
			d.setTotal(subtotal);
			total = total.add(subtotal);

			detalles.add(d);

			producto.setCantidad(producto.getCantidad() - item.cantidad());
			if (producto.getCantidad() == 0)
				producto.setEstado("Agotado");
			productoRepository.save(producto);
		}

		orden.setDetalle(detalles);
		orden.setTotal(total);
		return ordenRepository.save(orden);
	}
}