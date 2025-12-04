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
    public List<GesEmpleadoConPuestoDTO> listarConPuestoActual() {
        return empleadoService.listarEmpleadosConPuestoActual();
    }
}