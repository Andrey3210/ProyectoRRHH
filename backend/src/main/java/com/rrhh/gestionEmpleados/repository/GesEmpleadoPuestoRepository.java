package com.rrhh.gestionEmpleados.repository;

import com.rrhh.gestionEmpleados.model.GesEmpleadoPuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GesEmpleadoPuestoRepository extends JpaRepository<GesEmpleadoPuesto, Integer> {
    // Puesto actual = registro activo y sin fecha_fin o con fecha_fin futura
    @Query("""
        SELECT ep FROM GesEmpleadoPuesto ep
        JOIN FETCH ep.empleado e
        JOIN FETCH ep.puesto p
        WHERE ep.empleado.idEmpleado = :idEmpleado
         AND ep.activo = true
    """)
    GesEmpleadoPuesto obtenerPuestoActual(Integer idEmpleado);

    @Query("""
        SELECT ep
        FROM GesEmpleadoPuesto ep
        JOIN FETCH ep.empleado e
        JOIN FETCH ep.puesto p
        WHERE ep.activo = true
    """)
    List<GesEmpleadoPuesto> listarPuestosActivos();

    @Query("""
        SELECT ep
        FROM GesEmpleadoPuesto ep
        JOIN FETCH ep.empleado e
        JOIN FETCH ep.puesto p
        WHERE ep.activo = true
          AND p.area = :area
    """)
    List<GesEmpleadoPuesto> listarPuestosActivosPorArea(String area);

    boolean existsByEmpleadoIdEmpleadoAndActivoTrue(Integer idEmpleado);
}