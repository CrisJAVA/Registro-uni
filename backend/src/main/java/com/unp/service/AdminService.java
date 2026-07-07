package com.unp.service;

import com.unp.dto.LoginRequest;
import com.unp.dto.LoginResponse;
import com.unp.repository.AdminRepository;
import com.unp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            throw new BadCredentialsException("Credenciales incorrectas");
        }

        var admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        String token = tokenProvider.generateToken(admin.getUsername());

        return LoginResponse.builder()
                .token(token)
                .nombre(admin.getNombre())
                .email(admin.getEmail())
                .mensaje("Inicio de sesión exitoso")
                .build();
    }
}
