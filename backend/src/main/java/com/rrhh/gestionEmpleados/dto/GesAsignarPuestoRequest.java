package com.rrhh.gestionEmpleados.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class GesAsignarPuestoRequest {
    private Integer idEmpleado;
    private Integer idPuesto;
    private LocalDate fechaInicio; // opcional, si no se envía se usa la fecha actual
    private BigDecimal salario;    // opcional
    private String motivoCambio;   // opcional
}