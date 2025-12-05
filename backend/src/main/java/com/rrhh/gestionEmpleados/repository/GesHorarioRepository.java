package com.rrhh.gestionEmpleados.repository;

import com.rrhh.gestionEmpleados.model.GesHorario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GesHorarioRepository extends JpaRepository<GesHorario, Integer> {
}