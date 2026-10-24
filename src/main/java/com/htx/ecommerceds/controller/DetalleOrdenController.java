package com.htx.ecommerceds.controller;

import com.htx.ecommerceds.model.DetalleOrden;
import com.htx.ecommerceds.service.DetalleOrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalles")
@RequiredArgsConstructor
public class DetalleOrdenController {

	private final DetalleOrdenService detalleOrdenService;

	@GetMapping
	public List<DetalleOrden> listar() {
		return detalleOrdenService.listar();
	}

	@GetMapping("/{id}")
	public ResponseEntity<DetalleOrden> buscar(@PathVariable Integer id) {
		return detalleOrdenService.buscarPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public DetalleOrden crear(@RequestBody DetalleOrden detalle) {
		return detalleOrdenService.guardar(detalle);
	}

	@PutMapping("/{id}")
	public DetalleOrden actualizar(@PathVariable Integer id, @RequestBody DetalleOrden detalle) {
		return detalleOrdenService.actualizar(id, detalle);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
		detalleOrdenService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}