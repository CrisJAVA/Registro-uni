package com.unp.service;

import com.unp.dto.CambioPasswordRequest;
import com.unp.dto.LoginRequest;
import com.unp.dto.LoginResponse;
import com.unp.dto.EstudianteProfileResponse;
import com.unp.exception.BadRequestException;
import com.unp.repository.UsuarioEstudianteRepository;
import com.unp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EstudianteService {

    private final UsuarioEstudianteRepository usuarioEstudianteRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            throw new BadCredentialsException("Credenciales incorrectas");
        }

        var usuario = usuarioEstudianteRepository.findByDni(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        if (!usuario.getActivo()) {
            throw new BadCredentialsException("Cuenta desactivada");
        }

        var postulante = usuario.getPostulante();
        String token = tokenProvider.generateToken(usuario.getDni());

        return LoginResponse.builder()
                .token(token)
                .nombre(postulante.getNombres() + " " + postulante.getApellidos())
                .email(postulante.getEmail())
                .mensaje("Inicio de sesión exitoso")
                .build();
    }

    public String getDniFromToken(String token) {
        return tokenProvider.getUsernameFromToken(token);
    }

    @Transactional
    public void cambiarPassword(String dni, CambioPasswordRequest request) {
        var usuario = usuarioEstudianteRepository.findByDni(dni)
                .orElseThrow(() -> new BadCredentialsException("Estudiante no encontrado"));

        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            throw new BadRequestException("La contraseña actual no es correcta");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuario.setDebeCambiarPassword(false);
        usuarioEstudianteRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public EstudianteProfileResponse obtenerPerfilByDni(String dni) {
        var usuario = usuarioEstudianteRepository.findByDni(dni)
                .orElseThrow(() -> new BadCredentialsException("Estudiante no encontrado"));

        var postulante = usuario.getPostulante();

        return EstudianteProfileResponse.builder()
                .id(postulante.getId())
                .tipoDocumento(postulante.getTipoDocumento())
                .numeroDocumento(postulante.getNumeroDocumento())
                .nombres(postulante.getNombres())
                .apellidos(postulante.getApellidos())
                .fechaNacimiento(postulante.getFechaNacimiento())
                .sexo(postulante.getSexo())
                .email(postulante.getEmail())
                .telefono(postulante.getTelefono())
                .direccion(postulante.getDireccion())
                .departamento(postulante.getDepartamento())
                .provincia(postulante.getProvincia())
                .distrito(postulante.getDistrito())
                .tipoColegio(postulante.getTipoColegio())
                .areaNombre(postulante.getArea() != null ? postulante.getArea().getNombre() : null)
                .carreraNombre(postulante.getCarrera() != null ? postulante.getCarrera().getNombre() : null)
                .fechaRegistro(postulante.getFechaRegistro())
                .debeCambiarPassword(usuario.getDebeCambiarPassword())
                .build();
    }
}
