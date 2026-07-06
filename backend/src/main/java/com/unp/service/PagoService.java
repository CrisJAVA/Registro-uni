package com.unp.service;

import com.unp.dto.*;
import com.unp.entity.Pago;
import com.unp.exception.BadRequestException;
import com.unp.exception.ResourceNotFoundException;
import com.unp.repository.PagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;

    public PagoResponse validarPago(PagoRequest request) {
        if (request.getNumeroOperacion() == null || request.getNumeroOperacion().isBlank()) {
            throw new BadRequestException("El número de operación es obligatorio");
        }

        var pagoOpt = pagoRepository.findByNumeroOperacion(request.getNumeroOperacion());

        if (pagoOpt.isEmpty()) {
            return PagoResponse.builder()
                    .numeroOperacion(request.getNumeroOperacion())
                    .estado("NO_ENCONTRADO")
                    .mensaje("El número de operación no fue encontrado en nuestros registros")
                    .build();
        }

        var pago = pagoOpt.get();
        return PagoResponse.builder()
                .id(pago.getId())
                .numeroOperacion(pago.getNumeroOperacion())
                .entidadFinanciera(pago.getEntidadFinanciera())
                .monto(pago.getMonto())
                .fechaPago(pago.getFechaPago())
                .estado(pago.getEstado())
                .mensaje("Pago validado correctamente")
                .build();
    }
}
