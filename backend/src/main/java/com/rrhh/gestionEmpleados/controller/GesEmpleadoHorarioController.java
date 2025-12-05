package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.dto.GesEmpleadoConHorarioDTO;
import com.rrhh.gestionEmpleados.service.GesHorarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gempleados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GesEmpleadoHorarioController {

    private final GesHorarioService horarioService;

    @GetMapping("/con-horario")
    public List<GesEmpleadoConHorarioDTO> listar() {
        return horarioService.listarEmpleadosConHorarioActual();
    }
}