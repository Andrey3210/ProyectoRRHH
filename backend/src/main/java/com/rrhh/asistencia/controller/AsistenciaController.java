package com.rrhh.asistencia.controller;

import com.rrhh.asistencia.domain.model.EmpleadoAsis;
import com.rrhh.asistencia.domain.model.RegistroAsistencia;
import com.rrhh.asistencia.dto.AsistenciaHoyDTO;
import com.rrhh.asistencia.service.IAsistenciaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/asistencia")
@CrossOrigin(origins = "*")
public class AsistenciaController {

    private final IAsistenciaService asistenciaService;

    public AsistenciaController(IAsistenciaService asistenciaService) {
        this.asistenciaService = asistenciaService;
    }

    @GetMapping("/empleado/{idEmpleado}")
    public ResponseEntity<List<RegistroAsistencia>> obtenerAsistenciaEmpleado(
            @PathVariable Integer idEmpleado,
            @RequestParam("desde")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam("hasta")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta
    ) {
        List<RegistroAsistencia> registros =
                asistenciaService.obtenerAsistenciaEmpleado(idEmpleado, desde, hasta);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }

    @PostMapping("/marcar")
    public ResponseEntity<RegistroAsistencia> marcarAsistencia(
            @RequestParam("idEmpleado") Integer idEmpleado
    ) {
        RegistroAsistencia registro = asistenciaService.marcarAsistencia(idEmpleado);
        return ResponseEntity.ok(registro);
    }

    @GetMapping("/hoy")
    public ResponseEntity<List<RegistroAsistencia>> obtenerAsistenciaHoy() {
        return ResponseEntity.ok(asistenciaService.obtenerAsistenciaHoy());
    }

    @GetMapping("/estado-actual/{idEmpleado}")
    public ResponseEntity<RegistroAsistencia> obtenerEstadoActual(
            @PathVariable Integer idEmpleado
    ) {
        RegistroAsistencia preview = asistenciaService.calcularEstadoActual(idEmpleado);
        return ResponseEntity.ok(preview);
    }

    @GetMapping("/hoy/timeline")
    public ResponseEntity<List<AsistenciaHoyDTO>> obtenerAsistenciaHoyTimeline() {
        return ResponseEntity.ok(asistenciaService.obtenerAsistenciaHoyParaTimeline());
    }

    /** Nuevo endpoint: devuelve el empleado asociado al usuario autenticado */
    @GetMapping("/mi-empleado")
    public ResponseEntity<Map<String, Object>> obtenerMiEmpleado(
            @RequestParam("idUsuario") Integer idUsuario
    ) {
        EmpleadoAsis emp = asistenciaService.obtenerEmpleadoPorUsuario(idUsuario);

        String nombreCompleto = String.format(
                "%s %s %s",
                emp.getNombres(),
                emp.getApellidoPaterno(),
                emp.getApellidoMaterno() == null ? "" : emp.getApellidoMaterno()
        ).trim();

        Map<String, Object> body = new HashMap<>();
        body.put("idEmpleado", emp.getId());
        body.put("nombreCompleto", nombreCompleto);

        return ResponseEntity.ok(body);
    }

    @PostMapping("/correcciones")
    public ResponseEntity<RegistroAsistencia> corregirAsistencia(
            @RequestParam(required = false) Integer idRegistro,
            @RequestParam Integer idEmpleado,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam(required = false) String horaEntrada,
            @RequestParam(required = false) String horaSalida,
            @RequestParam String tipoRegistro,
            @RequestParam String motivo,
            @RequestParam Integer idUsuarioCorrige
    ) {
        LocalTime he = (horaEntrada != null && !horaEntrada.isBlank())
                ? LocalTime.parse(horaEntrada)
                : null;
        LocalTime hs = (horaSalida != null && !horaSalida.isBlank())
                ? LocalTime.parse(horaSalida)
                : null;

        RegistroAsistencia actualizado = asistenciaService.corregirAsistencia(
                idRegistro,
                idEmpleado,
                fecha,
                he,
                hs,
                tipoRegistro,
                motivo,
                idUsuarioCorrige
        );
        return ResponseEntity.ok(actualizado);
    }


}
