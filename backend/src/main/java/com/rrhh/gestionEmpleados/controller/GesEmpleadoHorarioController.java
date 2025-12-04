package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.dto.GesEmpleadoConHorarioDTO;
import com.rrhh.gestionEmpleados.service.GesEmpleadoHorarioQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gempleados-horario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GesEmpleadoHorarioController {

    private final GesEmpleadoHorarioQueryService queryService;

    @GetMapping("/con-horario")
    public List<GesEmpleadoConHorarioDTO> listar() {
        return queryService.listarEmpleadosConHorario();
    }
}