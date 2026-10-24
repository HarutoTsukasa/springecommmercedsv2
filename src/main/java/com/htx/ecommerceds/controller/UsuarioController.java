package com.htx.ecommerceds.controller;

import com.htx.ecommerceds.model.Usuario;
import com.htx.ecommerceds.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

	private final UsuarioService usuarioService;

	@GetMapping
	public List<Usuario> listar() {
		return usuarioService.listar();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Usuario> buscar(@PathVariable Integer id) {
		return usuarioService.buscarPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Usuario crear(@RequestBody Usuario usuario) {
		if (usuario.getRol() == null)
			usuario.setRol("CLIENTE");
		return usuarioService.guardar(usuario);
	}

	@PutMapping("/{id}")
	public Usuario actualizar(@PathVariable Integer id, @RequestBody Usuario usuario) {
		return usuarioService.actualizar(id, usuario);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
		usuarioService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
		return usuarioService.login(body.get("email"), body.get("password")).<ResponseEntity<?>>map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas")));
	}
}