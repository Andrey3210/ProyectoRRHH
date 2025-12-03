package com.rrhh.gestionEmpleados.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "empleados")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_empleado;

    private Integer id_usuario;
    private Integer id_postulante;

    private String codigo_empleado;
    private String nombres;
    private String apellido_paterno;
    private String apellido_materno;

    private String documento_identidad;
    private String tipo_documento;

    private LocalDate fecha_nacimiento;

    private String genero;
    private String estado_civil;
    private String nacionalidad;

    @Column(columnDefinition = "TEXT")
    private String direccion;

    private String telefono;
    private String email;
    private String email_corporativo;

    private LocalDate fecha_ingreso;
    private LocalDate fecha_cese;

    @Enumerated(EnumType.STRING)
    private EstadoEmpleado estado;

    private String tipo_contrato;
    private String modalidad_trabajo;

    private LocalDateTime fecha_creacion;
    private LocalDateTime fecha_actualizacion;

    public enum EstadoEmpleado {
        ACTIVO,
        INACTIVO,
        LICENCIA,
        SUSPENDIDO
    }
}