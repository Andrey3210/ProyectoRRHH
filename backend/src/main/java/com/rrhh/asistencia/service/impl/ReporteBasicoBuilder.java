// com/rrhh/asistencia/service/impl/builder/ReporteBasicoBuilder.java
package com.rrhh.asistencia.service.impl.builder;

import com.rrhh.asistencia.dao.ReporteAsistenciaDAO;
import com.rrhh.asistencia.dto.*;
import com.rrhh.asistencia.service.impl.IReporteBuilder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReporteBasicoBuilder implements IReporteBuilder {

    private final ReporteAsistenciaDAO reporteAsistenciaDAO;

    public ReporteBasicoBuilder(ReporteAsistenciaDAO reporteAsistenciaDAO) {
        this.reporteAsistenciaDAO = reporteAsistenciaDAO;
    }

    private ReporteAsistenciaRequest filtro;
    private ReporteAsistenciaResponse respuesta;

    @Override
    public void inicializar(ReporteAsistenciaRequest filtro) {
        this.filtro = filtro;
        this.respuesta = new ReporteAsistenciaResponse();
    }

    @Override
    public void construirResumen() {
        ResumenAsistenciaDTO resumen = reporteAsistenciaDAO.obtenerResumenAsistencia(filtro);
        respuesta.setResumen(resumen);
    }

    @Override
    public void construirDetalle() {
        List<EmpleadoReporteDTO> detalle = reporteAsistenciaDAO.obtenerDetalleAsistencia(filtro);
        System.out.println("DETALLE REPORTE = " + detalle.size());
        if (!detalle.isEmpty()) {
            EmpleadoReporteDTO first = detalle.get(0);
            System.out.println("PRIMER EMPLEADO = " + first.getEmpleadoNombre()
                    + " / area=" + first.getAreaNombre());
        }
        respuesta.setDetalle(detalle);
    }


    @Override
    public ReporteAsistenciaResponse build() {
        return respuesta;
    }
}
