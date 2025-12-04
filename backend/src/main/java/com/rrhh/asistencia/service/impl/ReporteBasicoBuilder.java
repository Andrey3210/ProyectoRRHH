package com.rrhh.asistencia.service.impl;

import com.rrhh.asistencia.dao.AsistenciaDAO;
import com.rrhh.asistencia.domain.enums.TipoRegistro;
import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.RegistroAsistencia;
import com.rrhh.asistencia.domain.model.ReporteAsistencia;

import java.time.LocalDate;
import java.util.List;

public class ReporteBasicoBuilder implements IReporteBuilder {

    private final AsistenciaDAO asistenciaDAO;

    private EmpleadoAsis empleadoAsis;
    private LocalDate inicio;
    private LocalDate fin;
    private ReporteAsistencia reporte;

    public ReporteBasicoBuilder(AsistenciaDAO asistenciaDAO) {
        this.asistenciaDAO = asistenciaDAO;
        reset();
    }

    @Override
    public void reset() {
        this.reporte = new ReporteAsistencia();
        this.empleadoAsis = null;
        this.inicio = null;
        this.fin = null;
    }

    @Override
    public void setEmpleado(EmpleadoAsis empleadoAsis) {
        this.empleadoAsis = empleadoAsis;
        this.reporte.setEmpleado(empleadoAsis);
    }

    @Override
    public void setPeriodo(LocalDate inicio, LocalDate fin) {
        this.inicio = inicio;
        this.fin = fin;
        this.reporte.setPeriodoInicio(inicio);
        this.reporte.setPeriodoFin(fin);
        this.reporte.setTipoReporte("RESUMEN_BASICO");
    }

    @Override
    public void calcularTotales() {
        if (empleadoAsis == null || inicio == null || fin == null) {
            throw new IllegalStateException("Empleado o periodo no configurado en ReporteBasicoBuilder");
        }

        List<RegistroAsistencia> registros =
                asistenciaDAO.listarPorEmpleadoYRango(empleadoAsis, inicio, fin);

        int diasTrabajados = 0;
        int faltas = 0;
        int tardanzas = 0;
        double horasTrabajadas = 0;
        double horasExtra = 0; // por ahora 0; luego puedes sumar de horas_extra

        for (RegistroAsistencia r : registros) {
            if (r.getTipoRegistro() == TipoRegistro.FALTA) {
                faltas++;
            } else {
                diasTrabajados++;
            }
            if (r.getTipoRegistro() == TipoRegistro.TARDE) {
                tardanzas++;
            }
            if (r.getHoraEntrada() != null && r.getHoraSalida() != null) {
                horasTrabajadas += java.time.Duration.between(r.getHoraEntrada(), r.getHoraSalida()).toHours();
            }

        }

        reporte.setTotalDiasTrabajados(diasTrabajados);
        reporte.setTotalFaltas(faltas);
        reporte.setTotalTardanzas(tardanzas);
        reporte.setTotalHorasTrabajadas(horasTrabajadas);
        reporte.setTotalHorasExtra(horasExtra);
    }

    @Override
    public ReporteAsistencia build() {
        return reporte;
    }
}
