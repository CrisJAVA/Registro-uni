package com.unp.repository;

import com.unp.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    Optional<Pago> findByCodigoAndNumeroMovimiento(String codigo, String numeroMovimiento);
}
