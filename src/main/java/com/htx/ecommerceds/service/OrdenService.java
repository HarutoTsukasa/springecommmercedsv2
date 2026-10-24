package com.htx.ecommerceds.service;

import com.htx.ecommerceds.dto.CheckoutRequest;
import com.htx.ecommerceds.model.Orden;

import java.util.List;
import java.util.Optional;

public interface OrdenService {
	List<Orden> listar();

	Optional<Orden> buscarPorId(Integer id);

	Orden guardar(Orden orden);

	Orden actualizar(Integer id, Orden orden);

	void eliminar(Integer id);

	Orden checkout(CheckoutRequest request);
}