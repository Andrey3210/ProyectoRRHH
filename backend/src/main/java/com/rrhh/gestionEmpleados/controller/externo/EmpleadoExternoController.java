package com.rrhh.gestionEmpleados.controller.externo;

import com.rrhh.gestionEmpleados.dto.EmpleadoExternoDTO;
import com.rrhh.gestionEmpleados.mapper.EmpleadoMapper;
import com.rrhh.gestionEmpleados.service.EmpleadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/externo/empleados")
@CrossOrigin(origins = "*")
public class EmpleadoExternoController {

    private final EmpleadoService empleadoService;

    public EmpleadoExternoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public List<EmpleadoExternoDTO> listarEmpleadosExternos() {
        return empleadoService.listarTodos()
                .stream()
                .map(EmpleadoMapper::toExternoDTO)
                .toList();
    }
}