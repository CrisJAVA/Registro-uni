package com.unp.repository;

import com.unp.entity.UsuarioEstudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioEstudianteRepository extends JpaRepository<UsuarioEstudiante, Long> {

    boolean existsByDni(String dni);

    boolean existsByPostulanteId(Long postulanteId);

    Optional<UsuarioEstudiante> findByDni(String dni);
}
