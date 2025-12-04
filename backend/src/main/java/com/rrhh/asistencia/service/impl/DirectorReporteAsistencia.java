package com.rrhh.asistencia.service.impl;

import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.ReporteAsistencia;

import java.time.LocalDate;

public class DirectorReporteAsistencia {

    private IReporteBuilder builder;

    public void setBuilder(IReporteBuilder builder) {
        this.builder = builder;
    }

    public ReporteAsistencia construirReporteEmpleadoBasico(
            EmpleadoAsis empleadoAsis,
            LocalDate inicio,
            LocalDate fin
    ) {
        builder.reset();
        builder.setEmpleado(empleadoAsis);
        builder.setPeriodo(inicio, fin);
        builder.calcularTotales();
        return builder.build();
    }
}
