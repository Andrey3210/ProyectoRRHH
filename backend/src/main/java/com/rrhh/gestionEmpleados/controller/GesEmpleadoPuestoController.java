package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.dto.GesAsignarPuestoRequest;
import com.rrhh.gestionEmpleados.model.GesEmpleadoPuesto;
import com.rrhh.gestionEmpleados.service.GesEmpleadoPuestoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/gempleados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GesEmpleadoPuestoController {
    private final GesEmpleadoPuestoService empleadoPuestoService;

    @PostMapping("/asignarPuesto")
    public ResponseEntity<GesEmpleadoPuesto> asignarPuesto(@RequestBody GesAsignarPuestoRequest request) {
        GesEmpleadoPuesto empPuesto = empleadoPuestoService.asignarPuesto(request);
        return ResponseEntity.ok(empPuesto);
    }

    @PostMapping("/actualizarPuesto")
    public ResponseEntity<GesEmpleadoPuesto> actualizarPuesto(@RequestBody GesAsignarPuestoRequest request) {
        GesEmpleadoPuesto empPuesto = empleadoPuestoService.actualizarPuesto(request);
        return ResponseEntity.ok(empPuesto);
    }
}
