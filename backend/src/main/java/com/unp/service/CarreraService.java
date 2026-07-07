package com.unp.service;

import com.unp.dto.CarreraResponse;
import com.unp.repository.CarreraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarreraService {

    private final CarreraRepository carreraRepository;

    @Transactional(readOnly = true)
    public List<CarreraResponse> listarTodas() {
        return carreraRepository.findAllConArea().stream()
                .map(c -> CarreraResponse.builder()
                        .id(c.getId())
                        .nombre(c.getNombre())
                        .areaId(c.getArea() != null ? c.getArea().getId() : null)
                        .areaNombre(c.getArea() != null ? c.getArea().getNombre() : null)
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CarreraResponse> listarPorArea(Long areaId) {
        return carreraRepository.findByAreaIdConArea(areaId).stream()
                .map(c -> CarreraResponse.builder()
                        .id(c.getId())
                        .nombre(c.getNombre())
                        .areaId(c.getArea() != null ? c.getArea().getId() : null)
                        .areaNombre(c.getArea() != null ? c.getArea().getNombre() : null)
                        .build())
                .toList();
    }
}
