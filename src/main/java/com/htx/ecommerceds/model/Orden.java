package com.htx.ecommerceds.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ordenes")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Orden {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_orden")
	private Integer id_orden;

	@Column(nullable = false, length = 50, unique = true)
	private String numero;

	@Column(name = "fechacreacion")
	private LocalDateTime fechacreacion;

	@Column(name = "fecharecibida")
	private LocalDateTime fecharecibida;

	@Column(nullable = false, precision = 14, scale = 2)
	private BigDecimal total;

	@Column(nullable = false, length = 20)
	private String estado; // Pendiente / Procesando / Enviado / Entregado / Cancelado

	@Column(length = 30)
	private String pago; // Tarjeta / PayPal / Bizum / Efectivo

	@ManyToOne
	@JoinColumn(name = "usuario_id")
	private Usuario usuario;

	@OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<DetalleOrden> detalle;
}