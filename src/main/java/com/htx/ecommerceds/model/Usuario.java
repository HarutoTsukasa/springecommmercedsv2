package com.htx.ecommerceds.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "usuarios")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Usuario {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id_usuario;
	private String nombre;
	private String email;
	private String direccion;
	private String telefono;
	private String rol;// ADMIN y/o CLIENTE
	private String password; //sin cifrar sin security

	@OneToMany(mappedBy = "usuario")
	private List<Producto> productos;

	@OneToMany(mappedBy = "usuario")
	private List<Orden> ordenes;

}
