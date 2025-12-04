package com.rrhh.asistencia.service;

import com.rrhh.asistencia.domain.model.RegistroAsistencia;
import com.rrhh.asistencia.dto.AsistenciaHoyDTO;

import java.time.LocalDate;
import java.util.List;

public interface IAsistenciaService {

    RegistroAsistencia marcarAsistencia(Integer idEmpleado);
    RegistroAsistencia calcularEstadoActual(Integer idEmpleado);

    List<AsistenciaHoyDTO> obtenerAsistenciaHoyParaTimeline();

    List<RegistroAsistencia> obtenerAsistenciaHoy();

    List<RegistroAsistencia> obtenerAsistenciaEmpleado(
            Integer idEmpleado,
            LocalDate desde,
            LocalDate hasta
    );
}
