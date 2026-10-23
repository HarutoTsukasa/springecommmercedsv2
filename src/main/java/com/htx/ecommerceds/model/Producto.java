package com.htx.ecommerceds.model;

import jakarta.persistence.*;
import lombok.*;

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
	private Integer id_producto;
	private String nombre;
	private String descripcion;
	private String imagen;
	private Double precio;
	private Integer cantidad;

	@ManyToOne
	private Usuario usuario;

}
