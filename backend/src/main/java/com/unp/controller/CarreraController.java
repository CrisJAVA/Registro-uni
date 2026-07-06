package com.unp.controller;

import com.unp.dto.CarreraResponse;
import com.unp.service.CarreraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carreras")
@RequiredArgsConstructor
public class CarreraController {

    private final CarreraService carreraService;

    @GetMapping
    public ResponseEntity<List<CarreraResponse>> listar(
            @RequestParam(required = false) Long areaId) {
        if (areaId != null) {
            return ResponseEntity.ok(carreraService.listarPorArea(areaId));
        }
        return ResponseEntity.ok(carreraService.listarTodas());
    }
}
