package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.dto.EmpleadoRequest;
import com.rrhh.gestionEmpleados.dto.EmpleadoResponse;
import com.rrhh.gestionEmpleados.mapper.EmpleadoMapper;
import com.rrhh.gestionEmpleados.model.Empleado;
import com.rrhh.gestionEmpleados.service.EmpleadoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/gempleados")
@CrossOrigin(origins = "*") // si usarás React, esto evita errores CORS
public class EmpleadoController {

    private final EmpleadoService service;

    public EmpleadoController(EmpleadoService service) {
        this.service = service;
    }

    @GetMapping
    public List<EmpleadoResponse> listar() {
        return service.listarTodos()
                .stream()
                .map(EmpleadoMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public EmpleadoResponse obtener(@PathVariable Integer id) {
        return EmpleadoMapper.toResponse(service.buscarPorId(id));
    }

    @PostMapping
    public EmpleadoResponse crear(@RequestBody EmpleadoRequest dto) {
        Empleado emp = new Empleado();
        EmpleadoMapper.updateEntity(emp, dto);
        return EmpleadoMapper.toResponse(service.crear(emp));
    }

    @PutMapping("/{id}")
    public EmpleadoResponse actualizar(@PathVariable Integer id, @RequestBody EmpleadoRequest dto) {
        Empleado emp = service.buscarPorId(id);
        EmpleadoMapper.updateEntity(emp, dto);
        return EmpleadoMapper.toResponse(service.actualizar(id, emp));
    }

    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return "Empleado eliminado correctamente.";
    }
}