package com.rrhh.incentivos.controller;

import com.rrhh.auth.service.IServicioAutenticacion; 
import com.rrhh.incentivos.dto.*;
import com.rrhh.incentivos.service.IIncentivoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incentivos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class IncentivoController {

    private final IIncentivoService incentivoService;
    private final IServicioAutenticacion authService;

    // =========================================================================
    //                            MÓDULO EMPLEADO
    // =========================================================================

   
    @GetMapping("/empleado/dashboard-resumen")
    public ResponseEntity<DashboardEmpleadoDTO> obtenerDashboardEmpleado(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "2025-11") String periodo) {
        
        Integer idEmpleado = obtenerIdEmpleadoDesdeToken(token);
        DashboardEmpleadoDTO dashboard = incentivoService.obtenerDashboardEmpleado(idEmpleado, periodo);
        return ResponseEntity.ok(dashboard);
    }

 
    @GetMapping("/empleado/mis-bonos")
    public ResponseEntity<List<BonoResumenDTO>> obtenerMisBonos(
            @RequestHeader("Authorization") String token) {
        
        Integer idEmpleado = obtenerIdEmpleadoDesdeToken(token);
        List<BonoResumenDTO> bonos = incentivoService.obtenerBonosPorEmpleado(idEmpleado);
        return ResponseEntity.ok(bonos);
    }

    
    @GetMapping("/bonos/{idBono}")
    public ResponseEntity<DetalleEvidenciaDTO> obtenerDetalleBono(@PathVariable Integer idBono) {
        DetalleEvidenciaDTO detalle = incentivoService.obtenerDetalleBono(idBono);
        return ResponseEntity.ok(detalle);
    }

    
    @GetMapping("/admin/dashboard")
    public ResponseEntity<DashboardAdminDTO> obtenerDashboardAdmin(
            @RequestParam(defaultValue = "2025-11") String periodo) {
        
        DashboardAdminDTO dashboard = incentivoService.obtenerDatosDashboard(periodo);
        return ResponseEntity.ok(dashboard);
    }

  
    @GetMapping("/admin/reglas")
    public ResponseEntity<List<ReglaAdminDTO>> listarReglas(
            @RequestParam(required = false, defaultValue = "VENTAS") String categoria) {
        
        List<ReglaAdminDTO> reglas = incentivoService.listarReglasPorCategoria(categoria);
        return ResponseEntity.ok(reglas);
    }

  
    @PostMapping("/admin/reglas")
    public ResponseEntity<Void> crearRegla(@RequestBody ReglaCreateDTO dto) {
        incentivoService.crearNuevaRegla(dto);
        return ResponseEntity.ok().build();
    }

  
    @PatchMapping("/admin/reglas/{id}/estado")
    public ResponseEntity<Void> cambiarEstadoRegla(
            @PathVariable Integer id,
            @RequestBody Boolean nuevoEstado) {
        
        incentivoService.cambiarEstadoRegla(id, nuevoEstado);
        return ResponseEntity.ok().build();
    }

   
    @DeleteMapping("/admin/reglas/{id}")
    public ResponseEntity<Void> eliminarRegla(@PathVariable Integer id) {
        incentivoService.eliminarRegla(id);
        return ResponseEntity.ok().build();
    }

  
    @GetMapping("/admin/metas")
    public ResponseEntity<ResumenMetasDTO> obtenerMetas(
            @RequestParam(defaultValue = "VENTAS") String departamento,
            @RequestParam(defaultValue = "2025-12") String periodo) {
        
        ResumenMetasDTO resumen = incentivoService.obtenerResumenMetas(departamento, periodo);
        return ResponseEntity.ok(resumen);
    }

   
    @PostMapping("/admin/metas")
    public ResponseEntity<Void> asignarMeta(@RequestBody MetaAsignacionDTO dto) {
        incentivoService.asignarMetaEmpleado(dto);
        return ResponseEntity.ok().build();
    }

   
    @GetMapping("/admin/aprobaciones")
    public ResponseEntity<PantallaAprobacionDTO> obtenerAprobaciones(
            @RequestParam(defaultValue = "2025-11") String periodo) {
        return ResponseEntity.ok(incentivoService.obtenerDataAprobaciones(periodo));
    }

  
    @PatchMapping("/admin/aprobaciones/{id}/aprobar")
    public ResponseEntity<Void> aprobarBono(@PathVariable Integer id) {
        incentivoService.aprobarBono(id);
        return ResponseEntity.ok().build();
    }


    @PatchMapping("/admin/aprobaciones/{id}/rechazar")
    public ResponseEntity<Void> rechazarBono(@PathVariable Integer id) {
        incentivoService.rechazarBono(id);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/admin/aprobaciones/masivo")
    public ResponseEntity<Void> aprobarMasivo(@RequestBody List<Integer> idsBonos) {
        incentivoService.aprobarMasivo(idsBonos);
        return ResponseEntity.ok().build();
    }

    // =========================================================================
    //                        MÓDULO ADMIN - REPORTES
    // =========================================================================

    @GetMapping("/admin/reportes")
    public ResponseEntity<ReporteIncentivosDTO> obtenerReporteAnual(
            @RequestParam(defaultValue = "2025") String anio) {
        return ResponseEntity.ok(incentivoService.generarReporteAnual(anio));
    }

    private Integer obtenerIdEmpleadoDesdeToken(String token) {
        String tokenLimpio = token.replace("Bearer ", "").trim();
        return authService.obtenerIdUsuarioDesdeToken(tokenLimpio);
    }
}