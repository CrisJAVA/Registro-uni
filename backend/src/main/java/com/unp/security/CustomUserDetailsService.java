package com.unp.security;

import com.unp.repository.AdminRepository;
import com.unp.repository.UsuarioEstudianteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final UsuarioEstudianteRepository usuarioEstudianteRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var admin = adminRepository.findByUsername(username);
        if (admin.isPresent()) {
            return new AdminPrincipal(admin.get());
        }

        var estudiante = usuarioEstudianteRepository.findByDni(username);
        if (estudiante.isPresent()) {
            return new EstudiantePrincipal(estudiante.get());
        }

        throw new UsernameNotFoundException("Usuario no encontrado: " + username);
    }
}
