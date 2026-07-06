package com.unp.dto;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PostulanteResponse {
    private Long id;
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombres;
    private String apellidos;
    private LocalDate fechaNacimiento;
    private String sexo;
    private String email;
    private String telefono;
    private String direccion;
    private String departamento;
    private String provincia;
    private String distrito;
    private String tipoColegio;
    private Long areaId;
    private String areaNombre;
    private Long carreraId;
    private String carreraNombre;
    private LocalDate fechaRegistro;
}
