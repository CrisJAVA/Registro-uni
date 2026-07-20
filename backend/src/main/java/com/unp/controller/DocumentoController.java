package com.unp.controller;

import com.unp.dto.DocumentoResponse;
import com.unp.dto.DocumentoStatusRequest;
import com.unp.entity.DocumentoEstudiante;
import com.unp.security.AdminPrincipal;
import com.unp.security.EstudiantePrincipal;
import com.unp.service.DocumentoService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService documentoService;

    @GetMapping("/api/documentos/plantilla")
    public void descargarPlantilla(HttpServletResponse response) {
        documentoService.generarPlantilla(response);
    }

    @PostMapping("/api/documentos/subir")
    public ResponseEntity<DocumentoResponse> subirDocumento(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("tipo") String tipo,
            Authentication auth) {
        String dni = getDniFromAuth(auth);
        return ResponseEntity.ok(documentoService.subirDocumento(archivo, tipo, dni));
    }

    @GetMapping("/api/documentos/mis-documentos")
    public ResponseEntity<List<DocumentoResponse>> listarMisDocumentos(Authentication auth) {
        String dni = getDniFromAuth(auth);
        return ResponseEntity.ok(documentoService.listarMisDocumentos(dni));
    }

    @GetMapping("/api/documentos/{id}/descargar")
    public ResponseEntity<Resource> descargarDocumento(@PathVariable Long id, Authentication auth) {
        String dni = getDniFromAuth(auth);
        DocumentoEstudiante doc = documentoService.getDocumentoParaDescargar(id, dni);
        Resource resource = documentoService.cargarResource(doc);
        String encodedFilename = URLEncoder.encode(doc.getNombreOriginal(), StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFilename)
                .body(resource);
    }

    @DeleteMapping("/api/documentos/{id}")
    public ResponseEntity<Void> eliminarDocumento(@PathVariable Long id, Authentication auth) {
        String dni = getDniFromAuth(auth);
        documentoService.eliminarDocumento(id, dni);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/admin/documentos")
    public ResponseEntity<List<DocumentoResponse>> listarTodosDocumentos(Authentication auth) {
        verificarAdmin(auth);
        return ResponseEntity.ok(documentoService.listarTodosLosDocumentos());
    }

    @GetMapping("/api/admin/documentos/estudiante/{postulanteId}")
    public ResponseEntity<List<DocumentoResponse>> listarDocumentosEstudiante(
            @PathVariable Long postulanteId, Authentication auth) {
        verificarAdmin(auth);
        return ResponseEntity.ok(documentoService.listarDocumentosPorEstudiante(postulanteId));
    }

    @PutMapping("/api/admin/documentos/{id}/estado")
    public ResponseEntity<DocumentoResponse> actualizarEstado(
            @PathVariable Long id,
            @Valid @RequestBody DocumentoStatusRequest request,
            Authentication auth) {
        verificarAdmin(auth);
        return ResponseEntity.ok(documentoService.actualizarEstado(id, request, auth));
    }

    @GetMapping("/api/admin/documentos/{id}/descargar")
    public ResponseEntity<Resource> descargarDocumentoAdmin(@PathVariable Long id, Authentication auth) {
        verificarAdmin(auth);
        DocumentoEstudiante doc = documentoService.getDocumentoParaDescargarAdmin(id);
        Resource resource = documentoService.cargarResource(doc);
        String encodedFilename = URLEncoder.encode(doc.getNombreOriginal(), StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFilename)
                .body(resource);
    }

    private String getDniFromAuth(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof EstudiantePrincipal) {
            return ((EstudiantePrincipal) auth.getPrincipal()).getDni();
        }
        throw new RuntimeException("Acceso no autorizado");
    }

    private void verificarAdmin(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof AdminPrincipal)) {
            throw new RuntimeException("Acceso no autorizado. Se requiere rol de administrador.");
        }
    }
}
