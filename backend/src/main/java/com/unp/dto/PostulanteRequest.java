package com.unp.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PostulanteRequest {
    private String tipoDocumento;

    @Pattern(regexp = "^\\d{8}$", message = "El DNI debe contener exactamente 8 dígitos numéricos")
    private String numeroDocumento;

    @NotBlank(message = "Los nombres son obligatorios")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
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
    private Long carreraId;
}
