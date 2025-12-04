package com.rrhh.asistencia.controller;

import com.rrhh.asistencia.domain.model.ReporteAsistencia;
import com.rrhh.asistencia.service.IReporteAsistenciaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reportes/asistencia")
@CrossOrigin(origins = "*")
public class ReporteAsistenciaController {

    private final IReporteAsistenciaService reporteService;

    public ReporteAsistenciaController(IReporteAsistenciaService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<List<ReporteAsistencia>> obtenerResumenPorEmpleado(
            @RequestParam("inicio")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam("fin")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            @RequestParam(value = "area", required = false) String area,
            @RequestParam(value = "idEmpleado", required = false) Integer idEmpleado
    ) {
        List<ReporteAsistencia> reportes =
                reporteService.generarReporteResumenPorEmpleado(inicio, fin, area, idEmpleado);
        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/empleado/{idEmpleado}")
    public ResponseEntity<ReporteAsistencia> obtenerReporteEmpleado(
            @PathVariable Integer idEmpleado,
            @RequestParam("inicio")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam("fin")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        ReporteAsistencia reporte =
                reporteService.generarReporteEmpleadoBasico(idEmpleado, inicio, fin);
        return ResponseEntity.ok(reporte);
    }
}
