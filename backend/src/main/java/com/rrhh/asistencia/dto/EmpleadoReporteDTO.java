// com/rrhh/asistencia/dto/EmpleadoReporteDTO.java
package com.rrhh.asistencia.dto;

public class EmpleadoReporteDTO {

    private Long empleadoId;
    private String empleadoNombre;
    private String areaNombre;
    private int diasTrabajados;
    private int faltas;
    private int tardanzas;
    private double horasExtra;

    public EmpleadoReporteDTO() {}

    public Long getEmpleadoId() { return empleadoId; }
    public void setEmpleadoId(Long empleadoId) { this.empleadoId = empleadoId; }

    public String getEmpleadoNombre() { return empleadoNombre; }
    public void setEmpleadoNombre(String empleadoNombre) { this.empleadoNombre = empleadoNombre; }

    public String getAreaNombre() { return areaNombre; }
    public void setAreaNombre(String areaNombre) { this.areaNombre = areaNombre; }

    public int getDiasTrabajados() { return diasTrabajados; }
    public void setDiasTrabajados(int diasTrabajados) { this.diasTrabajados = diasTrabajados; }

    public int getFaltas() { return faltas; }
    public void setFaltas(int faltas) { this.faltas = faltas; }

    public int getTardanzas() { return tardanzas; }
    public void setTardanzas(int tardanzas) { this.tardanzas = tardanzas; }

    public double getHorasExtra() { return horasExtra; }
    public void setHorasExtra(double horasExtra) { this.horasExtra = horasExtra; }
}
