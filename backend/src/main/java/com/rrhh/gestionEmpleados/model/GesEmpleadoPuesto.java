package com.rrhh.gestionEmpleados.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "empleados_puestos")
public class GesEmpleadoPuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado_puesto")
    private Integer idEmpleadoPuesto;

    @ManyToOne
    @JoinColumn(name = "id_empleado", nullable = false)
    private GesEmpleado empleado;

    @ManyToOne
    @JoinColumn(name = "id_puesto", nullable = false)
    private GesPuesto puesto;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "salario", precision = 10, scale = 2)
    private BigDecimal salario;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "motivo_cambio", columnDefinition = "text")
    private String motivoCambio;

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;
}