package com.unp.repository;

import com.unp.entity.ProcesoAdmision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProcesoAdmisionRepository extends JpaRepository<ProcesoAdmision, Long> {
    Optional<ProcesoAdmision> findByEstado(String estado);
}
