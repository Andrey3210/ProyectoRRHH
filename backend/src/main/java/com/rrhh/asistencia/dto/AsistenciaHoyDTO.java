package com.rrhh.asistencia.dto;

public class AsistenciaHoyDTO {

    private Integer idEmpleado;
    private String nombreCompleto;
    private String area;          // opcional
    private String tipoRegistro;  // PUNTUAL, TARDE, FALTA, JUSTIFICADA, etc.
    private String inicio;        // "HH:mm"
    private String fin;           // "HH:mm" (null si sigue trabajando)

    public AsistenciaHoyDTO() {
    }

    public AsistenciaHoyDTO(Integer idEmpleado,
                            String nombreCompleto,
                            String area,
                            String tipoRegistro,
                            String inicio,
                            String fin) {
        this.idEmpleado = idEmpleado;
        this.nombreCompleto = nombreCompleto;
        this.area = area;
        this.tipoRegistro = tipoRegistro;
        this.inicio = inicio;
        this.fin = fin;
    }

    public Integer getIdEmpleado() {
        return idEmpleado;
    }

    public void setIdEmpleado(Integer idEmpleado) {
        this.idEmpleado = idEmpleado;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getTipoRegistro() {
        return tipoRegistro;
    }

    public void setTipoRegistro(String tipoRegistro) {
        this.tipoRegistro = tipoRegistro;
    }

    public String getInicio() {
        return inicio;
    }

    public void setInicio(String inicio) {
        this.inicio = inicio;
    }

    public String getFin() {
        return fin;
    }

    public void setFin(String fin) {
        this.fin = fin;
    }
}
