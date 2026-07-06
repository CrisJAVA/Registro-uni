package com.unp.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CarreraResponse {
    private Long id;
    private String nombre;
    private Long areaId;
    private String areaNombre;
}
