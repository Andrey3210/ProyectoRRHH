package com.rrhh.incentivos.repository;

import com.rrhh.shared.domain.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {

    
    long countByEstado(String estado);


    Optional<Empleado> findByDni(String dni);

    Optional<Empleado> findByCodigoEmpleado(String codigoEmpleado);

    Optional<Empleado> findByEmailCorporativo(String emailCorporativo);

    Optional<Empleado> findByUsuarioIdUsuario(Integer idUsuario);
}