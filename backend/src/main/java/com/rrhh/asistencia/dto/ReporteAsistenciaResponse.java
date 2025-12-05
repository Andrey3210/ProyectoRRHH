// com/rrhh/asistencia/dto/ReporteAsistenciaResponse.java
package com.rrhh.asistencia.dto;

import java.util.List;

public class ReporteAsistenciaResponse {

    private ResumenAsistenciaDTO resumen;
    private List<EmpleadoReporteDTO> detalle;

    public ResumenAsistenciaDTO getResumen() { return resumen; }
    public void setResumen(ResumenAsistenciaDTO resumen) { this.resumen = resumen; }

    public List<EmpleadoReporteDTO> getDetalle() { return detalle; }
    public void setDetalle(List<EmpleadoReporteDTO> detalle) { this.detalle = detalle; }
}
