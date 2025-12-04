package com.rrhh.asistencia.service.impl;

import com.rrhh.asistencia.dao.AsistenciaDAO;
import com.rrhh.asistencia.dao.ReporteAsistenciaDAO;
import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.ReporteAsistencia;
import com.rrhh.asistencia.service.IReporteAsistenciaService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ReporteAsistenciaServiceImpl implements IReporteAsistenciaService {

    private final ReporteAsistenciaDAO reporteDAO;
    private final AsistenciaDAO asistenciaDAO;
    private final DirectorReporteAsistencia director;

    @PersistenceContext
    private EntityManager em;

    public ReporteAsistenciaServiceImpl(
            ReporteAsistenciaDAO reporteDAO,
            AsistenciaDAO asistenciaDAO
    ) {
        this.reporteDAO = reporteDAO;
        this.asistenciaDAO = asistenciaDAO;

        // inyectamos el builder básico al director
        this.director = new DirectorReporteAsistencia();
        this.director.setBuilder(new ReporteBasicoBuilder(asistenciaDAO));
    }

    @Override
    public ReporteAsistencia generarReporteEmpleadoBasico(
            Integer idEmpleado,
            LocalDate inicio,
            LocalDate fin
    ) {
        EmpleadoAsis empleadoAsis = em.find(EmpleadoAsis.class, idEmpleado);
        if (empleadoAsis == null) {
            throw new IllegalArgumentException("Empleado no encontrado: " + idEmpleado);
        }

        ReporteAsistencia reporte =
                director.construirReporteEmpleadoBasico(empleadoAsis, inicio, fin);

        return reporteDAO.guardar(reporte);
    }

    @Override
    public List<ReporteAsistencia> generarReporteResumenPorEmpleado(
            LocalDate inicio,
            LocalDate fin,
            String area,
            Integer idEmpleadoOpcional
    ) {
        List<EmpleadoAsis> empleadoAses = obtenerEmpleadosFiltrados(area, idEmpleadoOpcional);

        List<ReporteAsistencia> reportes = new ArrayList<>();
        for (EmpleadoAsis e : empleadoAses) {
            ReporteAsistencia r =
                    director.construirReporteEmpleadoBasico(e, inicio, fin);
            reportes.add(r);
        }
        // si quieres persistir todos, podrías guardar cada uno:
        // reportes.replaceAll(reporteDAO::guardar);
        return reportes;
    }

    private List<EmpleadoAsis> obtenerEmpleadosFiltrados(String area, Integer idEmpleadoOpcional) {
        String jpql = "SELECT e FROM EmpleadoAsis e WHERE e.estado = 'ACTIVO'";
        if (area != null && !"Todos".equalsIgnoreCase(area)) {
            jpql += " AND e.id IN (" +
                    "SELECT ep.empleado.id FROM EmpleadoHorario ep " +
                    "JOIN ep.horario h WHERE h.departamento = :area" +
                    ")";
        }
        if (idEmpleadoOpcional != null) {
            jpql += " AND e.id = :idEmp";
        }

        var query = em.createQuery(jpql, EmpleadoAsis.class);
        if (area != null && !"Todos".equalsIgnoreCase(area)) {
            query.setParameter("area", area);
        }
        if (idEmpleadoOpcional != null) {
            query.setParameter("idEmp", idEmpleadoOpcional);
        }
        return query.getResultList();
    }
}
