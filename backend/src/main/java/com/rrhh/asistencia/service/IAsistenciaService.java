package com.rrhh.asistencia.service;

import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.RegistroAsistencia;
import com.rrhh.asistencia.dto.AsistenciaHoyDTO;

import java.time.LocalDate;
import java.time.LocalTime;
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

    EmpleadoAsis obtenerEmpleadoPorUsuario(Integer idUsuario);
    RegistroAsistencia corregirAsistencia(
            Integer idRegistro,
            Integer idEmpleado,
            LocalDate fecha,
            LocalTime horaEntrada,
            LocalTime horaSalida,
            String tipoRegistro, // PRESENTE / FALTA / JUSTIFICADA...
            String motivo,
            Integer idUsuarioCorrige
    );

}
