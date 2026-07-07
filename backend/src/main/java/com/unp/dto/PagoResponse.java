package com.unp.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PagoResponse {
    private Long id;
    private String numeroVerificacion;
    private String numeroMovimiento;
    private String entidadFinanciera;
    private BigDecimal monto;
    private LocalDate fechaPago;
    private String estado;
    private String mensaje;
}
