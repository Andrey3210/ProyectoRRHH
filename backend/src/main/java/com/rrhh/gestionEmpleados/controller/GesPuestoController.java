package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.model.GesPuesto;
import com.rrhh.gestionEmpleados.service.GesPuestoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/gempleados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GesPuestoController {
    private final GesPuestoService puestoService;

    @GetMapping("/puestos")
    public List<GesPuesto> listarPuestos() {
        return puestoService.listarTodos();
    }
}
