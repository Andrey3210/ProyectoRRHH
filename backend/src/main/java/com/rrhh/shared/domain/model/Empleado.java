package com.rrhh.shared.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "empleados")
public class Empleado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Integer idEmpleado;

    @Column(name = "codigo_empleado", unique = true)
    private String codigoEmpleado;

    @Column(name = "nombres")
    private String nombres;

    @Column(name = "apellido_paterno")
    private String apellidoPaterno;
    
    @Column(name = "apellido_materno")
    private String apellidoMaterno;

    @Column(name = "documento_identidad", unique = true)
    private String dni;

    @Column(name = "email_corporativo")
    private String emailCorporativo;
    
    @Column(name = "estado")
    private String estado; // ACTIVO, INACTIVO

    // Relación con Usuario (Login)
    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    // Helper para nombre completo
    public String getNombreCompleto() {
        return nombres + " " + apellidoPaterno + (apellidoMaterno != null ? " " + apellidoMaterno : "");
    }
}