package com.htx.ecommerceds.service;

import com.htx.ecommerceds.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {
	List<Usuario> listar();

	Optional<Usuario> buscarPorId(Integer id);

	Optional<Usuario> buscarPorEmail(String email);

	Usuario guardar(Usuario usuario);

	Usuario actualizar(Integer id, Usuario usuario);

	void eliminar(Integer id);

	Optional<Usuario> login(String email, String password);
}