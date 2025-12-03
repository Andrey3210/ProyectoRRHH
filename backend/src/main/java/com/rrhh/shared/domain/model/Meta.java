package com.rrhh.shared.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "metas")
public class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_meta")
    private Integer idMeta;

    @ManyToOne
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;

    @Column(name = "nombre_meta")
    private String nombreMeta;

    @Column(name = "tipo_meta") // VENTA, CALIDAD, ETC.
    private String tipoMeta;

    @Column(name = "valor_objetivo")
    private BigDecimal valorObjetivo;

    @Column(name = "valor_actual")
    private BigDecimal valorActual;

    @Column(name = "periodo")
    private String periodo;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;
}