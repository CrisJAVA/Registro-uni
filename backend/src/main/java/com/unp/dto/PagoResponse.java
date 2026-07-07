package com.unp.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PagoResponse {
    private boolean encontrado;
    private BigDecimal monto;
    private LocalDateTime fechaPago;
    private String descripcionPago;
    private String mensaje;
}
