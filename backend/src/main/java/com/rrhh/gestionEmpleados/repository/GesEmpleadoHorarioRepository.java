package com.rrhh.gestionEmpleados.repository;

import com.rrhh.gestionEmpleados.model.GesEmpleadoHorario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GesEmpleadoHorarioRepository extends JpaRepository<GesEmpleadoHorario, Integer> {

    // Obtener el horario actual (activo y sin fecha_fin o fecha_fin futura)
    Optional<GesEmpleadoHorario> findFirstByIdEmpleadoAndActivoTrueOrderByFechaInicioDesc(Integer idEmpleado);
}