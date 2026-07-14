package com.unp.security;

import com.unp.entity.UsuarioEstudiante;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter @Setter
public class EstudiantePrincipal implements UserDetails {
    private Long id;
    private String username;
    private String password;
    private String dni;
    private Long postulanteId;
    private boolean activo;

    public EstudiantePrincipal(UsuarioEstudiante usuario) {
        this.id = usuario.getId();
        this.username = usuario.getDni();
        this.password = usuario.getPassword();
        this.dni = usuario.getDni();
        this.postulanteId = usuario.getPostulante().getId();
        this.activo = usuario.getActivo();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_ESTUDIANTE"));
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return activo; }
}
