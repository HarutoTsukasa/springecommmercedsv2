package com.htx.ecommerceds.controller;

import com.htx.ecommerceds.dto.CheckoutRequest;
import com.htx.ecommerceds.model.Orden;
import com.htx.ecommerceds.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenController {

	private final OrdenService ordenService;

	@GetMapping
	public List<Orden> listar() {
		return ordenService.listar();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Orden> buscar(@PathVariable Integer id) {
		return ordenService.buscarPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Orden crear(@RequestBody Orden orden) {
		return ordenService.guardar(orden);
	}

	@PutMapping("/{id}")
	public Orden actualizar(@PathVariable Integer id, @RequestBody Orden orden) {
		return ordenService.actualizar(id, orden);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
		ordenService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/checkout")
	public Orden checkout(@RequestBody CheckoutRequest request) {
		return ordenService.checkout(request);
	}
}