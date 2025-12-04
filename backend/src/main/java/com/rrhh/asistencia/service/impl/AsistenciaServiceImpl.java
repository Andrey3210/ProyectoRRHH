package com.rrhh.asistencia.service.impl;

import com.rrhh.asistencia.dao.AsistenciaDAO;
import com.rrhh.asistencia.dao.HorarioDAO;
import com.rrhh.asistencia.domain.enums.EstadoRegistro;
import com.rrhh.asistencia.domain.enums.TipoRegistro;
import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.EmpleadoHorario;
import com.rrhh.asistencia.domain.model.RegistroAsistencia;
import com.rrhh.asistencia.dto.AsistenciaHoyDTO;
import com.rrhh.asistencia.service.IAsistenciaService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class AsistenciaServiceImpl implements IAsistenciaService {

    private final AsistenciaDAO asistenciaDAO;
    private final HorarioDAO horarioDAO;

    @PersistenceContext
    private EntityManager em;

    public AsistenciaServiceImpl(AsistenciaDAO asistenciaDAO, HorarioDAO horarioDAO) {
        this.asistenciaDAO = asistenciaDAO;
        this.horarioDAO = horarioDAO;
    }

    @Override
    public RegistroAsistencia marcarAsistencia(Integer idEmpleado) {
        EmpleadoAsis empleadoAsis = em.find(EmpleadoAsis.class, idEmpleado);
        if (empleadoAsis == null) {
            throw new IllegalArgumentException("Empleado no encontrado: " + idEmpleado);
        }

        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        RegistroAsistencia registro = asistenciaDAO
                .buscarPorEmpleadoYFecha(empleadoAsis, hoy)
                .orElseGet(() -> {
                    RegistroAsistencia r = new RegistroAsistencia();
                    r.setEmpleado(empleadoAsis);
                    r.setFecha(hoy);
                    return r;
                });

        if (registro.getHoraEntrada() == null) {
            registro.setHoraEntrada(ahora);
            aplicarEstadoEntrada(registro, empleadoAsis, hoy, ahora);
        } else if (registro.getHoraSalida() == null) {
            registro.setHoraSalida(ahora);
            calcularHorasTrabajadas(registro);
        } else {
            // ya tiene entrada y salida, opcionalmente podrías lanzar excepción
        }

        return asistenciaDAO.guardar(registro);
    }

    @Override
    public RegistroAsistencia calcularEstadoActual(Integer idEmpleado) {
        EmpleadoAsis empleadoAsis = em.find(EmpleadoAsis.class, idEmpleado);
        if (empleadoAsis == null) {
            throw new IllegalArgumentException("Empleado no encontrado: " + idEmpleado);
        }

        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        RegistroAsistencia preview = new RegistroAsistencia();
        preview.setEmpleado(empleadoAsis);
        preview.setFecha(hoy);
        preview.setHoraEntrada(ahora); // hora actual

        // Reutilizar lógica de aplicarEstadoEntrada pero sin guardar
        aplicarEstadoEntrada(preview, empleadoAsis, hoy, ahora);

        return preview;
    }


    private void aplicarEstadoEntrada(
            RegistroAsistencia registro,
            EmpleadoAsis empleadoAsis,
            LocalDate fecha,
            LocalTime horaEntradaReal
    ) {
        EmpleadoHorario empleadoHorario = horarioDAO
                .obtenerHorarioActivo(empleadoAsis, fecha)
                .orElse(null);

        // ← CAMBIO: Todos los nuevos registros van PENDIENTE
        if (empleadoHorario == null) {
            registro.setEstado(EstadoRegistro.PENDIENTE);
            return;
        }

        LocalTime horaEsperada = empleadoHorario.getHorario().getHoraEntrada();
        Integer tolerancia = empleadoHorario.getHorario().getToleranciaEntrada();
        if (tolerancia == null) tolerancia = 0;

        LocalTime limiteTolerancia = horaEsperada.plusMinutes(tolerancia);

        // ← CAMBIO: setTipoRegistro() en lugar de setEstado()
        if (horaEntradaReal.isAfter(limiteTolerancia)) {
            registro.setTipoRegistro(TipoRegistro.TARDE);  // Tipo de registro: TARDANZA
            registro.setEstado(EstadoRegistro.PENDIENTE);     // Estado: recién creado
        } else {
            registro.setTipoRegistro(TipoRegistro.PUNTUAL);   // Tipo de registro: PUNTUAL
            registro.setEstado(EstadoRegistro.PENDIENTE);     // Estado: recién creado
        }
    }


    private void calcularHorasTrabajadas(RegistroAsistencia registro) {
        if (registro.getHoraEntrada() != null && registro.getHoraSalida() != null) {
            Duration d = Duration.between(registro.getHoraEntrada(), registro.getHoraSalida());
            double horas = d.toMinutes() / 60.0;

            // Usa "horas" aquí para lo que necesites, por ejemplo:
            System.out.println("Horas trabajadas calculadas: " + horas);

            // No se asigna a registro.setHorasTrabajadas(horas);
            // Puedes guardar o retornar este valor según el caso
        }
    }


    @Override
    public List<RegistroAsistencia> obtenerAsistenciaHoy() {
        LocalDate hoy = LocalDate.now();
        return asistenciaDAO.listarPorFecha(hoy);
    }

    @Override
    public List<RegistroAsistencia> obtenerAsistenciaEmpleado(
            Integer idEmpleado,
            LocalDate desde,
            LocalDate hasta
    ) {
        EmpleadoAsis empleadoAsis = em.find(EmpleadoAsis.class, idEmpleado);
        if (empleadoAsis == null) {
            throw new IllegalArgumentException("Empleado no encontrado: " + idEmpleado);
        }
        return asistenciaDAO.listarPorEmpleadoYRango(empleadoAsis, desde, hasta);
    }

    @Override
    public List<AsistenciaHoyDTO> obtenerAsistenciaHoyParaTimeline() {
        LocalDate hoy = LocalDate.now();
        List<RegistroAsistencia> registrosHoy = asistenciaDAO.listarPorFecha(hoy);

        return registrosHoy.stream()
                .map(reg -> {
                    EmpleadoAsis emp = reg.getEmpleado();

                    String nombreCompleto = String.format(
                            "%s %s %s",
                            emp.getNombres(),
                            emp.getApellidoPaterno(),
                            emp.getApellidoMaterno() == null ? "" : emp.getApellidoMaterno()
                    ).trim();

                    // Por ahora área null o algo simple; luego lo puedes sacar de puesto/horario
                    String area = null;

                    String tipo = reg.getTipoRegistro() != null
                            ? reg.getTipoRegistro().name()
                            : null;

                    String inicio = reg.getHoraEntrada() != null
                            ? reg.getHoraEntrada().toString().substring(0, 5) // HH:mm
                            : null;

                    String fin = reg.getHoraSalida() != null
                            ? reg.getHoraSalida().toString().substring(0, 5)
                            : null;

                    return new AsistenciaHoyDTO(
                            emp.getId(),
                            nombreCompleto,
                            area,
                            tipo,
                            inicio,
                            fin
                    );
                })
                .sorted((a, b) -> {
                    if (a.getInicio() == null && b.getInicio() == null) return 0;
                    if (a.getInicio() == null) return 1;
                    if (b.getInicio() == null) return -1;
                    return a.getInicio().compareTo(b.getInicio());
                })
                .toList();
    }
}
