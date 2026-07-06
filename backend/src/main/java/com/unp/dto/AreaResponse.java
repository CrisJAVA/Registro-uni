package com.unp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AreaResponse {
    private Long id;
    private String codigo;
    private String nombre;
}
