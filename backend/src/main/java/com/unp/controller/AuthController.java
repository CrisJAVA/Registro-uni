package com.unp.controller;

import com.unp.dto.*;
import com.unp.service.AdminService;
import com.unp.service.EstudianteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @PutMapping("/estudiante/cambiar-password")
    public ResponseEntity<Map<String, String>> cambiarPassword(
            @Valid @RequestBody CambioPasswordRequest request,
            Authentication auth) {
        String dni = getDniFromAuth(auth);
        estudianteService.cambiarPassword(dni, request);
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña cambiada exitosamente"));
    }

    private String getDniFromAuth(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof com.unp.security.EstudiantePrincipal) {
            return ((com.unp.security.EstudiantePrincipal) auth.getPrincipal()).getDni();
        }
        throw new RuntimeException("Acceso no autorizado");
    }
}
