package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.dto.GesEmpleadoConPuestoDTO;
import com.rrhh.gestionEmpleados.model.GesEmpleado;
import com.rrhh.gestionEmpleados.model.GesEmpleadoPuesto;
import com.rrhh.gestionEmpleados.model.GesPuesto;
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

    public GesEmpleadoConPuestoDTO obtenerEmpleadoConPuestoDTO(Integer idEmpleado) {
        GesEmpleado empleado = empleadoRepository.findById(idEmpleado).orElse(null);
        GesEmpleadoPuesto empPuesto = empleadoPuestoRepository.obtenerPuestoActual(idEmpleado);

        if (empleado == null) return null;

        GesEmpleadoConPuestoDTO dto = new GesEmpleadoConPuestoDTO();

        // ------- datos del empleado -------
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

        // Si no hay puesto, devolver solo los datos del empleado
        if (empPuesto == null) return dto;

        // ------- datos del puesto -------
        var puesto = empPuesto.getPuesto();
        dto.setIdPuesto(puesto.getIdPuesto());
        dto.setNombrePuesto(puesto.getNombrePuesto());
        dto.setDepartamento(puesto.getDepartamento());
        dto.setArea(puesto.getArea());
        dto.setNivelJerarquico(puesto.getNivelJerarquico());
        dto.setSalarioMinimo(puesto.getSalarioMinimo());
        dto.setSalarioMaximo(puesto.getSalarioMaximo());

        // ------- datos del empleado_puesto -------
        dto.setFechaInicioPuesto(empPuesto.getFechaInicio());
        dto.setFechaFinPuesto(empPuesto.getFechaFin());
        dto.setSalarioAsignado(empPuesto.getSalario());

        return dto;
    }

    public List<GesEmpleadoConPuestoDTO> listarEmpleadosConPuestoActual() {

        List<GesEmpleado> empleados = empleadoRepository.listarEmpleadosConPuestoActual();

        return empleados.stream()
                .map(emp -> obtenerEmpleadoConPuestoDTO(emp.getIdEmpleado()))
                .filter(dto -> dto.getIdPuesto() != null) // evita nulos
                .toList();
    }
}