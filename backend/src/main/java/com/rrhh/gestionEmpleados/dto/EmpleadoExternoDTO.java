package com.rrhh.gestionEmpleados.dto;

import lombok.Data;

@Data
public class EmpleadoExternoDTO {

    private Integer idEmpleado;
    private String codigoEmpleado;
    private String nombreCompleto;
    private String documentoIdentidad;
    private String tipoDocumento;
    private String email;
    private String telefono;
    private String estado;
}