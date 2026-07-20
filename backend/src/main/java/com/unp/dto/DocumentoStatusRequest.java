package com.unp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DocumentoStatusRequest {

    @NotBlank(message = "El estado es obligatorio")
    @Pattern(regexp = "APROBADO|EN_OBSERVACION", message = "Estado no válido")
    private String estado;

    private String observacion;
}
