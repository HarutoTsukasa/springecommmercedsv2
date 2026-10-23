package com.htx.ecommerceds.model;

import jakarta.persistence.*;
import lombok.*;

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
    private Integer id_detalle_orden;
    private String nombre;
    private Double cantidad;
    private Double precio;
    private Double total;

    @ManyToOne
    private Orden orden;

    @ManyToOne
    private Producto producto;

    
}
