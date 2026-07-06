package com.unp.repository;

import com.unp.entity.Postulante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostulanteRepository extends JpaRepository<Postulante, Long> {

    @Query("SELECT p FROM Postulante p LEFT JOIN FETCH p.area LEFT JOIN FETCH p.carrera WHERE " +
           "(:search IS NULL OR p.numeroDocumento LIKE %:search% OR p.nombres LIKE %:search% OR p.apellidos LIKE %:search%) AND " +
           "(:areaId IS NULL OR p.area.id = :areaId) AND " +
           "(:carreraId IS NULL OR p.carrera.id = :carreraId) " +
           "ORDER BY p.fechaRegistro DESC")
    List<Postulante> buscar(@Param("search") String search,
                           @Param("areaId") Long areaId,
                           @Param("carreraId") Long carreraId);

    List<Postulante> findAllByOrderByFechaRegistroDesc();
}
