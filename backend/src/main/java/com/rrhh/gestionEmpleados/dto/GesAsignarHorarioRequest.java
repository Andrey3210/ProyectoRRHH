package com.rrhh.gestionEmpleados.dto;

import lombok.Data;

@Data
public class GesAsignarHorarioRequest {
    private Integer idEmpleado;
    private Integer idHorario;
}