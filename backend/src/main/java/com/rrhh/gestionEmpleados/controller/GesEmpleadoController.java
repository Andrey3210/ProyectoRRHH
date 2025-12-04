package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.dto.GesEmpleadoConPuestoDTO;
import com.rrhh.gestionEmpleados.model.GesEmpleado;
import com.rrhh.gestionEmpleados.service.GesEmpleadoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/gempleados")
@CrossOrigin(origins = "*") // Permitir conexión desde React
public class GesEmpleadoController {

    private final GesEmpleadoService empleadoService;

    public GesEmpleadoController(GesEmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public List<GesEmpleado> listarEmpleados() {
        return empleadoService.listarTodos();
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