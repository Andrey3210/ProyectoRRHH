package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.model.GesPuesto;
import com.rrhh.gestionEmpleados.repository.GesPuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GesPuestoService {
    private final GesPuestoRepository puestoRepository;

    public List<GesPuesto> listarTodos() {
        return puestoRepository.findAll();
    }
}
