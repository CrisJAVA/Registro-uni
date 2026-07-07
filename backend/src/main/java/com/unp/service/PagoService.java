package com.unp.service;

import com.unp.dto.*;
import com.unp.entity.Pago;
import com.unp.exception.BadRequestException;
import com.unp.repository.PagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;

    public PagoResponse validarPago(PagoRequest request) {
        String verificacion = request.getNumeroVerificacion() != null
                ? request.getNumeroVerificacion().trim() : "";
        String movimiento = request.getNumeroMovimiento() != null
                ? request.getNumeroMovimiento().trim() : "";

        if (verificacion.isEmpty()) {
            throw new BadRequestException("El código de verificación es obligatorio");
        }
        if (movimiento.isEmpty()) {
            throw new BadRequestException("El número de movimiento es obligatorio");
        }

        if (!verificacion.matches("^\\d{1,8}$")) {
            throw new BadRequestException("Código de verificación inválido");
        }
        if (!movimiento.matches("^\\d{7}$")) {
            throw new BadRequestException("Número de movimiento inválido");
        }

        char primerDigito = movimiento.charAt(0);
        if (primerDigito == '0') {
            throw new BadRequestException("Número de movimiento inválido");
        }

        var pagoOpt = pagoRepository.findByNumeroMovimiento(movimiento);

        if (pagoOpt.isEmpty()) {
            return PagoResponse.builder()
                    .numeroVerificacion(verificacion)
                    .numeroMovimiento(movimiento)
                    .estado("NO_ENCONTRADO")
                    .mensaje("El número de movimiento no fue encontrado en nuestros registros")
                    .build();
        }

        var pago = pagoOpt.get();
        return PagoResponse.builder()
                .id(pago.getId())
                .numeroVerificacion(verificacion)
                .numeroMovimiento(pago.getNumeroMovimiento())
                .entidadFinanciera(pago.getEntidadFinanciera())
                .monto(pago.getMonto())
                .fechaPago(pago.getFechaPago())
                .estado(pago.getEstado())
                .mensaje("Pago validado correctamente")
                .build();
    }
}
