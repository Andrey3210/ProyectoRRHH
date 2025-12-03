package com.rrhh.vacaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReporteSaldoDTO {
    private Integer idEmpleado;
    private String nombreCompleto;
    private String area; // Asumimos que viene de la entidad Empleado o se busca
    private Integer diasTotales;
    private Integer diasGozados;
    private Integer diasPendientes;
}