// com/rrhh/asistencia/service/impl/builder/DirectorReporteAsistencia.java
package com.rrhh.asistencia.service.impl.builder;

import com.rrhh.asistencia.dto.ReporteAsistenciaRequest;
import com.rrhh.asistencia.service.impl.IReporteBuilder;
import org.springframework.stereotype.Component;

@Component
public class DirectorReporteAsistencia {

    public void construirReporte(IReporteBuilder builder, ReporteAsistenciaRequest filtro) {
        builder.inicializar(filtro);
        builder.construirResumen();
        builder.construirDetalle();
    }
}
