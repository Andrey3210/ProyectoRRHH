package com.rrhh.gestionEmpleados.model;

import lombok.Data;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "horarios")
public class GesHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario")
    private Integer idHorario;

    @Column(name = "nombre_horario")
    private String nombreHorario;

    @Column(name = "departamento")
    private String departamento;

    @Column(name = "hora_entrada")
    private LocalTime horaEntrada;

    @Column(name = "hora_salida")
    private LocalTime horaSalida;

    @Column(name = "dias_semana")
    private String diasSemana;

    @Column(name = "tolerancia_entrada")
    private Integer toleranciaEntrada;

    @Column(name = "horas_jornada", precision = 4, scale = 2)
    private BigDecimal horasJornada;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
}
