package com.htx.ecommerceds.service.impl;

import com.htx.ecommerceds.model.Producto;
import com.htx.ecommerceds.repository.ProductoRepository;
import com.htx.ecommerceds.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

	private final ProductoRepository productoRepository;

	@Override
	public List<Producto> listar() {
		return productoRepository.findAll();
	}

	@Override
	public Optional<Producto> buscarPorId(Integer id) {
		return productoRepository.findById(id);
	}

	@Override
	public Producto guardar(Producto producto) {
		return productoRepository.save(producto);
	}

	@Override
	public Producto actualizar(Integer id, Producto datos) {
		return productoRepository.findById(id).map(p -> {
			p.setNombre(datos.getNombre());
			p.setDescripcion(datos.getDescripcion());
			p.setImagen(datos.getImagen());
			p.setPrecio(datos.getPrecio());
			p.setCantidad(datos.getCantidad());
			p.setCategoria(datos.getCategoria());
			p.setEstado(datos.getEstado());
			return productoRepository.save(p);
		}).orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + id));
	}

	@Override
	public void eliminar(Integer id) {
		productoRepository.deleteById(id);
	}
}