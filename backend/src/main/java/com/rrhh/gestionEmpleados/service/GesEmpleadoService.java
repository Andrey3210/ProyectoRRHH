package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.dto.GesEmpleadoConPuestoDTO;
import com.rrhh.gestionEmpleados.model.GesEmpleado;
import com.rrhh.gestionEmpleados.model.GesEmpleadoPuesto;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoPuestoRepository;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GesEmpleadoService {

    private final GesEmpleadoRepository empleadoRepository;
    private final GesEmpleadoPuestoRepository empleadoPuestoRepository;

    public GesEmpleadoService(GesEmpleadoRepository empleadoRepository, GesEmpleadoPuestoRepository empleadoPuestoRepository) {
        this.empleadoRepository = empleadoRepository;
        this.empleadoPuestoRepository = empleadoPuestoRepository;
    }

    public List<GesEmpleado> listarTodos() {
        return empleadoRepository.findAll();
    }

    public List<GesEmpleadoConPuestoDTO> listarEmpleadosConPuestoActual() {

        return empleadoRepository.findAll().stream()
                .map(empleado -> {
                    GesEmpleadoPuesto ep = empleadoPuestoRepository.obtenerPuestoActual(empleado.getIdEmpleado());

                    GesEmpleadoConPuestoDTO dto = new GesEmpleadoConPuestoDTO();

                    // ---------- Datos del empleado ----------
                    dto.setIdEmpleado(empleado.getIdEmpleado());
                    dto.setCodigoEmpleado(empleado.getCodigoEmpleado());
                    dto.setNombres(empleado.getNombres());
                    dto.setApellidoPaterno(empleado.getApellidoPaterno());
                    dto.setApellidoMaterno(empleado.getApellidoMaterno());
                    dto.setDocumentoIdentidad(empleado.getDocumentoIdentidad());
                    dto.setTipoDocumento(empleado.getTipoDocumento());
                    dto.setFechaNacimiento(empleado.getFechaNacimiento());
                    dto.setGenero(empleado.getGenero());
                    dto.setEstadoCivil(empleado.getEstadoCivil());
                    dto.setNacionalidad(empleado.getNacionalidad());
                    dto.setDireccion(empleado.getDireccion());
                    dto.setTelefono(empleado.getTelefono());
                    dto.setEmail(empleado.getEmail());
                    dto.setEmailCorporativo(empleado.getEmailCorporativo());
                    dto.setFechaIngreso(empleado.getFechaIngreso());
                    dto.setFechaCese(empleado.getFechaCese());
                    dto.setEstado(empleado.getEstado());
                    dto.setTipoContrato(empleado.getTipoContrato());
                    dto.setModalidadTrabajo(empleado.getModalidadTrabajo());

                    // ---------- Datos del puesto actual ----------
                    if (ep != null) {
                        dto.setIdPuesto(ep.getPuesto().getIdPuesto());
                        dto.setNombrePuesto(ep.getPuesto().getNombrePuesto());
                        dto.setDepartamento(ep.getPuesto().getDepartamento());
                        dto.setArea(ep.getPuesto().getArea());
                        dto.setNivelJerarquico(ep.getPuesto().getNivelJerarquico());
                        dto.setSalarioMinimo(ep.getPuesto().getSalarioMinimo());
                        dto.setSalarioMaximo(ep.getPuesto().getSalarioMaximo());

                        dto.setFechaInicioPuesto(ep.getFechaInicio());
                        dto.setFechaFinPuesto(ep.getFechaFin());
                        dto.setSalarioAsignado(ep.getSalario());
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }
}