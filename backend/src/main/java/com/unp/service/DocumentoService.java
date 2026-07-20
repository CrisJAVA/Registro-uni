package com.unp.service;

import com.unp.dto.DocumentoResponse;
import com.unp.dto.DocumentoStatusRequest;
import com.unp.entity.*;
import com.unp.exception.BadRequestException;
import com.unp.exception.ResourceNotFoundException;
import com.unp.repository.*;
import com.unp.security.AdminPrincipal;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final UsuarioEstudianteRepository usuarioEstudianteRepository;
    private final AdminRepository adminRepository;

    @Value("${app.upload.dir:uploads/documentos}")
    private String uploadDir;

    @Value("${app.upload.max-size:10485760}")
    private long maxFileSize;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("docx", "pdf");
    private static final long MAX_TEMPLATE_FILES = 1;
    private static final long MAX_ADICIONAL_FILES = 3;

    @Transactional
    public DocumentoResponse subirDocumento(MultipartFile archivo, String tipoDocumento, String dni) {
        validarArchivo(archivo);

        var usuario = usuarioEstudianteRepository.findByDni(dni)
                .orElseThrow(() -> new BadRequestException("Estudiante no encontrado"));
        var postulante = usuario.getPostulante();

        String extension = getExtension(archivo.getOriginalFilename());

        if ("PLANTILLA".equals(tipoDocumento)) {
            long count = documentoRepository.countByPostulanteIdAndTipoDocumento(postulante.getId(), "PLANTILLA");
            long pendientes = documentoRepository.countByPostulanteIdAndEstado(postulante.getId(), "EN_OBSERVACION");

            if (count >= MAX_TEMPLATE_FILES && pendientes == 0) {
                throw new BadRequestException("Ya has subido el documento principal. Solo puedes reemplazar archivos en observación.");
            }
        } else if ("ADICIONAL".equals(tipoDocumento)) {
            long count = documentoRepository.countByPostulanteIdAndTipoDocumento(postulante.getId(), "ADICIONAL");
            long pendientes = documentoRepository.countByPostulanteIdAndEstado(postulante.getId(), "EN_OBSERVACION");

            if (count >= MAX_ADICIONAL_FILES && pendientes == 0) {
                throw new BadRequestException("Has alcanzado el límite de " + MAX_ADICIONAL_FILES + " archivos adicionales.");
            }
        } else {
            throw new BadRequestException("Tipo de documento no válido");
        }

        String nombreAlmacenado = UUID.randomUUID() + "." + extension;
        String subdirectorio = "estudiante_" + postulante.getId();
        Path rutaDirectorio = Paths.get(uploadDir, subdirectorio);

        try {
            Files.createDirectories(rutaDirectorio);
            Path rutaArchivo = rutaDirectorio.resolve(nombreAlmacenado);
            archivo.transferTo(rutaArchivo.toFile());

            var documento = DocumentoEstudiante.builder()
                    .postulante(postulante)
                    .nombreOriginal(archivo.getOriginalFilename())
                    .nombreAlmacenado(nombreAlmacenado)
                    .tipoArchivo(extension.toUpperCase())
                    .tamano(archivo.getSize())
                    .tipoDocumento(tipoDocumento)
                    .estado("PENDIENTE")
                    .fechaSubida(LocalDateTime.now())
                    .build();

            documento = documentoRepository.save(documento);
            return toResponse(documento);

        } catch (IOException e) {
            throw new BadRequestException("Error al guardar el archivo: " + e.getMessage());
        }
    }

    public List<DocumentoResponse> listarMisDocumentos(String dni) {
        var usuario = usuarioEstudianteRepository.findByDni(dni)
                .orElseThrow(() -> new BadRequestException("Estudiante no encontrado"));

        return documentoRepository.findByPostulanteIdOrderByFechaSubidaDesc(usuario.getPostulante().getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DocumentoResponse> listarTodosLosDocumentos() {
        return documentoRepository.findAllByOrderByFechaSubidaDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DocumentoResponse> listarDocumentosPorEstudiante(Long postulanteId) {
        return documentoRepository.findByPostulanteIdOrderByFechaSubidaDesc(postulanteId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DocumentoEstudiante getDocumentoParaDescargar(Long documentoId, String dni) {
        var documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado"));

        var usuario = usuarioEstudianteRepository.findByDni(dni).orElse(null);
        if (usuario != null && !usuario.getPostulante().getId().equals(documento.getPostulante().getId())) {
            throw new BadRequestException("No tienes permiso para descargar este archivo");
        }

        return documento;
    }

    public DocumentoEstudiante getDocumentoParaDescargarAdmin(Long documentoId) {
        var documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado"));
        return documento;
    }

    public Resource cargarResource(DocumentoEstudiante documento) {
        try {
            Path ruta = Paths.get(uploadDir, "estudiante_" + documento.getPostulante().getId(), documento.getNombreAlmacenado());
            Resource resource = new FileSystemResource(ruta);
            if (!resource.exists()) {
                throw new ResourceNotFoundException("Archivo no encontrado en el servidor");
            }
            return resource;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error al acceder al archivo");
        }
    }

    @Transactional
    public DocumentoResponse actualizarEstado(Long documentoId, DocumentoStatusRequest request, Authentication auth) {
        var documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado"));

        if ("EN_OBSERVACION".equals(request.getEstado())) {
            if (request.getObservacion() == null || request.getObservacion().isBlank()) {
                throw new BadRequestException("Debe escribir el motivo de la observación");
            }
        }

        documento.setEstado(request.getEstado());
        documento.setObservacion(request.getObservacion());
        documento.setFechaRevision(LocalDateTime.now());

        if (auth != null && auth.getPrincipal() instanceof AdminPrincipal) {
            AdminPrincipal admin = (AdminPrincipal) auth.getPrincipal();
            var adminEntity = adminRepository.findById(admin.getId()).orElse(null);
            documento.setRevisadoPor(adminEntity);
        }

        documento = documentoRepository.save(documento);
        return toResponse(documento);
    }

    @Transactional
    public void eliminarDocumento(Long documentoId, String dni) {
        var documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado"));

        var usuario = usuarioEstudianteRepository.findByDni(dni)
                .orElseThrow(() -> new BadRequestException("Estudiante no encontrado"));

        if (!usuario.getPostulante().getId().equals(documento.getPostulante().getId())) {
            throw new BadRequestException("No tienes permiso para eliminar este archivo");
        }

        if (!"EN_OBSERVACION".equals(documento.getEstado())) {
            throw new BadRequestException("Solo puedes reemplazar archivos que estén en observación");
        }

        eliminarArchivoFisico(documento);
        documentoRepository.delete(documento);
    }

    private void eliminarArchivoFisico(DocumentoEstudiante documento) {
        try {
            Path ruta = Paths.get(uploadDir, "estudiante_" + documento.getPostulante().getId(), documento.getNombreAlmacenado());
            Files.deleteIfExists(ruta);
        } catch (IOException ignored) {}
    }

    public void generarPlantilla(HttpServletResponse response) {
        try (XWPFDocument doc = new XWPFDocument()) {
            var title = doc.createParagraph();
            title.setAlignment(ParagraphAlignment.CENTER);
            var titleRun = title.createRun();
            titleRun.setText("FICHA DE INSCRIPCIÓN - ADMISIÓN 2026");
            titleRun.setBold(true);
            titleRun.setFontSize(16);
            titleRun.setFontFamily("Times New Roman");

            var subtitle = doc.createParagraph();
            subtitle.setAlignment(ParagraphAlignment.CENTER);
            var subRun = subtitle.createRun();
            subRun.setText("Universidad Nacional del Pacífico");
            subRun.setFontSize(13);
            subRun.setFontFamily("Times New Roman");

            doc.createParagraph().createRun().addBreak();

            String[][] fields = {
                    {"Tipo de Documento:", ""},
                    {"Número de Documento:", ""},
                    {"Nombres:", ""},
                    {"Apellidos:", ""},
                    {"Fecha de Nacimiento:", ""},
                    {"Sexo:", ""},
                    {"Correo Electrónico:", ""},
                    {"Teléfono:", ""},
                    {"Dirección:", ""},
                    {"Departamento:", ""},
                    {"Provincia:", ""},
                    {"Distrito:", ""},
                    {"Tipo de Colegio:", ""},
                    {"Área de Postulación:", ""},
                    {"Carrera Profesional:", ""}
            };

            for (String[] field : fields) {
                var p = doc.createParagraph();
                var run = p.createRun();
                run.setText(field[0]);
                run.setBold(true);
                run.setFontSize(12);
                run.setFontFamily("Times New Roman");
                var valRun = p.createRun();
                valRun.setText("  " + field[1] + "___________________________");
                valRun.setFontSize(12);
                valRun.setFontFamily("Times New Roman");
            }

            var note = doc.createParagraph();
            note.setAlignment(ParagraphAlignment.LEFT);
            var noteRun = note.createRun();
            noteRun.setText("\nDeclaro que los datos consignados son verdaderos y autorizo su verificación.");
            noteRun.setItalic(true);
            noteRun.setFontSize(11);
            noteRun.setFontFamily("Times New Roman");

            var signature = doc.createParagraph();
            signature.setAlignment(ParagraphAlignment.RIGHT);
            var sigRun = signature.createRun();
            sigRun.addBreak();
            sigRun.addBreak();
            sigRun.setText("_____________________________");
            var sigRun2 = signature.createRun();
            sigRun2.addBreak();
            sigRun2.setText("Firma del Postulante");

            response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            response.setHeader("Content-Disposition", "attachment; filename=plantilla_inscripcion.docx");
            doc.write(response.getOutputStream());
            response.getOutputStream().flush();
        } catch (Exception e) {
            throw new BadRequestException("Error al generar la plantilla: " + e.getMessage());
        }
    }

    private void validarArchivo(MultipartFile archivo) {
        if (archivo.isEmpty()) {
            throw new BadRequestException("El archivo está vacío");
        }

        if (archivo.getSize() > maxFileSize) {
            throw new BadRequestException("El archivo excede el tamaño máximo permitido de " + (maxFileSize / 1048576) + "MB");
        }

        String extension = getExtension(archivo.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BadRequestException("Formato no permitido. Solo se aceptan archivos DOCX y PDF");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new BadRequestException("Archivo sin extensión");
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private DocumentoResponse toResponse(DocumentoEstudiante doc) {
        var p = doc.getPostulante();
        return DocumentoResponse.builder()
                .id(doc.getId())
                .nombreOriginal(doc.getNombreOriginal())
                .tipoArchivo(doc.getTipoArchivo())
                .tamano(doc.getTamano())
                .tipoDocumento(doc.getTipoDocumento())
                .estado(doc.getEstado())
                .observacion(doc.getObservacion())
                .fechaSubida(doc.getFechaSubida())
                .fechaRevision(doc.getFechaRevision())
                .postulanteNombre(p.getNombres())
                .postulanteApellido(p.getApellidos())
                .postulanteDocumento(p.getNumeroDocumento())
                .postulanteId(p.getId())
                .build();
    }
}
