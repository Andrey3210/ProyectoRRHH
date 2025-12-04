package com.rrhh.gestionEmpleados.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EmpleadoResponse {

    private Integer idEmpleado;
    private Integer idUsuario;
    private Integer idPostulante;

    private String codigoEmpleado;

    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;

    private String documentoIdentidad;
    private String tipoDocumento;

    private LocalDate fechaNacimiento;

    private String genero;
    private String estadoCivil;
    private String nacionalidad;

    private String direccion;

    private String telefono;
    private String email;
    private String emailCorporativo;

    private LocalDate fechaIngreso;
    private LocalDate fechaCese;

    private String estado;
    private String tipoContrato;
    private String modalidadTrabajo;

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}