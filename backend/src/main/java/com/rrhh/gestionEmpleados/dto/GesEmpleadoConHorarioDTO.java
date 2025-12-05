package com.rrhh.gestionEmpleados.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class GesEmpleadoConHorarioDTO {

    // ----- Datos del Empleado -----
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

    // ----- Datos del Horario Actual -----
    private Integer idHorario;
    private String nombreHorario;
    private String departamentoHorario;
    private LocalTime horaEntrada;
    private LocalTime horaSalida;
    private String diasSemana;
    private Integer toleranciaEntrada;
    private BigDecimal horasJornada;
}