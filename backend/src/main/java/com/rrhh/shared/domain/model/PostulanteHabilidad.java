package com.rrhh.shared.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "postulantes_habilidades")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"postulante", "habilidad"})
@NoArgsConstructor
@AllArgsConstructor
public class PostulanteHabilidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_postulante_habilidad")
    @EqualsAndHashCode.Include
    private Integer idPostulanteHabilidad;
    
    @Column(name = "id_postulante")
    private Integer idPostulante;
    
    @Column(name = "id_habilidad")
    private Integer idHabilidad;
    
    @Column(name = "nivel_dominio", length = 50)
    private String nivelDominio;
    
    @Column(name = "anos_experiencia")
    private Integer anosExperiencia;
    
    @Column(name = "fecha_registro")
    private LocalDate fechaRegistro;
    
    // Relaciones
    @ManyToOne
    @JoinColumn(name = "id_postulante", insertable = false, updatable = false)
    private Postulante postulante;
    
    @ManyToOne
    @JoinColumn(name = "id_habilidad", insertable = false, updatable = false)
    private Habilidad habilidad;
}

