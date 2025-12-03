package com.rrhh.incentivos.repository;

import com.rrhh.shared.domain.model.ReglaIncentivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReglaIncentivoRepository extends JpaRepository<ReglaIncentivo, Integer> {
    
    // Obtener solo las reglas que están activas actualmente
    List<ReglaIncentivo> findByActivoTrue();
}