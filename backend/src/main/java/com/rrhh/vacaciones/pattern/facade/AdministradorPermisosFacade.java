// Archivo: backend/src/main/java/com/rrhh/vacaciones/pattern/facade/AdministradorPermisosFacade.java
package com.rrhh.vacaciones.pattern.facade;

import com.rrhh.vacaciones.dto.ReporteSaldoDTO;
import com.rrhh.vacaciones.model.Estado;
import com.rrhh.vacaciones.model.Solicitud;
import com.rrhh.vacaciones.pattern.command.impl.*;
import com.rrhh.vacaciones.repository.ISolicitudRepository;
import com.rrhh.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdministradorPermisosFacade {

    private final ApplicationContext context;
    private final ISolicitudRepository solicitudRepository;
    private final CalcularSaldos calcularSaldosCommand; // Inyectar el comando

    // Solo inyectamos los comandos que NO tienen estado (Singleton)
    private final BuscarTodasSolicitudes buscarTodasSolicitudesCommand;

    public void aprobarSolicitud(Integer idSolicitud, String comentarios) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud", idSolicitud));

        // CORRECCIÓN: Pedir nueva instancia, setear datos y ejecutar
        AprobarSolicitud comando = context.getBean(AprobarSolicitud.class);
        comando.setSolicitud(solicitud);
        comando.setComentarios(comentarios);
        comando.ejecutar();
    }

    public void rechazarSolicitud(Integer idSolicitud, String motivo) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud", idSolicitud));

        // CORRECCIÓN: Pedir nueva instancia, setear datos y ejecutar
        RechazarSolicitud comando = context.getBean(RechazarSolicitud.class);
        comando.setSolicitud(solicitud);
        comando.setMotivo(motivo);
        comando.ejecutar();
    }

    public List<Solicitud> buscarTodasSolicitudes() {
        return buscarTodasSolicitudesCommand.ejecutar();
    }

    public void volverAlPendiente(Integer idSolicitud) {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        VolverAPendiente comando = context.getBean(VolverAPendiente.class);
        comando.setSolicitud(solicitud);
        comando.ejecutar();
    }

    public List<Solicitud> buscarSolicitudesPorEstado(Estado estado) {
        BuscarSolicitudesPorEstado comando = context.getBean(BuscarSolicitudesPorEstado.class);
        comando.setEstado(estado);
        return comando.ejecutar();
    }

    public Solicitud buscarSolicitudPorId(Integer id) {
        return solicitudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud", id));
    }

    public List<ReporteSaldoDTO> generarReporteSaldos() {
        return calcularSaldosCommand.ejecutar();
    }
}