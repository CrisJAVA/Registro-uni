package com.unp.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DocumentoResponse {
    private Long id;
    private String nombreOriginal;
    private String tipoArchivo;
    private Long tamano;
    private String tipoDocumento;
    private String estado;
    private String observacion;
    private LocalDateTime fechaSubida;
    private LocalDateTime fechaRevision;
    private String postulanteNombre;
    private String postulanteApellido;
    private String postulanteDocumento;
    private Long postulanteId;
}
