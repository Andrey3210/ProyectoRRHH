package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.dto.GesEmpleadoConPuestoDTO;
import com.rrhh.gestionEmpleados.dto.GesEmpleadoRequestDTO;
import com.rrhh.gestionEmpleados.model.GesEmpleado;
import com.rrhh.gestionEmpleados.service.GesEmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/gempleados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permitir conexión desde React
public class GesEmpleadoController {

    private final GesEmpleadoService empleadoService;

    // -------- Crear --------
    @PostMapping
    public GesEmpleado crear(@RequestBody GesEmpleadoRequestDTO dto) {
        return empleadoService.crear(dto);
    }

    // -------- Actualizar --------
    @PutMapping("/{idEmpleado}")
    public GesEmpleado actualizar(
            @PathVariable Integer idEmpleado,
            @RequestBody GesEmpleadoRequestDTO dto) {

        return empleadoService.actualizar(idEmpleado, dto);
    }

    // -------- Obtener por ID --------
    @GetMapping("/{idEmpleado}")
    public GesEmpleado obtenerPorId(@PathVariable Integer idEmpleado) {
        return empleadoService.obtenerPorId(idEmpleado);
    }

    // -------- Listar todos --------
    @GetMapping
    public List<GesEmpleado> listarEmpleados() {
        return empleadoService.listarTodos();
    }

    // -------- Inactivar (en vez de delete) --------
    @PutMapping("/{idEmpleado}/inactivar")
    public GesEmpleado inactivar(@PathVariable Integer idEmpleado) {
        return empleadoService.inactivar(idEmpleado);
    }

    @GetMapping("/con-puesto")
    public List<GesEmpleadoConPuestoDTO> listarConPuesto() {
        return empleadoService.listarEmpleadosConPuestoActual();
    }

    @GetMapping("/{id}/puesto-actual")
    public GesEmpleadoConPuestoDTO obtenerPuestoActual(@PathVariable Integer id) {
        return empleadoService.obtenerEmpleadoConPuestoDTO(id);
    }

    @GetMapping("/area/{area}")
    public List<GesEmpleadoConPuestoDTO> listarPorArea(@PathVariable String area) {
        return empleadoService.listarEmpleadosPorArea(area);
    }

    @GetMapping("/area/ventas")
    public List<GesEmpleadoConPuestoDTO> listarPorAreaVentas() {
        return empleadoService.listarEmpleadosPorArea("Cotización y Ventas");
    }

    @GetMapping("/area/atencion-cliente")
    public List<GesEmpleadoConPuestoDTO> listarPorAreaAtencionCliente() {
        return empleadoService.listarEmpleadosPorArea("Atención al cliente");
    }

    @GetMapping("/area/compras")
    public List<GesEmpleadoConPuestoDTO> listarPorAreaCompras() {
        return empleadoService.listarEmpleadosPorArea("Compras");
    }
}