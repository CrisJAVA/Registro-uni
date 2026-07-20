package com.unp.controller;

import com.unp.dto.*;
import com.unp.security.AdminPrincipal;
import com.unp.service.PostulanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postulantes")
@RequiredArgsConstructor
public class PostulanteController {

    private final PostulanteService postulanteService;

    @PostMapping("/registrar")
    public ResponseEntity<PostulanteResponse> registrar(@Valid @RequestBody PostulanteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postulanteService.registrar(request));
    }

    @GetMapping
    public ResponseEntity<List<PostulanteResponse>> listar(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long areaId,
            @RequestParam(required = false) Long carreraId,
            Authentication auth) {
        verificarAdmin(auth);
        if (search != null || areaId != null || carreraId != null) {
            return ResponseEntity.ok(postulanteService.buscar(search, areaId, carreraId));
        }
        return ResponseEntity.ok(postulanteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostulanteResponse> obtener(@PathVariable Long id, Authentication auth) {
        verificarAdmin(auth);
        return ResponseEntity.ok(postulanteService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostulanteResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody PostulanteRequest request,
            Authentication auth) {
        verificarAdmin(auth);
        return ResponseEntity.ok(postulanteService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication auth) {
        verificarAdmin(auth);
        postulanteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private void verificarAdmin(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof AdminPrincipal)) {
            throw new RuntimeException("Acceso no autorizado. Se requiere rol de administrador.");
        }
    }
}
