package com.htx.ecommerceds.service.impl;

import com.htx.ecommerceds.model.Usuario;
import com.htx.ecommerceds.repository.UsuarioRepository;
import com.htx.ecommerceds.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

	private final UsuarioRepository usuarioRepository;

	@Override
	public List<Usuario> listar() {
		return usuarioRepository.findAll();
	}

	@Override
	public Optional<Usuario> buscarPorId(Integer id) {
		return usuarioRepository.findById(id);
	}

	@Override
	public Optional<Usuario> buscarPorEmail(String email) {
		return usuarioRepository.findByEmail(email);
	}

	@Override
	public Usuario guardar(Usuario usuario) {
		return usuarioRepository.save(usuario);
	}

	@Override
	public Usuario actualizar(Integer id, Usuario datos) {
		return usuarioRepository.findById(id).map(u -> {
			u.setNombre(datos.getNombre());
			u.setEmail(datos.getEmail());
			u.setDireccion(datos.getDireccion());
			u.setTelefono(datos.getTelefono());
			u.setRol(datos.getRol());
			if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
				u.setPassword(datos.getPassword());
			}
			return usuarioRepository.save(u);
		}).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + id));
	}

	@Override
	public void eliminar(Integer id) {
		usuarioRepository.deleteById(id);
	}

	@Override
	public Optional<Usuario> login(String email, String password) {
		return usuarioRepository.findByEmail(email)
				.filter(u -> u.getPassword() != null && u.getPassword().equals(password));
	}
}