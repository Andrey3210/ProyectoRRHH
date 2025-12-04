// com/rrhh/asistencia/controller/ReporteAsistenciaController.java
package com.rrhh.asistencia.controller;

import com.rrhh.asistencia.dto.DetalleDiaDTO;
import com.rrhh.asistencia.dto.ReporteAsistenciaRequest;
import com.rrhh.asistencia.dto.ReporteAsistenciaResponse;
import com.rrhh.asistencia.service.IReporteAsistenciaService;
import com.rrhh.asistencia.dao.ReporteAsistenciaDAO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reporte")
@CrossOrigin(origins = "*")
public class ReporteAsistenciaController {

    private final IReporteAsistenciaService reporteAsistenciaService;
    private final ReporteAsistenciaDAO reporteAsistenciaDAO;

    public ReporteAsistenciaController(IReporteAsistenciaService reporteAsistenciaService,
                                       ReporteAsistenciaDAO reporteAsistenciaDAO) {
        this.reporteAsistenciaService = reporteAsistenciaService;
        this.reporteAsistenciaDAO = reporteAsistenciaDAO;
    }

    @GetMapping("/resumen-empleado")
    public ResponseEntity<ReporteAsistenciaResponse> getResumenEmpleado(
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin,
            @RequestParam(required = false) Long areaId,
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(defaultValue = "false") boolean soloFaltas,
            @RequestParam(defaultValue = "false") boolean soloTardanzas,
            @RequestParam(defaultValue = "false") boolean incluirSinRegistro
    ) {
        ReporteAsistenciaRequest filtro = new ReporteAsistenciaRequest(
                fechaInicio, fechaFin, areaId, empleadoId,
                soloFaltas, soloTardanzas, incluirSinRegistro
        );
        ReporteAsistenciaResponse reporte = reporteAsistenciaService.generarReporte(filtro);
        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/detalle-dia")
    public List<DetalleDiaDTO> getDetallePorDia(
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin,
            @RequestParam(required = false) Long areaId,
            @RequestParam(required = false) Long empleadoId
    ) {
        ReporteAsistenciaRequest filtro = new ReporteAsistenciaRequest(
                fechaInicio,
                fechaFin,
                areaId,
                empleadoId,
                false,
                false,
                false
        );
        return reporteAsistenciaDAO.obtenerDetallePorDia(filtro);
    }
}
