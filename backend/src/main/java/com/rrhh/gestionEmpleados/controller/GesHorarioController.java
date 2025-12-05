package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.model.GesHorario;
import com.rrhh.gestionEmpleados.service.GesHorarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/gempleados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GesHorarioController {
    private final GesHorarioService horarioService;

    @GetMapping("/horarios")
    public List<GesHorario> listarHorarios() {
        return horarioService.listarTodos();
    }
}
