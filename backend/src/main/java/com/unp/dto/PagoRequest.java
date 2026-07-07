package com.unp.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PagoRequest {

    @NotBlank(message = "El código de verificación es obligatorio")
    @Pattern(regexp = "^\\d{1,8}$", message = "Código de verificación inválido")
    private String numeroVerificacion;

    @NotBlank(message = "El número de movimiento es obligatorio")
    @Pattern(regexp = "^\\d{7}$", message = "Número de movimiento inválido")
    private String numeroMovimiento;

    private String entidadFinanciera;

    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal monto;

    private LocalDate fechaPago;

    private Long postulanteId;

    private Long procesoAdmisionId;
}
