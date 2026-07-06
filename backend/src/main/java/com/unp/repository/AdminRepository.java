package com.unp.repository;

import com.unp.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByUsername(String username);
    boolean existsByUsername(String username);
}
