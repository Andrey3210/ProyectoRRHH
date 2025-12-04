package com.rrhh.gestionEmpleados.repository;

import com.rrhh.gestionEmpleados.model.GesEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GesEmpleadoRepository extends JpaRepository<GesEmpleado, Integer> {
}