package com.rrhh.asistencia.domain.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "correcciones_asistencia")
public class CorreccionAsistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_correccion")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_registro")
    private RegistroAsistencia registroAsistencia;

    @Column(name = "id_empleado", nullable = false)
    private Integer idEmpleado;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "tipo_correccion", nullable = false, length = 50)
    private String tipoCorreccion; // ENTRADA, SALIDA, AMBAS

    @Column(name = "hora_anterior")
    private LocalTime horaAnterior;

    @Column(name = "hora_corregida", nullable = false)
    private LocalTime horaCorregida;

    @Column(name = "motivo", nullable = false)
    private String motivo;

    @Column(name = "corregida_por", nullable = false)
    private Integer corregidaPor;

    @Column(name = "aprobada_por")
    private Integer aprobadaPor;

    @Column(name = "estado", length = 50)
    private String estado; // PENDIENTE, APROBADA, RECHAZADA

    @Column(name = "fecha_correccion")
    private LocalDateTime fechaCorreccion;

    @PrePersist
    protected void onCreate() {
        fechaCorreccion = LocalDateTime.now();
    }

    // getters y setters...

    public Integer getIdCorreccion() { return id; }

    public void setId(Integer id) { this.id = id; }

    public RegistroAsistencia getRegistroAsistencia() { return registroAsistencia; }

    public void setRegistroAsistencia(RegistroAsistencia registroAsistencia) {
        this.registroAsistencia = registroAsistencia;
    }

    public Integer getIdEmpleado() { return idEmpleado; }

    public void setIdEmpleado(Integer idEmpleado) { this.idEmpleado = idEmpleado; }

    public LocalDate getFecha() { return fecha; }

    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getTipoCorreccion() { return tipoCorreccion; }

    public void setTipoCorreccion(String tipoCorreccion) { this.tipoCorreccion = tipoCorreccion; }

    public LocalTime getHoraAnterior() { return horaAnterior; }

    public void setHoraAnterior(LocalTime horaAnterior) { this.horaAnterior = horaAnterior; }

    public LocalTime getHoraCorregida() { return horaCorregida; }

    public void setHoraCorregida(LocalTime horaCorregida) { this.horaCorregida = horaCorregida; }

    public String getMotivo() { return motivo; }

    public void setMotivo(String motivo) { this.motivo = motivo; }

    public Integer getCorregidaPor() { return corregidaPor; }

    public void setCorregidaPor(Integer corregidaPor) { this.corregidaPor = corregidaPor; }

    public Integer getAprobadaPor() { return aprobadaPor; }

    public void setAprobadaPor(Integer aprobadaPor) { this.aprobadaPor = aprobadaPor; }

    public String getEstado() { return estado; }

    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCorreccion() { return fechaCorreccion; }
}
