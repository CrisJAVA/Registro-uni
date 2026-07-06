package com.unp.controller;

import com.unp.dto.*;
import com.unp.service.PagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;

    @PostMapping("/validar")
    public ResponseEntity<PagoResponse> validarPago(@Valid @RequestBody PagoRequest request) {
        return ResponseEntity.ok(pagoService.validarPago(request));
    }
}
