package com.unp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_cliente", length = 200)
    private String nombreCliente;

    @Column(name = "codigo", length = 20)
    private String codigo;

    @Column(name = "descripcion_pago", length = 200)
    private String descripcionPago;

    @Column(name = "importe_pagar", precision = 12, scale = 2)
    private BigDecimal importePagar;

    @Column(name = "importe_pagado", precision = 12, scale = 2)
    private BigDecimal importePagado;

    @Column(name = "oficina", length = 100)
    private String oficina;

    @Column(name = "numero_movimiento", length = 20)
    private String numeroMovimiento;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "fecha_proceso")
    private LocalDateTime fechaProceso;

    @Column(name = "forma_pago", length = 50)
    private String formaPago;

    @Column(name = "canal", length = 50)
    private String canal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postulante_id")
    private Postulante postulante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proceso_admision_id")
    private ProcesoAdmision procesoAdmision;
}
