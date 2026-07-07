package com.unp.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PagoRequest {

    @NotBlank(message = "El código de verificación es obligatorio")
    @Pattern(regexp = "^\\d{1,8}$", message = "Datos de pago inválidos")
    private String codigo;

    @NotBlank(message = "El número de movimiento es obligatorio")
    @Pattern(regexp = "^\\d{6}$", message = "Datos de pago inválidos")
    private String numeroMovimiento;
}
