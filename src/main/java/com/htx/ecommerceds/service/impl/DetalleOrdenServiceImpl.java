package com.htx.ecommerceds.service.impl;

import com.htx.ecommerceds.model.DetalleOrden;
import com.htx.ecommerceds.repository.DetalleOrdenRepository;
import com.htx.ecommerceds.service.DetalleOrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DetalleOrdenServiceImpl implements DetalleOrdenService {

	private final DetalleOrdenRepository detalleOrdenRepository;

	@Override
	public List<DetalleOrden> listar() {
		return detalleOrdenRepository.findAll();
	}

	@Override
	public Optional<DetalleOrden> buscarPorId(Integer id) {
		return detalleOrdenRepository.findById(id);
	}

	@Override
	public DetalleOrden guardar(DetalleOrden d) {
		return detalleOrdenRepository.save(d);
	}

	@Override
	public DetalleOrden actualizar(Integer id, DetalleOrden datos) {
		return detalleOrdenRepository.findById(id).map(d -> {
			d.setNombre(datos.getNombre());
			d.setCantidad(datos.getCantidad());
			d.setPrecio(datos.getPrecio());
			d.setTotal(datos.getTotal());
			return detalleOrdenRepository.save(d);
		}).orElseThrow(() -> new IllegalArgumentException("Detalle no encontrado: " + id));
	}

	@Override
	public void eliminar(Integer id) {
		detalleOrdenRepository.deleteById(id);
	}
}