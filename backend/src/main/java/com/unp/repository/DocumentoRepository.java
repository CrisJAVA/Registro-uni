package com.unp.repository;

import com.unp.entity.DocumentoEstudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<DocumentoEstudiante, Long> {

    List<DocumentoEstudiante> findByPostulanteIdOrderByFechaSubidaDesc(Long postulanteId);

    List<DocumentoEstudiante> findAllByOrderByFechaSubidaDesc();

    long countByPostulanteIdAndTipoDocumento(Long postulanteId, String tipoDocumento);

    long countByPostulanteIdAndEstado(Long postulanteId, String estado);
}
