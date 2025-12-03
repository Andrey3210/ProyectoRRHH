package com.rrhh.vacaciones.pattern.command.impl;

import com.rrhh.vacaciones.dto.ReporteSaldoDTO;
import com.rrhh.vacaciones.model.SaldoVacaciones;
import com.rrhh.vacaciones.pattern.command.ComandoGenerarReporte;
import com.rrhh.vacaciones.repository.ISaldoVacacionesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CalcularSaldos implements ComandoGenerarReporte<ReporteSaldoDTO> {

    private final ISaldoVacacionesRepository saldoRepository;

    @Override
    public List<ReporteSaldoDTO> ejecutar() {
        List<SaldoVacaciones> saldos = saldoRepository.findAllCurrentYear();

        return saldos.stream().map(s -> new ReporteSaldoDTO(
                s.getEmpleado().getIdEmpleado(),
                s.getEmpleado().getNombres() + " " + s.getEmpleado().getApellidos(),
                "General", // Si Trabajador no tiene área mapeada, usamos un default o ajustamos el modelo
                s.getDiasAsignados(),
                s.getDiasTomados(),
                s.getDiasPendientes()
        )).collect(Collectors.toList());
    }
}