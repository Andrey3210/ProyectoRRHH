package com.rrhh.gestionEmpleados.mapper;

import com.rrhh.gestionEmpleados.dto.EmpleadoExternoDTO;
import com.rrhh.gestionEmpleados.dto.EmpleadoResponse;
import com.rrhh.gestionEmpleados.dto.EmpleadoRequest;
import com.rrhh.gestionEmpleados.model.Empleado;
import java.time.LocalDateTime;

public class EmpleadoMapper {

    public static EmpleadoExternoDTO toExternoDTO(Empleado empleado) {
        EmpleadoExternoDTO dto = new EmpleadoExternoDTO();

        dto.setIdEmpleado(empleado.getId_empleado());
        dto.setCodigoEmpleado(empleado.getCodigo_empleado());

        dto.setNombreCompleto(
                empleado.getNombres() + " " +
                        empleado.getApellido_paterno() + " " +
                        empleado.getApellido_materno()
        );

        dto.setDocumentoIdentidad(empleado.getDocumento_identidad());
        dto.setTipoDocumento(empleado.getTipo_documento());
        dto.setEmail(empleado.getEmail());
        dto.setTelefono(empleado.getTelefono());

        dto.setEstado(empleado.getEstado().name());

        return dto;
    }

    public static EmpleadoResponse toResponse(Empleado emp) {
        EmpleadoResponse dto = new EmpleadoResponse();

        dto.setIdEmpleado(emp.getId_empleado());
        dto.setIdUsuario(emp.getId_usuario());
        dto.setIdPostulante(emp.getId_postulante());
        dto.setCodigoEmpleado(emp.getCodigo_empleado());

        dto.setNombres(emp.getNombres());
        dto.setApellidoPaterno(emp.getApellido_paterno());
        dto.setApellidoMaterno(emp.getApellido_materno());

        dto.setDocumentoIdentidad(emp.getDocumento_identidad());
        dto.setTipoDocumento(emp.getTipo_documento());
        dto.setFechaNacimiento(emp.getFecha_nacimiento());

        dto.setGenero(emp.getGenero());
        dto.setEstadoCivil(emp.getEstado_civil());
        dto.setNacionalidad(emp.getNacionalidad());

        dto.setDireccion(emp.getDireccion());

        dto.setTelefono(emp.getTelefono());
        dto.setEmail(emp.getEmail());
        dto.setEmailCorporativo(emp.getEmail_corporativo());

        dto.setFechaIngreso(emp.getFecha_ingreso());
        dto.setFechaCese(emp.getFecha_cese());
        dto.setEstado(emp.getEstado().name());

        dto.setTipoContrato(emp.getTipo_contrato());
        dto.setModalidadTrabajo(emp.getModalidad_trabajo());

        dto.setFechaCreacion(emp.getFecha_creacion());
        dto.setFechaActualizacion(emp.getFecha_actualizacion());

        return dto;
    }

    public static void updateEntity(Empleado emp, EmpleadoRequest dto) {

        emp.setId_usuario(dto.getIdUsuario());
        emp.setId_postulante(dto.getIdPostulante());
        emp.setCodigo_empleado(dto.getCodigoEmpleado());

        emp.setNombres(dto.getNombres());
        emp.setApellido_paterno(dto.getApellidoPaterno());
        emp.setApellido_materno(dto.getApellidoMaterno());

        emp.setDocumento_identidad(dto.getDocumentoIdentidad());
        emp.setTipo_documento(dto.getTipoDocumento());
        emp.setFecha_nacimiento(dto.getFechaNacimiento());

        emp.setGenero(dto.getGenero());
        emp.setEstado_civil(dto.getEstadoCivil());
        emp.setNacionalidad(dto.getNacionalidad());

        emp.setDireccion(dto.getDireccion());

        emp.setTelefono(dto.getTelefono());
        emp.setEmail(dto.getEmail());
        emp.setEmail_corporativo(dto.getEmailCorporativo());

        emp.setFecha_ingreso(dto.getFechaIngreso());
        emp.setFecha_cese(dto.getFechaCese());

        emp.setEstado(Empleado.EstadoEmpleado.valueOf(dto.getEstado()));
        emp.setTipo_contrato(dto.getTipoContrato());
        emp.setModalidad_trabajo(dto.getModalidadTrabajo());

        emp.setFecha_actualizacion(LocalDateTime.now());
    }
}