package com.htx.ecommerceds.service;

import com.htx.ecommerceds.model.DetalleOrden;

import java.util.List;
import java.util.Optional;

public interface DetalleOrdenService {
	List<DetalleOrden> listar();

	Optional<DetalleOrden> buscarPorId(Integer id);

	DetalleOrden guardar(DetalleOrden detalle);

	DetalleOrden actualizar(Integer id, DetalleOrden detalle);

	void eliminar(Integer id);
}