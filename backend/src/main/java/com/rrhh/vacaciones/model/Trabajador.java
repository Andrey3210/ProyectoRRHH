package com.rrhh.vacaciones.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "empleados") // Mapea a la tabla existente
public class Trabajador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Integer idEmpleado;

    @Column(name = "nombres")
    private String nombres;

    @Column(name = "apellido_paterno")
    private String apellidos;

    @Column(name = "email")
    private String email;

    // Importante: @JsonIgnore para evitar el bucle infinito y error de Lazy Loading
    @JsonIgnore
    @OneToMany(mappedBy = "empleado", fetch = FetchType.LAZY)
    private List<Solicitud> solicitudes;

    public List<Solicitud> verSolicitudes() {
        return this.solicitudes != null ? this.solicitudes : new ArrayList<>();
    }
}