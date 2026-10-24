package com.htx.ecommerceds.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "detalles")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class DetalleOrden {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_detalle_orden")
	private Integer id_detalle_orden;

	@Column(nullable = false, length = 150)
	private String nombre;

	@Column(nullable = false)
	private Integer cantidad;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal precio;

	@Column(nullable = false, precision = 14, scale = 2)
	private BigDecimal total;

	@ManyToOne
	@JoinColumn(name = "orden_id")
	@JsonIgnore
	private Orden orden;

	@ManyToOne
	@JoinColumn(name = "producto_id")
	private Producto producto;
}