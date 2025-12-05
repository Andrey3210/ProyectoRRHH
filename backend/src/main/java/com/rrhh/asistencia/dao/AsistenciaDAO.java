package com.rrhh.asistencia.dao;

import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.RegistroAsistencia;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class AsistenciaDAO {

    @PersistenceContext
    private EntityManager em;

    public RegistroAsistencia guardar(RegistroAsistencia registro) {
        if (registro.getId() == null) {
            em.persist(registro);
            return registro;
        } else {
            return em.merge(registro);
        }
    }

    public Optional<RegistroAsistencia> buscarPorId(Integer id) {
        return Optional.ofNullable(em.find(RegistroAsistencia.class, id));
    }

    public Optional<RegistroAsistencia> buscarPorEmpleadoYFecha(EmpleadoAsis empleadoAsis, LocalDate fecha) {
        TypedQuery<RegistroAsistencia> query = em.createQuery(
                "SELECT r FROM RegistroAsistencia r " +
                        "WHERE r.empleadoAsis = :empleado AND r.fecha = :fecha",
                RegistroAsistencia.class
        );
        query.setParameter("empleado", empleadoAsis);
        query.setParameter("fecha", fecha);
        List<RegistroAsistencia> resultados = query.getResultList();
        return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
    }

    public List<RegistroAsistencia> listarPorFecha(LocalDate fecha) {
        TypedQuery<RegistroAsistencia> query = em.createQuery(
                "SELECT r FROM RegistroAsistencia r " +
                        "JOIN FETCH r.empleadoAsis e " +
                        "WHERE r.fecha = :fecha " +
                        "ORDER BY e.apellidoPaterno, e.nombres",
                RegistroAsistencia.class
        );
        query.setParameter("fecha", fecha);
        return query.getResultList();
    }

    public List<RegistroAsistencia> listarPorEmpleadoYRango(EmpleadoAsis empleadoAsis, LocalDate desde, LocalDate hasta) {
        TypedQuery<RegistroAsistencia> query = em.createQuery(
                "SELECT r FROM RegistroAsistencia r " +
                        "WHERE r.empleadoAsis = :empleado " +
                        "AND r.fecha BETWEEN :desde AND :hasta " +
                        "ORDER BY r.fecha",
                RegistroAsistencia.class
        );
        query.setParameter("empleado", empleadoAsis);
        query.setParameter("desde", desde);
        query.setParameter("hasta", hasta);
        return query.getResultList();
    }
}
