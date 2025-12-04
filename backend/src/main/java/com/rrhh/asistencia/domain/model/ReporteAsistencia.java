package com.rrhh.asistencia.domain.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reportes_asistencia")
public class ReporteAsistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado")
    private EmpleadoAsis empleadoAsis; // null si es reporte general

    @Column(name = "periodo_inicio", nullable = false)
    private LocalDate periodoInicio;

    @Column(name = "periodo_fin", nullable = false)
    private LocalDate periodoFin;

    @Column(name = "tipo_reporte", nullable = false, length = 50)
    private String tipoReporte; // MENSUAL, PERSONAL, etc.

    @Column(name = "total_dias_trabajados")
    private Integer totalDiasTrabajados;

    @Column(name = "total_horas_trabajadas")
    private Double totalHorasTrabajadas;

    @Column(name = "total_tardanzas")
    private Integer totalTardanzas;

    @Column(name = "total_faltas")
    private Integer totalFaltas;

    @Column(name = "total_horas_extra")
    private Double totalHorasExtra;

    @Column(name = "generado_por")
    private Integer generadoPor; // id_usuario que generó (si lo necesitas)

    @Column(name = "fecha_generacion")
    private LocalDateTime fechaGeneracion;

    @PrePersist
    protected void onCreate() {
        fechaGeneracion = LocalDateTime.now();
    }

    // ===== getters y setters =====

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public EmpleadoAsis getEmpleado() {
        return empleadoAsis;
    }

    public void setEmpleado(EmpleadoAsis empleadoAsis) {
        this.empleadoAsis = empleadoAsis;
    }

    public LocalDate getPeriodoInicio() {
        return periodoInicio;
    }

    public void setPeriodoInicio(LocalDate periodoInicio) {
        this.periodoInicio = periodoInicio;
    }

    public LocalDate getPeriodoFin() {
        return periodoFin;
    }

    public void setPeriodoFin(LocalDate periodoFin) {
        this.periodoFin = periodoFin;
    }

    public String getTipoReporte() {
        return tipoReporte;
    }

    public void setTipoReporte(String tipoReporte) {
        this.tipoReporte = tipoReporte;
    }

    public Integer getTotalDiasTrabajados() {
        return totalDiasTrabajados;
    }

    public void setTotalDiasTrabajados(Integer totalDiasTrabajados) {
        this.totalDiasTrabajados = totalDiasTrabajados;
    }

    public Double getTotalHorasTrabajadas() {
        return totalHorasTrabajadas;
    }

    public void setTotalHorasTrabajadas(Double totalHorasTrabajadas) {
        this.totalHorasTrabajadas = totalHorasTrabajadas;
    }

    public Integer getTotalTardanzas() {
        return totalTardanzas;
    }

    public void setTotalTardanzas(Integer totalTardanzas) {
        this.totalTardanzas = totalTardanzas;
    }

    public Integer getTotalFaltas() {
        return totalFaltas;
    }

    public void setTotalFaltas(Integer totalFaltas) {
        this.totalFaltas = totalFaltas;
    }

    public Double getTotalHorasExtra() {
        return totalHorasExtra;
    }

    public void setTotalHorasExtra(Double totalHorasExtra) {
        this.totalHorasExtra = totalHorasExtra;
    }

    public Integer getGeneradoPor() {
        return generadoPor;
    }

    public void setGeneradoPor(Integer generadoPor) {
        this.generadoPor = generadoPor;
    }

    public LocalDateTime getFechaGeneracion() {
        return fechaGeneracion;
    }

    public void setFechaGeneracion(LocalDateTime fechaGeneracion) {
        this.fechaGeneracion = fechaGeneracion;
    }
}
