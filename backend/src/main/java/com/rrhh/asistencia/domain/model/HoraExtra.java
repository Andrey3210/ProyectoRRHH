package com.rrhh.asistencia.domain.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "horas_extra")
public class HoraExtra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_hora_extra")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_registro", nullable = false)
    private RegistroAsistencia registroAsistencia;

    @Column(name = "id_empleado", insertable = false, updatable = false)
    private Integer idEmpleado; // solo lectura si quieres

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(name = "horas_trabajadas", nullable = false)
    private Double horasTrabajadas;

    @Column(name = "tipo_hora_extra", length = 50)
    private String tipoHoraExtra; // NORMAL, NOCTURNA, FERIADO

    @Column(name = "motivo")
    private String motivo;

    @Column(name = "estado", length = 50)
    private String estado; // PENDIENTE, APROBADA, RECHAZADA, PAGADA

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }

    // getters y setters...

    public Integer getId() { return id; }

    public void setId(Integer id) { this.id = id; }

    public RegistroAsistencia getRegistroAsistencia() { return registroAsistencia; }

    public void setRegistroAsistencia(RegistroAsistencia registroAsistencia) {
        this.registroAsistencia = registroAsistencia;
    }

    public Integer getIdEmpleado() { return idEmpleado; }

    public LocalDate getFecha() { return fecha; }

    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public LocalTime getHoraInicio() { return horaInicio; }

    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }

    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public Double getHorasTrabajadas() { return horasTrabajadas; }

    public void setHorasTrabajadas(Double horasTrabajadas) { this.horasTrabajadas = horasTrabajadas; }

    public String getTipoHoraExtra() { return tipoHoraExtra; }

    public void setTipoHoraExtra(String tipoHoraExtra) { this.tipoHoraExtra = tipoHoraExtra; }

    public String getMotivo() { return motivo; }

    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getEstado() { return estado; }

    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
}
