package com.rrhh.gestionEmpleados.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class GesEmpleadoConPuestoDTO {

    // ---------- Datos del Empleado ----------
    private Integer idEmpleado;
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

    // ---------- Datos del Puesto Actual ----------
    private Integer idPuesto;
    private String nombrePuesto;
    private String departamento;
    private String area;
    private String nivelJerarquico;
    private BigDecimal salarioMinimo;
    private BigDecimal salarioMaximo;

    // ---------- Datos del EmpleadoPuesto ----------
    private LocalDate fechaInicioPuesto;
    private LocalDate fechaFinPuesto;
    private BigDecimal salarioAsignado;
}