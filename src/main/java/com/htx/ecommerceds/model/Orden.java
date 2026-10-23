package com.htx.ecommerceds.model;

import jakarta.persistence.*;
import lombok.*;

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
	private Integer id_orden;
	private String numero;
	private LocalDateTime fechacreacion;
	private LocalDateTime fecharecibida;
	private Double total;

	@ManyToOne
	private Usuario usuario;

	@OneToMany(mappedBy = "orden", fetch = FetchType.EAGER)
	private List<DetalleOrden> detalle;

}
