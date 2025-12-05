package com.rrhh.asistencia.domain.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

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

    // Campo transitorio: No se guarda en BD, pero sirve para enviarlo al Frontend si es necesario
    @Transient
    private List<RegistroAsistencia> detallesAsistencia;

    // --- CONSTRUCTORES ---

    // Constructor vacío obligatorio para JPA
    public ReporteAsistencia() {}

    // Constructor privado para el Builder
    private ReporteAsistencia(ReporteBuilder builder) {
        this.empleadoAsis = builder.empleadoAsis;
        this.periodoInicio = builder.periodoInicio;
        this.periodoFin = builder.periodoFin;
        this.tipoReporte = builder.tipoReporte;
        this.generadoPor = builder.generadoPor;
        this.totalDiasTrabajados = builder.totalDiasTrabajados;
        this.totalHorasTrabajadas = builder.totalHorasTrabajadas;
        this.totalTardanzas = builder.totalTardanzas;
        this.totalFaltas = builder.totalFaltas;
        this.totalHorasExtra = builder.totalHorasExtra;
        this.detallesAsistencia = builder.detalles; // Para pasar al frontend
    }


    // --- PATRÓN BUILDER ---

    public static ReporteBuilder builder() {
        return new ReporteBuilder();
    }

    public static class ReporteBuilder {
        private EmpleadoAsis empleadoAsis;
        private LocalDate periodoInicio;
        private LocalDate periodoFin;
        private String tipoReporte;
        private Integer generadoPor;

        // Métricas calculadas
        private Integer totalDiasTrabajados = 0;
        private Double totalHorasTrabajadas = 0.0;
        private Integer totalTardanzas = 0;
        private Integer totalFaltas = 0;
        private Double totalHorasExtra = 0.0;

        private List<RegistroAsistencia> detalles;

        public ReporteBuilder periodo(LocalDate inicio, LocalDate fin) {
            this.periodoInicio = inicio;
            this.periodoFin = fin;
            return this;
        }

        public ReporteBuilder tipo(String tipo) {
            this.tipoReporte = tipo;
            return this;
        }

        public ReporteBuilder empleado(EmpleadoAsis empleado) {
            this.empleadoAsis = empleado;
            return this;
        }

        // --- EL CEREBRO DEL BUILDER ---
        // Este método recibe la lista cruda de asistencias y calcula las estadísticas automáticamente
        public ReporteBuilder calcularMetricasDesdeLista(List<RegistroAsistencia> asistencias) {
            this.detalles = asistencias;
            if (asistencias == null || asistencias.isEmpty()) return this;

            this.totalDiasTrabajados = asistencias.size();

            for (RegistroAsistencia a : asistencias) {
                // 1. Contar Tardanzas
                if ("TARDANZA".equalsIgnoreCase(a.getTipoRegistro().toString())) {
                    this.totalTardanzas++;
                }
                // 2. Sumar Horas (Ejemplo simplificado)
                if (a.getHoraEntrada() != null && a.getHoraSalida() != null) {
                    long minutos = ChronoUnit.MINUTES.between(a.getHoraEntrada(), a.getHoraSalida());
                    this.totalHorasTrabajadas += (minutos / 60.0);
                }
                // Aquí agregarías lógica para horas extra o faltas
            }
            return this;
        }

        public ReporteAsistencia build() {
            return new ReporteAsistencia(this);
        }
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
