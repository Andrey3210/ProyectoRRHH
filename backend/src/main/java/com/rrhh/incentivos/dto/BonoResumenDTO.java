package com.rrhh.incentivos.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BonoResumenDTO {
    private Integer idBono;
    private String concepto;       // Viene de Regla.nombreRegla
    private String fecha;          // fechaCalculo formateada
    private String estado;         // PENDIENTE, APROBADO
    private BigDecimal monto;
    private String tipo;           // DINERO, ESPECIE (Calculado)
    private String evidenciaNombre; // Para mostrar en la tabla "Factura F001..."
}