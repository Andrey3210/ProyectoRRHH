package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.model.Empleado;
import com.rrhh.gestionEmpleados.service.EmpleadoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/gempleados")
@CrossOrigin(origins = "*") // si usarás React, esto evita errores CORS
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public List<Empleado> listarEmpleados() {
        return empleadoService.listarTodos();
    }
}