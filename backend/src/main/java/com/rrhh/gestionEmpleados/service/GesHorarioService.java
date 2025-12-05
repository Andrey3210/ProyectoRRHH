package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.dto.GesEmpleadoConHorarioDTO;
import com.rrhh.gestionEmpleados.model.GesEmpleado;
import com.rrhh.gestionEmpleados.model.GesEmpleadoHorario;
import com.rrhh.gestionEmpleados.model.GesHorario;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoHorarioRepository;
import com.rrhh.gestionEmpleados.repository.GesHorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GesHorarioService {

    private final GesEmpleadoHorarioRepository empleadoHorarioRepo;
    private final GesHorarioRepository horarioRepository;

    public List<GesHorario> listarTodos() {
        return horarioRepository.findAll();
        // Para solo activos: return horarioRepository.findByActivo(true);
    }

    public List<GesEmpleadoConHorarioDTO> listarEmpleadosConHorarioActual() {

        List<GesEmpleadoHorario> lista = empleadoHorarioRepo.listarHorariosEmpleadoActivo();

        return lista.stream()
                .map(eh -> {

                    GesEmpleado emp = eh.getEmpleado();
                    GesHorario hor = eh.getHorario();

                    GesEmpleadoConHorarioDTO dto = new GesEmpleadoConHorarioDTO();

                    // ----- Datos del empleado -----
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

                    // ----- Datos del horario -----
                    dto.setIdHorario(hor.getIdHorario());
                    dto.setNombreHorario(hor.getNombreHorario());
                    dto.setDepartamentoHorario(hor.getDepartamento());
                    dto.setHoraEntrada(hor.getHoraEntrada());
                    dto.setHoraSalida(hor.getHoraSalida());
                    dto.setDiasSemana(hor.getDiasSemana());
                    dto.setToleranciaEntrada(hor.getToleranciaEntrada());
                    dto.setHorasJornada(hor.getHorasJornada());

                    return dto;
                })
                .toList();
    }
}