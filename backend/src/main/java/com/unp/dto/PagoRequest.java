package com.unp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PagoRequest {
    @NotBlank(message = "El número de operación es obligatorio")
    private String numeroOperacion;
    private String entidadFinanciera;
    private BigDecimal monto;
    private LocalDate fechaPago;
    private Long postulanteId;
    private Long procesoAdmisionId;
}
