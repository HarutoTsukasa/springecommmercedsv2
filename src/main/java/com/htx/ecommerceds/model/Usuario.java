package com.htx.ecommerceds.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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
	@Column(name = "id_usuario")
	private Integer id_usuario;

	@Column(nullable = false, length = 100)
	private String nombre;

	@Column(nullable = false, length = 150, unique = true)
	private String email;

	@Column(length = 255)
	private String direccion;

	@Column(length = 30)
	private String telefono;

	@Column(nullable = false, length = 20)
	private String rol; // ADMIN / CLIENTE

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(nullable = false, length = 255)
	private String password;

	@OneToMany(mappedBy = "usuario")
	@JsonIgnore
	private List<Producto> productos;

	@OneToMany(mappedBy = "usuario")
	@JsonIgnore
	private List<Orden> ordenes;
}