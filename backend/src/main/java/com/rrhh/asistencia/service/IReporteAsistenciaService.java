package com.rrhh.asistencia.service;

import com.rrhh.asistencia.domain.model.ReporteAsistencia;

import java.time.LocalDate;
import java.util.List;

public interface IReporteAsistenciaService {

    ReporteAsistencia generarReporteEmpleadoBasico(
            Integer idEmpleado,
            LocalDate inicio,
            LocalDate fin
    );

    List<ReporteAsistencia> generarReporteResumenPorEmpleado(
            LocalDate inicio,
            LocalDate fin,
            String area,
            Integer idEmpleadoOpcional
    );
}
