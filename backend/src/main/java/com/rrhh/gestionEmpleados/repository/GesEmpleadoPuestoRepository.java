package com.rrhh.gestionEmpleados.repository;

import com.rrhh.gestionEmpleados.model.GesEmpleadoPuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GesEmpleadoPuestoRepository extends JpaRepository<GesEmpleadoPuesto, Integer> {
    // Puesto actual = registro activo y sin fecha_fin o con fecha_fin futura
    @Query("""
           SELECT ep FROM GesEmpleadoPuesto ep
           WHERE ep.empleado.idEmpleado = :idEmpleado
             AND ep.activo = true
           ORDER BY ep.fechaInicio DESC
           LIMIT 1
           """)
    GesEmpleadoPuesto obtenerPuestoActual(Integer idEmpleado);
}