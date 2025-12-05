// com/rrhh/asistencia/dto/ReporteAsistenciaRequest.java
package com.rrhh.asistencia.dto;

public class ReporteAsistenciaRequest {

    private String fechaInicio;
    private String fechaFin;
    private Long areaId;
    private Long empleadoId;
    private boolean soloFaltas;
    private boolean soloTardanzas;
    private boolean incluirSinRegistro;

    public ReporteAsistenciaRequest() {
    }

    public ReporteAsistenciaRequest(String fechaInicio, String fechaFin,
                                    Long areaId, Long empleadoId,
                                    boolean soloFaltas, boolean soloTardanzas,
                                    boolean incluirSinRegistro) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.areaId = areaId;
        this.empleadoId = empleadoId;
        this.soloFaltas = soloFaltas;
        this.soloTardanzas = soloTardanzas;
        this.incluirSinRegistro = incluirSinRegistro;
    }

    public String getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(String fechaInicio) { this.fechaInicio = fechaInicio; }

    public String getFechaFin() { return fechaFin; }
    public void setFechaFin(String fechaFin) { this.fechaFin = fechaFin; }

    public Long getAreaId() { return areaId; }
    public void setAreaId(Long areaId) { this.areaId = areaId; }

    public Long getEmpleadoId() { return empleadoId; }
    public void setEmpleadoId(Long empleadoId) { this.empleadoId = empleadoId; }

    public boolean isSoloFaltas() { return soloFaltas; }
    public void setSoloFaltas(boolean soloFaltas) { this.soloFaltas = soloFaltas; }

    public boolean isSoloTardanzas() { return soloTardanzas; }
    public void setSoloTardanzas(boolean soloTardanzas) { this.soloTardanzas = soloTardanzas; }

    public boolean isIncluirSinRegistro() { return incluirSinRegistro; }
    public void setIncluirSinRegistro(boolean incluirSinRegistro) { this.incluirSinRegistro = incluirSinRegistro; }
}
