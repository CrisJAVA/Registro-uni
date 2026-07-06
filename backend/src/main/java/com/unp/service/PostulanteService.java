package com.unp.service;

import com.unp.dto.*;
import com.unp.entity.Postulante;
import com.unp.exception.ResourceNotFoundException;
import com.unp.repository.AreaRepository;
import com.unp.repository.CarreraRepository;
import com.unp.repository.PostulanteRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostulanteService {

    private final PostulanteRepository postulanteRepository;
    private final AreaRepository areaRepository;
    private final CarreraRepository carreraRepository;

    public PostulanteResponse registrar(PostulanteRequest request) {
        var postulante = new Postulante();
        postulante.setTipoDocumento(request.getTipoDocumento());
        postulante.setNumeroDocumento(request.getNumeroDocumento());
        postulante.setNombres(request.getNombres());
        postulante.setApellidos(request.getApellidos());
        postulante.setFechaNacimiento(request.getFechaNacimiento());
        postulante.setSexo(request.getSexo());
        postulante.setEmail(request.getEmail());
        postulante.setTelefono(request.getTelefono());
        postulante.setDireccion(request.getDireccion());
        postulante.setDepartamento(request.getDepartamento());
        postulante.setProvincia(request.getProvincia());
        postulante.setDistrito(request.getDistrito());
        postulante.setTipoColegio(request.getTipoColegio());
        postulante.setFechaRegistro(LocalDate.now());

        if (request.getAreaId() != null) {
            var area = areaRepository.findById(request.getAreaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Área no encontrada"));
            postulante.setArea(area);
        }
        if (request.getCarreraId() != null) {
            var carrera = carreraRepository.findById(request.getCarreraId())
                    .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada"));
            postulante.setCarrera(carrera);
        }

        var saved = postulanteRepository.save(postulante);
        return toResponse(saved);
    }

    public List<PostulanteResponse> listarTodos() {
        return postulanteRepository.findAllByOrderByFechaRegistroDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PostulanteResponse> buscar(String search, Long areaId, Long carreraId) {
        return postulanteRepository.buscar(search, areaId, carreraId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PostulanteResponse obtenerPorId(Long id) {
        var p = postulanteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Postulante no encontrado con id: " + id));
        return toResponse(p);
    }

    public PostulanteResponse actualizar(Long id, PostulanteRequest request) {
        var p = postulanteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Postulante no encontrado con id: " + id));

        p.setTipoDocumento(request.getTipoDocumento());
        p.setNumeroDocumento(request.getNumeroDocumento());
        p.setNombres(request.getNombres());
        p.setApellidos(request.getApellidos());
        p.setFechaNacimiento(request.getFechaNacimiento());
        p.setSexo(request.getSexo());
        p.setEmail(request.getEmail());
        p.setTelefono(request.getTelefono());
        p.setDireccion(request.getDireccion());
        p.setDepartamento(request.getDepartamento());
        p.setProvincia(request.getProvincia());
        p.setDistrito(request.getDistrito());
        p.setTipoColegio(request.getTipoColegio());

        if (request.getAreaId() != null) {
            var area = areaRepository.findById(request.getAreaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Área no encontrada"));
            p.setArea(area);
        }
        if (request.getCarreraId() != null) {
            var carrera = carreraRepository.findById(request.getCarreraId())
                    .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada"));
            p.setCarrera(carrera);
        }

        var saved = postulanteRepository.save(p);
        return toResponse(saved);
    }

    public void eliminar(Long id) {
        if (!postulanteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Postulante no encontrado con id: " + id);
        }
        postulanteRepository.deleteById(id);
    }

    public List<PostulanteResponse> listarTodosParaReporte() {
        return postulanteRepository.findAllByOrderByFechaRegistroDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PostulanteResponse toResponse(Postulante p) {
        return PostulanteResponse.builder()
                .id(p.getId())
                .tipoDocumento(p.getTipoDocumento())
                .numeroDocumento(p.getNumeroDocumento())
                .nombres(p.getNombres())
                .apellidos(p.getApellidos())
                .fechaNacimiento(p.getFechaNacimiento())
                .sexo(p.getSexo())
                .email(p.getEmail())
                .telefono(p.getTelefono())
                .direccion(p.getDireccion())
                .departamento(p.getDepartamento())
                .provincia(p.getProvincia())
                .distrito(p.getDistrito())
                .tipoColegio(p.getTipoColegio())
                .areaId(p.getArea() != null ? p.getArea().getId() : null)
                .areaNombre(p.getArea() != null ? p.getArea().getNombre() : null)
                .carreraId(p.getCarrera() != null ? p.getCarrera().getId() : null)
                .carreraNombre(p.getCarrera() != null ? p.getCarrera().getNombre() : null)
                .fechaRegistro(p.getFechaRegistro())
                .build();
    }
}
