package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.dto.GesEmpleadoConHorarioDTO;
import com.rrhh.gestionEmpleados.model.GesHorario;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GesEmpleadoHorarioQueryService {

    private final GesEmpleadoRepository empleadoRepo;
    private final GesHorarioService horarioService;

    public List<GesEmpleadoConHorarioDTO> listarEmpleadosConHorario() {

        return empleadoRepo.findAll().stream()
                .map(emp -> {

                    var horarioOpt = horarioService.obtenerHorarioActualPorEmpleado(emp.getIdEmpleado());
                    if (horarioOpt.isEmpty()) return null;

                    GesHorario h = horarioOpt.get();

                    GesEmpleadoConHorarioDTO dto = new GesEmpleadoConHorarioDTO();

                    // datos del empleado
                    dto.setIdEmpleado(emp.getIdEmpleado());
                    dto.setCodigoEmpleado(emp.getCodigoEmpleado());
                    dto.setNombres(emp.getNombres());
                    dto.setApellidoPaterno(emp.getApellidoPaterno());
                    dto.setApellidoMaterno(emp.getApellidoMaterno());
                    dto.setDocumentoIdentidad(emp.getDocumentoIdentidad());
                    dto.setTipoDocumento(emp.getTipoDocumento());
                    dto.setFechaNacimiento(emp.getFechaNacimiento());
                    dto.setGenero(emp.getGenero());
                    dto.setEstadoCivil(emp.getEstadoCivil());
                    dto.setNacionalidad(emp.getNacionalidad());
                    dto.setDireccion(emp.getDireccion());
                    dto.setTelefono(emp.getTelefono());
                    dto.setEmail(emp.getEmail());
                    dto.setEmailCorporativo(emp.getEmailCorporativo());
                    dto.setFechaIngreso(emp.getFechaIngreso());
                    dto.setFechaCese(emp.getFechaCese());
                    dto.setEstado(emp.getEstado());
                    dto.setTipoContrato(emp.getTipoContrato());
                    dto.setModalidadTrabajo(emp.getModalidadTrabajo());

                    // datos del horario
                    dto.setIdHorario(h.getIdHorario());
                    dto.setNombreHorario(h.getNombreHorario());
                    dto.setDepartamentoHorario(h.getDepartamento());
                    dto.setHoraEntrada(h.getHoraEntrada());
                    dto.setHoraSalida(h.getHoraSalida());
                    dto.setDiasSemana(h.getDiasSemana());
                    dto.setToleranciaEntrada(h.getToleranciaEntrada());
                    dto.setHorasJornada(h.getHorasJornada());

                    return dto;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
}