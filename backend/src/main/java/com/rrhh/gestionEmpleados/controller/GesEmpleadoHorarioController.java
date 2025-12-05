package com.rrhh.gestionEmpleados.controller;

import com.rrhh.gestionEmpleados.dto.GesAsignarHorarioRequest;
import com.rrhh.gestionEmpleados.dto.GesEmpleadoConHorarioDTO;
import com.rrhh.gestionEmpleados.model.GesEmpleadoHorario;
import com.rrhh.gestionEmpleados.service.GesHorarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/asignarHorario")
    public ResponseEntity<GesEmpleadoHorario> asignarHorario(@RequestBody GesAsignarHorarioRequest request) {
        GesEmpleadoHorario empHorario = horarioService.asignarHorario(request);
        return ResponseEntity.ok(empHorario);
    }

    @PostMapping("/actualizarHorario")
    public ResponseEntity<GesEmpleadoHorario> actualizarHorario(@RequestBody GesAsignarHorarioRequest request) {
        GesEmpleadoHorario empHorario = horarioService.actualizarHorario(request);
        return ResponseEntity.ok(empHorario);
    }
}