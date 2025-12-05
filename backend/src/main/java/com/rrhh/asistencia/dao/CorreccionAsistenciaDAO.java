package com.rrhh.asistencia.dao;

import com.rrhh.asistencia.domain.model.CorreccionAsistencia;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;   // ← ESTE IMPORT

@Repository
public class CorreccionAsistenciaDAO {

    @PersistenceContext
    private EntityManager em;

    public CorreccionAsistencia guardar(CorreccionAsistencia c) {
        if (c.getIdCorreccion() == null) {
            em.persist(c);
            return c;
        } else {
            return em.merge(c);
        }
    }
}
