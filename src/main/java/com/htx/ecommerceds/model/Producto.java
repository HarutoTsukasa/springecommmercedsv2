package com.htx.ecommerceds.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "productos")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_producto")
	private Integer id_producto;

	@Column(nullable = false, length = 150)
	private String nombre;

	@Column(length = 1000)
	private String descripcion;

	@Column(length = 500)
	private String imagen;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal precio;

	@Column(nullable = false)
	private Integer cantidad;

	@Column(length = 50)
	private String categoria;

	@Column(nullable = false, length = 20)
	private String estado; // Activo / Agotado / Borrador

	@ManyToOne
	@JoinColumn(name = "usuario_id")
	@JsonIgnore
	private Usuario usuario;

	@OneToMany(mappedBy = "producto")
	@JsonIgnore
	private List<DetalleOrden> detalles;
}