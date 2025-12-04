// com/rrhh/asistencia/service/impl/IReporteBuilder.java
package com.rrhh.asistencia.service.impl;

import com.rrhh.asistencia.dto.ReporteAsistenciaRequest;
import com.rrhh.asistencia.dto.ReporteAsistenciaResponse;

public interface IReporteBuilder {

    void inicializar(ReporteAsistenciaRequest filtro);

    void construirResumen();

    void construirDetalle();

    ReporteAsistenciaResponse build();
}
