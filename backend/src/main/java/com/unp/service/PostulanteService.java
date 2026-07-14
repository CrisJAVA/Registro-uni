package com.unp.service;

import com.unp.dto.*;
import com.unp.entity.Postulante;
import com.unp.entity.UsuarioEstudiante;
import com.unp.exception.BadRequestException;
import com.unp.exception.ResourceNotFoundException;
import com.unp.repository.AreaRepository;
import com.unp.repository.CarreraRepository;
import com.unp.repository.PostulanteRepository;
import com.unp.repository.UsuarioEstudianteRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostulanteService {

    private static final Logger log = LoggerFactory.getLogger(PostulanteService.class);

    private final PostulanteRepository postulanteRepository;
    private final AreaRepository areaRepository;
    private final CarreraRepository carreraRepository;
    private final UsuarioEstudianteRepository usuarioEstudianteRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public PostulanteResponse registrar(PostulanteRequest request) {
        if (postulanteRepository.existsByNumeroDocumento(request.getNumeroDocumento())) {
            throw new BadRequestException("Ya existe un postulante registrado con ese número de documento");
        }

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
        log.info("Postulante guardado con ID {} y DNI {}", saved.getId(), saved.getNumeroDocumento());

        crearCredencialesEstudiante(saved);
        log.info("Credenciales creadas para el postulante ID {}", saved.getId());

        return toResponse(saved);
    }

    private void crearCredencialesEstudiante(Postulante postulante) {
        if (usuarioEstudianteRepository.existsByPostulanteId(postulante.getId())) {
            log.info("Ya existen credenciales para el postulante ID {}", postulante.getId());
            return;
        }

        String dni = postulante.getNumeroDocumento();

        var usuario = UsuarioEstudiante.builder()
                .postulante(postulante)
                .dni(dni)
                .password(passwordEncoder.encode(dni))
                .rol("ESTUDIANTE")
                .activo(true)
                .debeCambiarPassword(true)
                .fechaCreacion(LocalDateTime.now())
                .build();

        usuarioEstudianteRepository.save(usuario);
        log.info("Usuario estudiante creado con DNI {}", dni);
    }

    @Transactional(readOnly = true)
    public List<PostulanteResponse> listarTodos() {
        return postulanteRepository.findAllConAreaCarrera()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostulanteResponse> buscar(String search, Long areaId, Long carreraId) {
        return postulanteRepository.buscar(search, areaId, carreraId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PostulanteResponse obtenerPorId(Long id) {
        var p = postulanteRepository.findByIdConAreaCarrera(id)
                .orElseThrow(() -> new ResourceNotFoundException("Postulante no encontrado con id: " + id));
        return toResponse(p);
    }

    @Transactional
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

    @Transactional
    public void eliminar(Long id) {
        if (!postulanteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Postulante no encontrado con id: " + id);
        }
        postulanteRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PostulanteResponse> listarTodosParaReporte() {
        return postulanteRepository.findAllConAreaCarrera()
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
