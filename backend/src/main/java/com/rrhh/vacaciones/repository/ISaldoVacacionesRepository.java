package com.rrhh.vacaciones.repository;

import com.rrhh.vacaciones.model.SaldoVacaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ISaldoVacacionesRepository extends JpaRepository<SaldoVacaciones, Integer> {

    // Consulta para obtener el último saldo de cada empleado (año actual)
    @Query("SELECT s FROM SaldoVacaciones s JOIN FETCH s.empleado WHERE s.anio = YEAR(CURRENT_DATE)")
    List<SaldoVacaciones> findAllCurrentYear();
}