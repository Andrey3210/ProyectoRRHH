package com.rrhh.incentivos.repository;

import com.rrhh.shared.domain.model.Bono;
import com.rrhh.shared.domain.model.EstadoBono;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BonoRepository extends JpaRepository<Bono, Integer> {

    List<Bono> findByEmpleadoIdEmpleado(Integer idEmpleado);

    List<Bono> findByEmpleadoIdEmpleadoAndPeriodo(Integer idEmpleado, String periodo);

    @Query("SELECT b FROM Bono b WHERE b.estado = 'PENDIENTE'")
    List<Bono> findBonosPendientes();
    @Query("SELECT SUM(b.monto) FROM Bono b WHERE b.periodo = :periodo")
    BigDecimal sumMontoTotalPorPeriodo(@Param("periodo") String periodo);

    long countByEstado(EstadoBono estado);
    
    @Query("SELECT b.periodo, SUM(b.monto) FROM Bono b GROUP BY b.periodo ORDER BY b.periodo DESC LIMIT 6")
    List<Object[]> findEvolucionSemestral();
}