package com.unp.controller;

import com.unp.dto.*;
import com.unp.service.AdminService;
import com.unp.service.EstudianteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminService adminService;
    private final EstudianteService estudianteService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(adminService.login(request));
    }

    @PostMapping("/login-estudiante")
    public ResponseEntity<LoginResponse> loginEstudiante(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(estudianteService.login(request));
    }

    @GetMapping("/estudiante/perfil")
    public ResponseEntity<EstudianteProfileResponse> perfilEstudiante(
            @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        String dni = estudianteService.getDniFromToken(token);
        var perfil = estudianteService.obtenerPerfilByDni(dni);
        return ResponseEntity.ok(perfil);
    }
}
