package com.unp.repository;

import com.unp.entity.Carrera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarreraRepository extends JpaRepository<Carrera, Long> {

    @Query("SELECT c FROM Carrera c LEFT JOIN FETCH c.area ORDER BY c.nombre")
    List<Carrera> findAllConArea();

    @Query("SELECT c FROM Carrera c LEFT JOIN FETCH c.area WHERE c.area.id = :areaId ORDER BY c.nombre")
    List<Carrera> findByAreaIdConArea(@Param("areaId") Long areaId);
}
