// com/rrhh/asistencia/dao/ReporteAsistenciaDAO.java
package com.rrhh.asistencia.dao;

import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.ReporteAsistencia;
import com.rrhh.asistencia.dto.DetalleDiaDTO;
import com.rrhh.asistencia.dto.EmpleadoReporteDTO;
import com.rrhh.asistencia.dto.ReporteAsistenciaRequest;
import com.rrhh.asistencia.dto.ResumenAsistenciaDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
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

    public List<ReporteAsistencia> buscarPorEmpleadoYPeriodo(
            EmpleadoAsis empleadoAsis,
            LocalDate inicio,
            LocalDate fin
    ) {
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

    // ===== Nuevos métodos para el builder =====

    public ResumenAsistenciaDTO obtenerResumenAsistencia(ReporteAsistenciaRequest filtro) {
        LocalDate inicio = LocalDate.parse(filtro.getFechaInicio());
        LocalDate fin = LocalDate.parse(filtro.getFechaFin());

        String sql =
                "SELECT " +
                        "  COUNT(*) AS dias_trabajados, " +
                        "  SUM(CASE WHEN tipo_registro = 'FALTA' THEN 1 ELSE 0 END) AS faltas, " +
                        "  SUM(CASE WHEN tipo_registro = 'TARDANZA' THEN 1 ELSE 0 END) AS tardanzas, " +
                        "  SUM(minutos_extra) AS minutos_extra " +
                        "FROM registros_asistencia " +
                        "WHERE fecha BETWEEN :inicio AND :fin";

        var query = em.createNativeQuery(sql);
        query.setParameter("inicio", inicio);
        query.setParameter("fin", fin);

        Object[] row = (Object[]) query.getSingleResult();

        Number diasNum = (Number) row[0];
        Number faltasNum = (Number) row[1];
        Number tardanzasNum = (Number) row[2];
        Number minutosExtraNum = (Number) row[3];

        ResumenAsistenciaDTO dto = new ResumenAsistenciaDTO();
        dto.setDiasTrabajados(diasNum != null ? diasNum.intValue() : 0);
        dto.setFaltas(faltasNum != null ? faltasNum.intValue() : 0);
        dto.setTardanzas(tardanzasNum != null ? tardanzasNum.intValue() : 0);

        int minutosExtra = minutosExtraNum != null ? minutosExtraNum.intValue() : 0;
        dto.setHorasExtra(minutosExtra / 60.0);

        return dto;
    }

    @SuppressWarnings("unchecked")
    public List<EmpleadoReporteDTO> obtenerDetalleAsistencia(ReporteAsistenciaRequest filtro) {
        LocalDate inicio = LocalDate.parse(filtro.getFechaInicio());
        LocalDate fin = LocalDate.parse(filtro.getFechaFin());

        String sql =
                "SELECT " +
                        "  r.id_empleado, " +
                        "  CONCAT(e.nombres, ' ', e.apellido_paterno, ' ', COALESCE(e.apellido_materno, '')) AS nombre_empleado, " +
                        "  COALESCE(p.area, p.departamento, 'Sin área') AS area_nombre, " +
                        "  COUNT(*) AS dias_trabajados, " +
                        "  SUM(CASE WHEN r.tipo_registro = 'FALTA' THEN 1 ELSE 0 END) AS faltas, " +
                        "  SUM(CASE WHEN r.tipo_registro = 'TARDANZA' THEN 1 ELSE 0 END) AS tardanzas, " +
                        "  SUM(r.minutos_extra) AS minutos_extra " +
                        "FROM registros_asistencia r " +
                        "JOIN empleados e ON e.id_empleado = r.id_empleado " +
                        "LEFT JOIN empleados_puestos ep ON ep.id_empleado = e.id_empleado AND ep.activo = TRUE " +
                        "LEFT JOIN puestos p ON p.id_puesto = ep.id_puesto " +
                        "WHERE r.fecha BETWEEN :inicio AND :fin " +
                        "GROUP BY r.id_empleado, nombre_empleado, area_nombre";

        var query = em.createNativeQuery(sql);
        query.setParameter("inicio", inicio);
        query.setParameter("fin", fin);

        List<Object[]> rows = query.getResultList();
        List<EmpleadoReporteDTO> resultado = new ArrayList<>();

        for (Object[] row : rows) {
            Long idEmpleado = ((Number) row[0]).longValue();
            String nombreEmpleado = (String) row[1];
            String areaNombre = (String) row[2];

            int diasTrabajados = ((Number) row[3]).intValue();
            int faltas = ((Number) row[4]).intValue();
            int tardanzas = ((Number) row[5]).intValue();

            Number minutosExtraNum = (Number) row[6];
            int minutosExtra = minutosExtraNum != null ? minutosExtraNum.intValue() : 0;
            double horasExtra = minutosExtra / 60.0;

            EmpleadoReporteDTO dto = new EmpleadoReporteDTO();
            dto.setEmpleadoId(idEmpleado);
            dto.setEmpleadoNombre(nombreEmpleado.trim());
            dto.setAreaNombre(areaNombre);
            dto.setDiasTrabajados(diasTrabajados);
            dto.setFaltas(faltas);
            dto.setTardanzas(tardanzas);
            dto.setHorasExtra(horasExtra);

            resultado.add(dto);
        }

        return resultado;
    }


    public List<DetalleDiaDTO> obtenerDetallePorDia(ReporteAsistenciaRequest filtro) {
        LocalDate inicio = LocalDate.parse(filtro.getFechaInicio());
        LocalDate fin = LocalDate.parse(filtro.getFechaFin());

        String sql =
                "SELECT " +
                        "  r.fecha, " +
                        "  r.id_empleado, " +
                        "  CONCAT(e.nombres, ' ', e.apellido_paterno, ' ', COALESCE(e.apellido_materno, '')) AS nombre_empleado, " +
                        "  COALESCE(p.area, p.departamento, 'Sin área') AS area_nombre, " +
                        "  r.tipo_registro, " +
                        "  r.hora_entrada, " +
                        "  r.hora_salida " +
                        "FROM registros_asistencia r " +
                        "JOIN empleados e ON e.id_empleado = r.id_empleado " +
                        "LEFT JOIN empleados_puestos ep ON ep.id_empleado = e.id_empleado AND ep.activo = TRUE " +
                        "LEFT JOIN puestos p ON p.id_puesto = ep.id_puesto " +
                        "WHERE r.fecha BETWEEN :inicio AND :fin " +
                        "ORDER BY r.fecha, nombre_empleado";

        var query = em.createNativeQuery(sql);
        query.setParameter("inicio", inicio);
        query.setParameter("fin", fin);

        List<Object[]> rows = query.getResultList();
        List<DetalleDiaDTO> resultado = new ArrayList<>();

        for (Object[] row : rows) {
            DetalleDiaDTO dto = new DetalleDiaDTO();
            dto.setFecha(row[0].toString());
            dto.setEmpleadoId(((Number) row[1]).longValue());
            dto.setEmpleadoNombre((String) row[2]);
            dto.setAreaNombre((String) row[3]);
            dto.setEstado((String) row[4]);
            dto.setHoraEntrada(row[5] != null ? row[5].toString() : null);
            dto.setHoraSalida(row[6] != null ? row[6].toString() : null);
            dto.setHorasTrabajadas(0); // de momento
            resultado.add(dto);
        }

        return resultado;
    }

}
