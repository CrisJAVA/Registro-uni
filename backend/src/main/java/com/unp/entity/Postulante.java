package com.unp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "postulantes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Postulante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_documento", length = 30)
    private String tipoDocumento;

    @Column(name = "numero_documento", nullable = false, length = 8)
    private String numeroDocumento;

    @Column(length = 100)
    private String nombres;

    @Column(length = 100)
    private String apellidos;

    private LocalDate fechaNacimiento;

    @Column(length = 10)
    private String sexo;

    @Column(length = 150)
    private String email;

    @Column(length = 15)
    private String telefono;

    @Column(length = 255)
    private String direccion;

    @Column(length = 100)
    private String departamento;

    @Column(length = 100)
    private String provincia;

    @Column(length = 100)
    private String distrito;

    @Column(name = "tipo_colegio", length = 50)
    private String tipoColegio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrera_id")
    private Carrera carrera;

    @Column(name = "fecha_registro")
    private LocalDate fechaRegistro;
}
