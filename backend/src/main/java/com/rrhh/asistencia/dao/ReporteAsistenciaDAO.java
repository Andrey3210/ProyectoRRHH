package com.rrhh.asistencia.dao;

import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.ReporteAsistencia;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class ReporteAsistenciaDAO {

    @PersistenceContext
    private EntityManager em;

    public ReporteAsistencia guardar(ReporteAsistencia reporte) {
        if (reporte.getId() == null) {
            em.persist(reporte);
            return reporte;
        } else {
            return em.merge(reporte);
        }
    }

    public List<ReporteAsistencia> buscarPorEmpleadoYPeriodo(EmpleadoAsis empleadoAsis, LocalDate inicio, LocalDate fin) {
        TypedQuery<ReporteAsistencia> query = em.createQuery(
                "SELECT r FROM ReporteAsistencia r " +
                        "WHERE r.empleado = :empleado " +
                        "AND r.periodoInicio = :inicio " +
                        "AND r.periodoFin = :fin",
                ReporteAsistencia.class
        );
        query.setParameter("empleado", empleadoAsis);
        query.setParameter("inicio", inicio);
        query.setParameter("fin", fin);
        return query.getResultList();
    }
}
