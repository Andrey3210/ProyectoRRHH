package com.rrhh.gestionEmpleados.repository;

import com.rrhh.gestionEmpleados.model.GesEmpleadoHorario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GesEmpleadoHorarioRepository extends JpaRepository<GesEmpleadoHorario, Integer> {

    @Query("""
        SELECT eh
        FROM GesEmpleadoHorario eh
        JOIN FETCH eh.empleado e
        JOIN FETCH eh.horario h
        WHERE eh.activo = true
    """)
    List<GesEmpleadoHorario> listarHorariosEmpleadoActivo();

    @Query("""
        SELECT eh
        FROM GesEmpleadoHorario eh
        JOIN FETCH eh.empleado e
        JOIN FETCH eh.horario h
        WHERE eh.empleado.idEmpleado = :idEmpleado
         AND eh.activo = true
    """)
    GesEmpleadoHorario obtenerHorariosEmpleadoActivo(Integer idEmpleado);
    boolean existsByEmpleadoIdEmpleadoAndActivoTrue(Integer idEmpleado);
}