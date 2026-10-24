package com.htx.ecommerceds.controller;

import com.htx.ecommerceds.model.Producto;
import com.htx.ecommerceds.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

	private final ProductoService productoService;

	@GetMapping
	public List<Producto> listar() {
		return productoService.listar();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Producto> buscar(@PathVariable Integer id) {
		return productoService.buscarPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Producto crear(@RequestBody Producto producto) {
		if (producto.getEstado() == null)
			producto.setEstado("Activo");
		return productoService.guardar(producto);
	}

	@PutMapping("/{id}")
	public Producto actualizar(@PathVariable Integer id, @RequestBody Producto producto) {
		return productoService.actualizar(id, producto);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
		productoService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}