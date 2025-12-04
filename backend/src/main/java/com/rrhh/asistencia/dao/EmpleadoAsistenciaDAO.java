package com.rrhh.asistencia.dao;

import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class EmpleadoAsistenciaDAO {

    @PersistenceContext
    private EntityManager em;

    public Optional<EmpleadoAsis> buscarPorIdUsuario(Integer idUsuario) {
        TypedQuery<EmpleadoAsis> q = em.createQuery(
                "SELECT e FROM EmpleadoAsis e WHERE e.usuario.idUsuario = :idUsuario",
                EmpleadoAsis.class
        );
        q.setParameter("idUsuario", idUsuario);
        return q.getResultList().stream().findFirst();
    }
}
