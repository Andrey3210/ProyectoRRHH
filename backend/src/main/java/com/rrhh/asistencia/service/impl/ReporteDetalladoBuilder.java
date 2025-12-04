package com.rrhh.asistencia.service.impl;

import com.rrhh.asistencia.dao.AsistenciaDAO;
import com.rrhh.asistencia.domain.enums.TipoRegistro;
import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.RegistroAsistencia;
import com.rrhh.asistencia.domain.model.ReporteAsistencia;

import java.time.LocalDate;
import java.util.List;

/**
 * Builder para un reporte más completo:
 * mismos totales que el básico, pero pensado para
 * usarse junto con una lista detallada de registros.
 *
 * La lista detallada no se guarda en ReporteAsistencia,
 * se devolvería aparte (por ejemplo, como DTO en el servicio).
 */
public class ReporteDetalladoBuilder implements IReporteBuilder {

    private final AsistenciaDAO asistenciaDAO;

    private EmpleadoAsis empleadoAsis;
    private LocalDate inicio;
    private LocalDate fin;
    private ReporteAsistencia reporte;

    // colección adicional con el detalle (opcional)
    private List<RegistroAsistencia> detalle;

    public ReporteDetalladoBuilder(AsistenciaDAO asistenciaDAO) {
        this.asistenciaDAO = asistenciaDAO;
        reset();
    }

    @Override
    public void reset() {
        this.reporte = new ReporteAsistencia();
        this.empleadoAsis = null;
        this.inicio = null;
        this.fin = null;
        this.detalle = null;
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
        this.reporte.setTipoReporte("DETALLADO");
    }

    @Override
    public void calcularTotales() {
        if (empleadoAsis == null || inicio == null || fin == null) {
            throw new IllegalStateException("Empleado o periodo no configurado en ReporteDetalladoBuilder");
        }

        // guardamos también el detalle para que el servicio pueda devolverlo
        this.detalle = asistenciaDAO.listarPorEmpleadoYRango(empleadoAsis, inicio, fin);

        int diasTrabajados = 0;
        int faltas = 0;
        int tardanzas = 0;
        double horasTrabajadas = 0;
        double horasExtra = 0; // placeholder, igual que en el básico

        for (RegistroAsistencia r : detalle) {
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

    /**
     * Devuelve el detalle por día/empleado para el rango de fechas.
     * El servicio puede exponer esto como otra lista en el DTO de respuesta.
     */
    public List<RegistroAsistencia> getDetalle() {
        return detalle;
    }
}
