package com.rrhh.gestionEmpleados.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "puestos")
public class GesPuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_puesto")
    private Integer idPuesto;

    @Column(name = "nombre_puesto", length = 120)
    private String nombrePuesto;

    @Column(name = "departamento", length = 120)
    private String departamento;

    @Column(name = "area", length = 120)
    private String area;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "nivel_jerarquico", length = 50)
    private String nivelJerarquico;

    @Column(name = "salario_minimo", precision = 10, scale = 2)
    private BigDecimal salarioMinimo;

    @Column(name = "salario_maximo", precision = 10, scale = 2)
    private BigDecimal salarioMaximo;

    @Column(name = "activo")
    private Integer activo;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
}