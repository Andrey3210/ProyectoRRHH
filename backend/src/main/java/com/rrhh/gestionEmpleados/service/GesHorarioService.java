package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.dto.GesAsignarHorarioRequest;
import com.rrhh.gestionEmpleados.dto.GesEmpleadoConHorarioDTO;
import com.rrhh.gestionEmpleados.model.GesEmpleado;
import com.rrhh.gestionEmpleados.model.GesEmpleadoHorario;
import com.rrhh.gestionEmpleados.model.GesHorario;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoHorarioRepository;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoRepository;
import com.rrhh.gestionEmpleados.repository.GesHorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GesHorarioService {

    private final GesEmpleadoHorarioRepository empleadoHorarioRepo;
    private final GesHorarioRepository horarioRepository;
    private final GesEmpleadoRepository empleadoRepository;

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

    public GesEmpleadoHorario asignarHorario(GesAsignarHorarioRequest request) {
        GesEmpleado empleado = empleadoRepository.findById(request.getIdEmpleado())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        GesHorario horario = horarioRepository.findById(request.getIdHorario())
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        // Verificar si ya tiene un horario activo
        boolean tieneActivo = empleadoHorarioRepo.existsByEmpleadoIdEmpleadoAndActivoTrue(empleado.getIdEmpleado());
        if (tieneActivo) {
            throw new RuntimeException("El empleado ya tiene un horario activo");
        }

        GesEmpleadoHorario empHorario = new GesEmpleadoHorario();
        empHorario.setEmpleado(empleado);
        empHorario.setHorario(horario);
        empHorario.setFechaInicio(LocalDate.now());
        empHorario.setActivo(true);
        empHorario.setFechaAsignacion(LocalDateTime.now());

        return empleadoHorarioRepo.save(empHorario);
    }

    public GesEmpleadoHorario actualizarHorario(GesAsignarHorarioRequest request) {
        GesEmpleado empleado = empleadoRepository.findById(request.getIdEmpleado())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        GesHorario horario = horarioRepository.findById(request.getIdHorario())
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        // Usar query personalizada para obtener horario activo
        GesEmpleadoHorario actualActivo = empleadoHorarioRepo.obtenerHorariosEmpleadoActivo(empleado.getIdEmpleado());

        if (actualActivo != null) {
            actualActivo.setActivo(false);
            actualActivo.setFechaFin(LocalDate.now());
            empleadoHorarioRepo.save(actualActivo);
        }

        GesEmpleadoHorario nuevoHorario = new GesEmpleadoHorario();
        nuevoHorario.setEmpleado(empleado);
        nuevoHorario.setHorario(horario);
        nuevoHorario.setFechaInicio(LocalDate.now());
        nuevoHorario.setActivo(true);
        nuevoHorario.setFechaAsignacion(LocalDateTime.now());

        return empleadoHorarioRepo.save(nuevoHorario);
    }
}