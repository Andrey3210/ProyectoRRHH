package com.rrhh.shared.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rrhh.shared.domain.enums.EstadoPostulante;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "postulantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Postulante {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_postulante")
    private Integer idPostulante;
    
    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;
    
    @Column(name = "apellido_paterno", nullable = false, length = 100)
    private String apellidoPaterno;
    
    @Column(name = "apellido_materno", length = 100)
    private String apellidoMaterno;
    
    @Column(name = "telefono", length = 20)
    private String telefono;
    
    @Column(name = "direccion", length = 255)
    private String direccion;
    
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    @Column(name = "genero", length = 20)
    private String genero;
    
    @Column(name = "estado_civil", length = 50)
    private String estadoCivil;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_postulacion")
    private EstadoPostulante estadoPostulacion;
    
    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;
    
    @Column(name = "fecha_ultima_actualizacion")
    private LocalDateTime fechaUltimaActualizacion;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        fechaUltimaActualizacion = LocalDateTime.now();
        if (estadoPostulacion == null) {
            estadoPostulacion = EstadoPostulante.ACTIVO;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaUltimaActualizacion = LocalDateTime.now();
    }
    
    // Relaciones
    @OneToMany(mappedBy = "postulante", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PostulanteHabilidad> habilidades = new ArrayList<>();
    
    @OneToMany(mappedBy = "postulante", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Experiencia> experiencias = new ArrayList<>();
    
    @OneToOne(mappedBy = "postulante", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private CV cv;
    
    @OneToMany(mappedBy = "postulante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PostulanteProceso> procesos = new ArrayList<>();
    
    // Métodos de negocio
    public String getNombreCompleto() {
        return nombres + " " + apellidoPaterno + 
               (apellidoMaterno != null ? " " + apellidoMaterno : "");
    }
}

