package com.rrhh.vacaciones.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Immutable;

@Data
@Entity
@Immutable // Indica que es una vista, no se puede editar
@Table(name = "v_empleados_activos") // Mapeamos directamente a la vista de tu script SQL
public class EmpleadoResumen {

    @Id
    @Column(name = "id_empleado")
    private Integer idEmpleado;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Column(name = "nombre_puesto") // Esto será el "Cargo"
    private String puesto;

    @Column(name = "departamento") // Esto será el "Area"
    private String area;

    // Agregamos nombres y apellidos por separado si los necesitas para el buscador
    @Column(name = "nombres")
    private String nombres;

    @Column(name = "apellido_paterno")
    private String apellidos;
}