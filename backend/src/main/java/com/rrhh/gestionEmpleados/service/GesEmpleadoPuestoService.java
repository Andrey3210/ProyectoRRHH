package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.dto.GesAsignarPuestoRequest;
import com.rrhh.gestionEmpleados.model.GesEmpleado;
import com.rrhh.gestionEmpleados.model.GesEmpleadoPuesto;
import com.rrhh.gestionEmpleados.model.GesPuesto;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoPuestoRepository;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoRepository;
import com.rrhh.gestionEmpleados.repository.GesPuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GesEmpleadoPuestoService {
    private final GesEmpleadoPuestoRepository empleadoPuestoRepository;
    private final GesEmpleadoRepository empleadoRepository;
    private final GesPuestoRepository puestoRepository;

    public GesEmpleadoPuesto asignarPuesto(GesAsignarPuestoRequest request) {
        GesEmpleado empleado = empleadoRepository.findById(request.getIdEmpleado())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        GesPuesto puesto = puestoRepository.findById(request.getIdPuesto())
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));

        // Validar si ya tiene un puesto activo
        boolean tieneActivo = empleadoPuestoRepository.existsByEmpleadoIdEmpleadoAndActivoTrue(empleado.getIdEmpleado());
        if (tieneActivo) {
            throw new RuntimeException("El empleado ya tiene un puesto activo");
        }

        GesEmpleadoPuesto empPuesto = new GesEmpleadoPuesto();
        empPuesto.setEmpleado(empleado);
        empPuesto.setPuesto(puesto);
        empPuesto.setFechaInicio(request.getFechaInicio() != null ? request.getFechaInicio() : LocalDate.now());
        empPuesto.setSalario(request.getSalario());
        empPuesto.setMotivoCambio(request.getMotivoCambio());
        empPuesto.setActivo(true);
        empPuesto.setFechaAsignacion(LocalDateTime.now());

        return empleadoPuestoRepository.save(empPuesto);
    }
}
