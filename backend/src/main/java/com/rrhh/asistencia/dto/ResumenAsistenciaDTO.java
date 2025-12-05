// com/rrhh/asistencia/dto/ResumenAsistenciaDTO.java
package com.rrhh.asistencia.dto;

public class ResumenAsistenciaDTO {

    private int diasTrabajados;
    private int faltas;
    private int tardanzas;
    private double horasExtra;

    public int getDiasTrabajados() { return diasTrabajados; }
    public void setDiasTrabajados(int diasTrabajados) { this.diasTrabajados = diasTrabajados; }

    public int getFaltas() { return faltas; }
    public void setFaltas(int faltas) { this.faltas = faltas; }

    public int getTardanzas() { return tardanzas; }
    public void setTardanzas(int tardanzas) { this.tardanzas = tardanzas; }

    public double getHorasExtra() { return horasExtra; }
    public void setHorasExtra(double horasExtra) { this.horasExtra = horasExtra; }
}
