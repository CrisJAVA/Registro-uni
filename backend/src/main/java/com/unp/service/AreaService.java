package com.unp.service;

import com.unp.dto.AreaResponse;
import com.unp.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;

    @Transactional(readOnly = true)
    public List<AreaResponse> listarTodas() {
        return areaRepository.findAll().stream()
                .map(a -> AreaResponse.builder()
                        .id(a.getId())
                        .codigo(a.getCodigo())
                        .nombre(a.getNombre())
                        .build())
                .toList();
    }
}
