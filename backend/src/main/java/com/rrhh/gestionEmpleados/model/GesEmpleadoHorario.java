package com.rrhh.gestionEmpleados.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "empleados_horarios")
public class GesEmpleadoHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado_horario")
    private Integer idEmpleadoHorario;

    @ManyToOne
    @JoinColumn(name = "id_empleado")
    private GesEmpleado empleado;

    @ManyToOne
    @JoinColumn(name = "id_horario")
    private GesHorario horario;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;
}