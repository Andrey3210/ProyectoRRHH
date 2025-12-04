package com.rrhh.gestionEmpleados.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EmpleadoRequest {

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
}