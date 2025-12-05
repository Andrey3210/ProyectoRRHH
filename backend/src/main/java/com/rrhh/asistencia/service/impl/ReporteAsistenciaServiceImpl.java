package com.rrhh.asistencia.service.impl;

import com.rrhh.asistencia.dao.AsistenciaDAO;
import com.rrhh.asistencia.dao.ReporteAsistenciaDAO;
import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.ReporteAsistencia;
import com.rrhh.asistencia.dto.ReporteAsistenciaRequest;
import com.rrhh.asistencia.dto.ReporteAsistenciaResponse;
import com.rrhh.asistencia.service.IReporteAsistenciaService;
import com.rrhh.asistencia.service.impl.builder.DirectorReporteAsistencia;
import com.rrhh.asistencia.service.impl.builder.ReporteBasicoBuilder;
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
    private final ReporteBasicoBuilder reporteBasicoBuilder;

    @PersistenceContext
    private EntityManager em;

    public ReporteAsistenciaServiceImpl(
            ReporteAsistenciaDAO reporteDAO,
            AsistenciaDAO asistenciaDAO,
            DirectorReporteAsistencia director,
            ReporteBasicoBuilder reporteBasicoBuilder
    ) {
        this.reporteDAO = reporteDAO;
        this.asistenciaDAO = asistenciaDAO;
        this.director = director;
        this.reporteBasicoBuilder = reporteBasicoBuilder;
    }

    // ======= Métodos antiguos (si todavía los usas) =======

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

        // Aquí podrías seguir usando tu lógica vieja,
        // o adaptarla al nuevo builder según lo necesites.
        throw new UnsupportedOperationException("Usar el nuevo método generarReporte(ReporteAsistenciaRequest)");
    }

    @Override
    public List<ReporteAsistencia> generarReporteResumenPorEmpleado(
            LocalDate inicio,
            LocalDate fin,
            String area,
            Integer idEmpleadoOpcional
    ) {
        // Igual que arriba: puedes migrar o marcar como no soportado si ya no lo usarás.
        return new ArrayList<>();
    }

    // ======= Nuevo método para la pantalla de reportes =======

    @Override
    public ReporteAsistenciaResponse generarReporte(ReporteAsistenciaRequest filtro) {
        director.construirReporte(reporteBasicoBuilder, filtro);
        return reporteBasicoBuilder.build();
    }

    // método privado obtenerEmpleadosFiltrados se puede mantener solo si aún lo necesitas
}
