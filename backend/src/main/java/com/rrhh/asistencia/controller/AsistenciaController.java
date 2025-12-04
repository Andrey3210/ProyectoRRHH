package com.rrhh.asistencia.controller;

import com.rrhh.asistencia.domain.model.RegistroAsistencia;
import com.rrhh.asistencia.dto.AsistenciaHoyDTO;
import com.rrhh.asistencia.service.IAsistenciaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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

}
