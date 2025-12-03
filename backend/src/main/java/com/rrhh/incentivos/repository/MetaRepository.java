package com.rrhh.incentivos.repository;

import com.rrhh.shared.domain.model.Meta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Integer> {

    List<Meta> findByEmpleadoIdEmpleadoAndPeriodo(Integer idEmpleado, String periodo);
    long countByPeriodo(String periodo);
    @Query("SELECT COUNT(m) FROM Meta m WHERE m.periodo = :periodo AND m.valorActual >= m.valorObjetivo")
    long countMetasCumplidas(@Param("periodo") String periodo);


}