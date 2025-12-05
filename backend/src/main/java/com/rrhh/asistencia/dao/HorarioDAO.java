package com.rrhh.asistencia.dao;

import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.EmpleadoHorario;
import com.rrhh.asistencia.domain.model.Horario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class HorarioDAO {

    @PersistenceContext
    private EntityManager em;

    public Optional<EmpleadoHorario> obtenerHorarioActivo(EmpleadoAsis empleadoAsis, LocalDate fecha) {
        TypedQuery<EmpleadoHorario> query = em.createQuery(
                "SELECT eh FROM EmpleadoHorario eh " +
                        "JOIN FETCH eh.horario h " +
                        "WHERE eh.empleadoAsis = :empleado " +  // ← aquí el cambio
                        "AND (eh.fechaInicio IS NULL OR eh.fechaInicio <= :fecha) " +
                        "AND (eh.fechaFin IS NULL OR eh.fechaFin >= :fecha) " +
                        "AND eh.activo = TRUE",
                EmpleadoHorario.class
        );
        query.setParameter("empleado", empleadoAsis);
        query.setParameter("fecha", fecha);
        List<EmpleadoHorario> resultados = query.getResultList();
        return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
    }

    public Horario guardar(Horario horario) {
        if (horario.getId() == null) {
            em.persist(horario);
            return horario;
        } else {
            return em.merge(horario);
        }
    }
}
