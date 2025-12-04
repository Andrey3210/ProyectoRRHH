package com.rrhh.incentivos.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "metas")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "categoria_meta", discriminatorType = DiscriminatorType.STRING)
public abstract class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_meta")
    private Integer idMeta;

    @ManyToOne
    @JoinColumn(name = "id_empleado")
    private EmpleadoInc empleado;

    @Column(name = "id_departamento") 
    private String idDepartamento;

    @Column(name = "nombre_meta")
    private String nombreMeta;

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
    
    @Column(name = "tipo_meta")
    private String tipoMeta; 

    public abstract boolean verificarCumplimiento();
}