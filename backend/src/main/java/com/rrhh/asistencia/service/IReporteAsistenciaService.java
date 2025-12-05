package com.rrhh.asistencia.service;

import com.rrhh.asistencia.domain.model.ReporteAsistencia;
import com.rrhh.asistencia.dto.ReporteAsistenciaRequest;
import com.rrhh.asistencia.dto.ReporteAsistenciaResponse;

import java.time.LocalDate;
import java.util.List;

public interface IReporteAsistenciaService {

    // Métodos antiguos que devuelven entidad (si aún los usas en otro lado)
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

    // Nuevo método para la pantalla de reportes (DTO)
    ReporteAsistenciaResponse generarReporte(ReporteAsistenciaRequest filtro);
}
