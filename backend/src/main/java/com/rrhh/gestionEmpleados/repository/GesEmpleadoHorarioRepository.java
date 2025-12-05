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
        JOIN FETCH eh.empleado
        JOIN FETCH eh.horario
        WHERE eh.activo = true
    """)
    List<GesEmpleadoHorario> listarHorariosEmpleadoActivo();
}