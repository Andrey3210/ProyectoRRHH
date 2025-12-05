package com.rrhh.gestionEmpleados.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Entity
@Table(name = "empleados")
public class GesEmpleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Integer idEmpleado;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "id_postulante")
    private Integer idPostulante;

    @Column(name = "codigo_empleado", length = 50)
    private String codigoEmpleado;

    @Column(name = "nombres", length = 100)
    private String nombres;

    @Column(name = "apellido_paterno", length = 100)
    private String apellidoPaterno;

    @Column(name = "apellido_materno", length = 100)
    private String apellidoMaterno;

    @Column(name = "documento_identidad", length = 20)
    private String documentoIdentidad;

    @Column(name = "tipo_documento", length = 20)
    private String tipoDocumento;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "genero", length = 20)
    private String genero;

    @Column(name = "estado_civil", length = 50)
    private String estadoCivil;

    @Column(name = "nacionalidad", length = 50)
    private String nacionalidad;

    @Column(name = "direccion", columnDefinition = "text")
    private String direccion;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "email_corporativo", length = 100)
    private String emailCorporativo;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    @Column(name = "fecha_cese")
    private LocalDate fechaCese;

    @Column(name = "estado", length = 20)
    private String estado;

    @Column(name = "tipo_contrato", length = 50)
    private String tipoContrato;

    @Column(name = "modalidad_trabajo", length = 50)
    private String modalidadTrabajo;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
}