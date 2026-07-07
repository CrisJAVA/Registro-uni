package com.unp.service;

import com.unp.dto.*;
import com.unp.exception.BadRequestException;
import com.unp.repository.PagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;

    public PagoResponse validarPago(PagoRequest request) {
        String codigo = request.getCodigo() != null ? request.getCodigo().trim() : "";
        String numeroMovimiento = request.getNumeroMovimiento() != null ? request.getNumeroMovimiento().trim() : "";

        if (codigo.isEmpty() || numeroMovimiento.isEmpty()) {
            throw new BadRequestException("Datos de pago inválidos");
        }

        if (!codigo.matches("^\\d{1,8}$") || !numeroMovimiento.matches("^\\d{6}$")) {
            throw new BadRequestException("Datos de pago inválidos");
        }

        var pagoOpt = pagoRepository.findByCodigoAndNumeroMovimiento(codigo, numeroMovimiento);

        if (pagoOpt.isEmpty()) {
            return PagoResponse.builder()
                    .encontrado(false)
                    .mensaje("Pago no encontrado.")
                    .build();
        }

        var pago = pagoOpt.get();
        return PagoResponse.builder()
                .encontrado(true)
                .monto(pago.getImportePagado())
                .fechaPago(pago.getFechaPago())
                .descripcionPago(pago.getDescripcionPago())
                .mensaje("Pago encontrado correctamente")
                .build();
    }
}
