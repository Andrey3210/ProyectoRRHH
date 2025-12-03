package com.rrhh.shared.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "reglas_incentivos")
public class ReglaIncentivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_regla")
    private Integer idRegla;

    @Column(name = "nombre_regla")
    private String nombreRegla;

    @Column(name = "condicion")
    private String condicion; // Lógica evaluable o descripción

    @Column(name = "valor_calculo")
    private BigDecimal valorCalculo; // Porcentaje o monto fijo

    @Column(name = "tipo_valor")
    private String tipoValor; // PORCENTAJE, FIJO

    @Column(name = "activo")
    private Boolean activo;
    @Column(name = "categoria") // "VENTAS" o "ATENCION" (Para las pestañas)
    private String categoria;

    @Column(name = "periodo") // "Mensual", "Trimestral", "Anual"
    private String periodo;

    @Column(name = "descripcion_recompensa") // Para textos como "Viaje Cancún" o "Gift Card"
    private String descripcionRecompensa;
}