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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService documentoService;

    @Value("${app.doc.dir:../Doc}")
    private String docDir;

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

    @GetMapping("/api/documentos/plantillas-disponibles")
    public ResponseEntity<List<Map<String, String>>> listarPlantillas() {
        List<Map<String, String>> plantillas = new ArrayList<>();
        Path docPath = Paths.get(docDir).toAbsolutePath().normalize();

        if (!Files.exists(docPath)) {
            return ResponseEntity.ok(plantillas);
        }

        try (var stream = Files.list(docPath)) {
            plantillas = stream
                    .filter(p -> p.toString().toLowerCase().endsWith(".docx"))
                    .map(p -> {
                        Map<String, String> info = new HashMap<>();
                        info.put("nombre", p.getFileName().toString());
                        try {
                            info.put("tamano", String.valueOf(Files.size(p)));
                        } catch (IOException e) {
                            info.put("tamano", "0");
                        }
                        return info;
                    })
                    .collect(Collectors.toList());
        } catch (IOException ignored) {}

        return ResponseEntity.ok(plantillas);
    }

    @GetMapping("/api/documentos/plantillas/{filename:.+}")
    public ResponseEntity<Resource> descargarPlantillaArchivo(@PathVariable String filename) {
        Path docPath = Paths.get(docDir).toAbsolutePath().normalize();
        Path filePath = docPath.resolve(filename).normalize();

        if (!filePath.startsWith(docPath)) {
            return ResponseEntity.badRequest().build();
        }

        if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(filePath);
        String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFilename)
                .body(resource);
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
