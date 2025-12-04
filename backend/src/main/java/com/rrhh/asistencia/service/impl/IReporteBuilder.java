package com.rrhh.asistencia.service.impl;

import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.ReporteAsistencia;

import java.time.LocalDate;

public interface IReporteBuilder {

    void reset();

    void setEmpleado(EmpleadoAsis empleadoAsis);              // null para reporte general

    void setPeriodo(LocalDate inicio, LocalDate fin);

    void calcularTotales();                           // usa registros_asistencia internamente

    ReporteAsistencia build();
}
