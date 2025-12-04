package com.rrhh.asistencia.service.impl;

import com.rrhh.asistencia.dao.AsistenciaDAO;
import com.rrhh.asistencia.dao.EmpleadoAsistenciaDAO;
import com.rrhh.asistencia.dao.HorarioDAO;
import com.rrhh.asistencia.domain.enums.EstadoRegistro;
import com.rrhh.asistencia.domain.enums.TipoRegistro;
import com.rrhh.asistencia.domain.model.CorreccionAsistencia;
import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.EmpleadoHorario;
import com.rrhh.asistencia.domain.model.RegistroAsistencia;
import com.rrhh.asistencia.dto.AsistenciaHoyDTO;
import com.rrhh.asistencia.service.IAsistenciaService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import jakarta.persistence.Query;
import com.rrhh.asistencia.dao.CorreccionAsistenciaDAO;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class AsistenciaServiceImpl implements IAsistenciaService {

    private final AsistenciaDAO asistenciaDAO;
    private final HorarioDAO horarioDAO;
    private final EmpleadoAsistenciaDAO empleadoAsistenciaDAO;
    private final CorreccionAsistenciaDAO correccionAsistenciaDAO;


    @PersistenceContext
    private EntityManager em;

    public AsistenciaServiceImpl(
            AsistenciaDAO asistenciaDAO,
            HorarioDAO horarioDAO,
            EmpleadoAsistenciaDAO empleadoAsistenciaDAO,
            CorreccionAsistenciaDAO correccionAsistenciaDAO
    ) {
        this.asistenciaDAO = asistenciaDAO;
        this.horarioDAO = horarioDAO;
        this.empleadoAsistenciaDAO = empleadoAsistenciaDAO;
        this.correccionAsistenciaDAO = correccionAsistenciaDAO;;
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
            // ya tiene entrada y salida
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

        // Todos los nuevos registros van PENDIENTE
        if (empleadoHorario == null) {
            registro.setEstado(EstadoRegistro.PENDIENTE);
            return;
        }

        LocalTime horaEsperada = empleadoHorario.getHorario().getHoraEntrada();
        Integer tolerancia = empleadoHorario.getHorario().getToleranciaEntrada();
        if (tolerancia == null) tolerancia = 0;

        LocalTime limiteTolerancia = horaEsperada.plusMinutes(tolerancia);

        if (horaEntradaReal.isAfter(limiteTolerancia)) {
            registro.setTipoRegistro(TipoRegistro.TARDE);
            registro.setEstado(EstadoRegistro.PENDIENTE);
        } else {
            registro.setTipoRegistro(TipoRegistro.PUNTUAL);
            registro.setEstado(EstadoRegistro.PENDIENTE);
        }
    }

    private void calcularHorasTrabajadas(RegistroAsistencia registro) {
        if (registro.getHoraEntrada() != null && registro.getHoraSalida() != null) {
            Duration d = Duration.between(registro.getHoraEntrada(), registro.getHoraSalida());
            double horas = d.toMinutes() / 60.0;
            System.out.println("Horas trabajadas calculadas: " + horas);
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
    public EmpleadoAsis obtenerEmpleadoPorUsuario(Integer idUsuario) {
        return empleadoAsistenciaDAO.buscarPorIdUsuario(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró empleado para el usuario: " + idUsuario));
    }

    //
    // ... imports existentes
 // Asegúrate de tener este import

// ... dentro de la clase AsistenciaServiceImpl

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

                    // --- INICIO CAMBIO: Obtener Área desde BD ---
                    String area = obtenerAreaPorEmpleado(emp.getId());
                    // --- FIN CAMBIO ---

                    TipoRegistro tipoEnum = reg.getTipoRegistro();
                    if (tipoEnum == null) {
                        // Si por alguna razón viene null, asumimos PRESENTE o PUNTUAL
                        tipoEnum = TipoRegistro.PUNTUAL;
                        reg.setTipoRegistro(tipoEnum); // opcional: persistir el valor corregido
                    }

                    String tipo = tipoEnum.name(); // "PUNTUAL", "TARDE", etc.

                    String inicio = reg.getHoraEntrada() != null
                            ? reg.getHoraEntrada().toString().substring(0, 5)
                            : null;

                    String fin = reg.getHoraSalida() != null
                            ? reg.getHoraSalida().toString().substring(0, 5)
                            : null;

                    return new AsistenciaHoyDTO(
                            emp.getId(),
                            nombreCompleto,
                            area, // Ahora pasamos el área real
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

    // Método auxiliar para obtener el área usando SQL nativo
    // Esto es robusto incluso si no tienes las entidades de Puesto mapeadas en este módulo
    private String obtenerAreaPorEmpleado(Integer idEmpleado) {
        try {
            String sql = """
                SELECT p.area 
                FROM empleados_puestos ep
                JOIN puestos p ON ep.id_puesto = p.id_puesto
                WHERE ep.id_empleado = :idEmpleado 
                AND ep.activo = 1
                LIMIT 1
            """;

            Query query = em.createNativeQuery(sql);
            query.setParameter("idEmpleado", idEmpleado);

            List<?> result = query.getResultList();
            if (!result.isEmpty()) {
                return (String) result.get(0);
            }
        } catch (Exception e) {
            System.err.println("Error obteniendo área para empleado " + idEmpleado + ": " + e.getMessage());
        }
        return "Sin Área"; // Valor por defecto si no se encuentra
    }

    @Override
    public RegistroAsistencia corregirAsistencia(
            Integer idRegistro,
            Integer idEmpleado,
            LocalDate fecha,
            LocalTime nuevaHoraEntrada,
            LocalTime nuevaHoraSalida,
            String nuevoTipoRegistro,
            String motivo,
            Integer idUsuarioCorrige
    ) {
        EmpleadoAsis empleado = em.find(EmpleadoAsis.class, idEmpleado);
        if (empleado == null) {
            throw new IllegalArgumentException("Empleado no encontrado: " + idEmpleado);
        }

        // 1) Intentar encontrar el registro por id
        RegistroAsistencia registro = null;
        if (idRegistro != null) {
            registro = asistenciaDAO.buscarPorId(idRegistro).orElse(null);
        }

        // 2) Si no viene idRegistro o no se encontró, buscar por empleado+fecha
        if (registro == null) {
            registro = asistenciaDAO.buscarPorEmpleadoYFecha(empleado, fecha).orElse(null);
        }

        // 3) Solo si realmente no existe ninguno, crear uno nuevo
        if (registro == null) {
            registro = new RegistroAsistencia();
            registro.setEmpleado(empleado);
            registro.setFecha(fecha);
        }

        // Determinar qué se corrige
        boolean corrigeEntrada = nuevaHoraEntrada != null;
        boolean corrigeSalida = nuevaHoraSalida != null;
        String tipoCorreccion;
        if (corrigeEntrada && corrigeSalida) tipoCorreccion = "AMBAS";
        else if (corrigeEntrada) tipoCorreccion = "ENTRADA";
        else tipoCorreccion = "SALIDA";

        CorreccionAsistencia corr = new CorreccionAsistencia();
        corr.setRegistroAsistencia(registro);
        corr.setIdEmpleado(idEmpleado);
        corr.setFecha(fecha);
        corr.setTipoCorreccion(tipoCorreccion);
        corr.setHoraAnterior(corrigeEntrada ? registro.getHoraEntrada() : registro.getHoraSalida());
        corr.setHoraCorregida(corrigeEntrada ? nuevaHoraEntrada : nuevaHoraSalida);
        corr.setMotivo(motivo);
        corr.setCorregidaPor(idUsuarioCorrige);
        corr.setEstado("PENDIENTE");
        correccionAsistenciaDAO.guardar(corr);

        // Aplicar cambio al registro real
        if (corrigeEntrada) registro.setHoraEntrada(nuevaHoraEntrada);
        if (corrigeSalida) registro.setHoraSalida(nuevaHoraSalida);

        if (nuevoTipoRegistro != null) {
            registro.setTipoRegistro(TipoRegistro.valueOf(nuevoTipoRegistro));
        }
        registro.setEstado(EstadoRegistro.CORREGIDO);

        return asistenciaDAO.guardar(registro);
    }


}
