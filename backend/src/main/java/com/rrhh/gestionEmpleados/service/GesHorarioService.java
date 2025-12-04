package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.model.GesEmpleadoHorario;
import com.rrhh.gestionEmpleados.model.GesHorario;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoHorarioRepository;
import com.rrhh.gestionEmpleados.repository.GesHorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GesHorarioService {

    private final GesEmpleadoHorarioRepository empleadoHorarioRepo;
    private final GesHorarioRepository horarioRepo;

    public Optional<GesHorario> obtenerHorarioActualPorEmpleado(Integer idEmpleado) {

        Optional<GesEmpleadoHorario> relacion =
                empleadoHorarioRepo.findFirstByIdEmpleadoAndActivoTrueOrderByFechaInicioDesc(idEmpleado);

        if (relacion.isEmpty()) {
            return Optional.empty();
        }

        return horarioRepo.findById(relacion.get().getIdHorario());
    }
}