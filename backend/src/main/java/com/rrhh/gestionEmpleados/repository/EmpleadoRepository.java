package com.rrhh.gestionEmpleados.repository;

import com.rrhh.gestionEmpleados.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
}