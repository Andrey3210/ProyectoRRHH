package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.dto.GesEmpleadoConPuestoDTO;
import com.rrhh.gestionEmpleados.dto.GesEmpleadoRequestDTO;
import com.rrhh.gestionEmpleados.model.GesEmpleado;
import com.rrhh.gestionEmpleados.model.GesEmpleadoPuesto;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoPuestoRepository;
import com.rrhh.gestionEmpleados.repository.GesEmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GesEmpleadoService {

    private final GesEmpleadoRepository empleadoRepository;
    private final GesEmpleadoPuestoRepository empleadoPuestoRepository;

    // ---------- Crear ----------
    public GesEmpleado crear(GesEmpleadoRequestDTO dto) {
        GesEmpleado empleado = new GesEmpleado();

        mapDtoToEntity(dto, empleado);
        empleado.setEstado("ACTIVO");
        empleado.setFechaCreacion(LocalDateTime.now());
        empleado.setFechaActualizacion(LocalDateTime.now());

        return empleadoRepository.save(empleado);
    }

    // ---------- Actualizar ----------
    public GesEmpleado actualizar(Integer idEmpleado, GesEmpleadoRequestDTO dto) {

        GesEmpleado empleado = empleadoRepository.findById(idEmpleado)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        mapDtoToEntity(dto, empleado);
        empleado.setFechaActualizacion(LocalDateTime.now());

        return empleadoRepository.save(empleado);
    }

    // ---------- Obtener uno ----------
    public GesEmpleado obtenerPorId(Integer idEmpleado) {
        return empleadoRepository.findById(idEmpleado)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
    }

    // ---------- Listar ----------
    public List<GesEmpleado> listarTodos() {
        return empleadoRepository.findAll();
    }

    // ---------- Cambiar estado a INACTIVO ----------
    public GesEmpleado inactivar(Integer idEmpleado) {

        GesEmpleado empleado = empleadoRepository.findById(idEmpleado)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        empleado.setEstado("INACTIVO");
        empleado.setFechaActualizacion(LocalDateTime.now());

        return empleadoRepository.save(empleado);
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

        List<GesEmpleadoPuesto> puestosActivos = empleadoPuestoRepository.listarPuestosActivos();

        Map<Integer, GesEmpleadoPuesto> mapPuestos = puestosActivos.stream()
                .collect(Collectors.toMap(
                        ep -> ep.getEmpleado().getIdEmpleado(),
                        ep -> ep,
                        (a, b) -> a // si hubiera duplicados, se queda con el primero
                ));

        return empleados.stream()
                .map(emp -> {
                    GesEmpleadoConPuestoDTO dto = new GesEmpleadoConPuestoDTO();

                    // ------- Datos del empleado -------
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

                    // ------- Puesto actual -------
                    GesEmpleadoPuesto ep = mapPuestos.get(emp.getIdEmpleado());
                    if (ep != null) {
                        var puesto = ep.getPuesto();

                        dto.setIdPuesto(puesto.getIdPuesto());
                        dto.setNombrePuesto(puesto.getNombrePuesto());
                        dto.setDepartamento(puesto.getDepartamento());
                        dto.setArea(puesto.getArea());
                        dto.setNivelJerarquico(puesto.getNivelJerarquico());
                        dto.setSalarioMinimo(puesto.getSalarioMinimo());
                        dto.setSalarioMaximo(puesto.getSalarioMaximo());

                        // ------- Datos de empleado_puesto -------
                        dto.setFechaInicioPuesto(ep.getFechaInicio());
                        dto.setFechaFinPuesto(ep.getFechaFin());
                        dto.setSalarioAsignado(ep.getSalario());
                    }

                    return dto;
                })
                .toList();
    }

    public List<GesEmpleadoConPuestoDTO> listarEmpleadosPorArea(String area) {
        List<GesEmpleado> empleados = empleadoRepository.listarEmpleadosPorArea(area);

        return empleados.stream()
                .map(emp -> obtenerEmpleadoConPuestoDTO(emp.getIdEmpleado()))
                .filter(dto -> dto.getIdPuesto() != null) // seguridad extra
                .toList();
    }

    private void mapDtoToEntity(GesEmpleadoRequestDTO dto, GesEmpleado empleado) {
        empleado.setIdUsuario(dto.getIdUsuario());
        empleado.setIdPostulante(dto.getIdPostulante());
        empleado.setCodigoEmpleado(dto.getCodigoEmpleado());
        empleado.setNombres(dto.getNombres());
        empleado.setApellidoPaterno(dto.getApellidoPaterno());
        empleado.setApellidoMaterno(dto.getApellidoMaterno());
        empleado.setDocumentoIdentidad(dto.getDocumentoIdentidad());
        empleado.setTipoDocumento(dto.getTipoDocumento());
        empleado.setFechaNacimiento(dto.getFechaNacimiento());
        empleado.setGenero(dto.getGenero());
        empleado.setEstadoCivil(dto.getEstadoCivil());
        empleado.setNacionalidad(dto.getNacionalidad());
        empleado.setDireccion(dto.getDireccion());
        empleado.setTelefono(dto.getTelefono());
        empleado.setEmail(dto.getEmail());
        empleado.setEmailCorporativo(dto.getEmailCorporativo());
        empleado.setFechaIngreso(dto.getFechaIngreso());
        empleado.setFechaCese(dto.getFechaCese());
        empleado.setTipoContrato(dto.getTipoContrato());
        empleado.setModalidadTrabajo(dto.getModalidadTrabajo());
    }
}