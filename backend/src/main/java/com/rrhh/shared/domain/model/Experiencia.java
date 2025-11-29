package com.rrhh.shared.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "experiencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Experiencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_experiencia")
    private Integer idExperiencia;
    
    @Column(name = "id_postulante")
    private Integer idPostulante;
    
    @Column(name = "empresa", length = 200)
    private String empresa;
    
    @Column(name = "puesto", length = 200)
    private String puesto;
    
    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;
    
    @Column(name = "fecha_fin")
    private LocalDate fechaFin;
    
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    
    // Relaciones
    @ManyToOne
    @JoinColumn(name = "id_postulante", insertable = false, updatable = false)
    private Postulante postulante;
    
    public String describirExperiencia() {
        return String.format("%s en %s (%s - %s)", 
            puesto, empresa, fechaInicio, fechaFin != null ? fechaFin : "Actual");
    }
}

