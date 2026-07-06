package com.unp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "procesos_admision")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProcesoAdmision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "anio", nullable = false, length = 4)
    private String anio;

    @Column(nullable = false, length = 50)
    private String periodo;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(nullable = false, length = 20)
    private String estado;

    @OneToMany(mappedBy = "procesoAdmision", fetch = FetchType.LAZY)
    private List<Pago> pagos;
}
