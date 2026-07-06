package com.unp.service;

import com.unp.dto.CarreraResponse;
import com.unp.repository.CarreraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarreraService {

    private final CarreraRepository carreraRepository;

    public List<CarreraResponse> listarTodas() {
        return carreraRepository.findAll().stream()
                .map(c -> CarreraResponse.builder()
                        .id(c.getId())
                        .nombre(c.getNombre())
                        .areaId(c.getArea() != null ? c.getArea().getId() : null)
                        .areaNombre(c.getArea() != null ? c.getArea().getNombre() : null)
                        .build())
                .toList();
    }

    public List<CarreraResponse> listarPorArea(Long areaId) {
        return carreraRepository.findByAreaId(areaId).stream()
                .map(c -> CarreraResponse.builder()
                        .id(c.getId())
                        .nombre(c.getNombre())
                        .areaId(c.getArea().getId())
                        .areaNombre(c.getArea().getNombre())
                        .build())
                .toList();
    }
}
