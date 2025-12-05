package com.rrhh.gestionEmpleados.repository;

import com.rrhh.gestionEmpleados.model.GesEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GesEmpleadoRepository extends JpaRepository<GesEmpleado, Integer> {

    @Query("""
    SELECT e FROM GesEmpleado e
    JOIN GesEmpleadoPuesto ep ON ep.empleado.idEmpleado = e.idEmpleado
    WHERE ep.activo = true
    """)
    List<GesEmpleado> listarEmpleadosConPuestoActual();

    @Query("""
        SELECT e
        FROM GesEmpleado e
        JOIN GesEmpleadoPuesto ep ON ep.empleado.idEmpleado = e.idEmpleado
        JOIN GesPuesto p ON p.idPuesto = ep.puesto.idPuesto
        WHERE ep.activo = true
          AND p.area = :area
    """)
    List<GesEmpleado> listarEmpleadosPorArea(String area);
}