package com.rrhh.gestionEmpleados.mapper;

import com.rrhh.gestionEmpleados.dto.EmpleadoExternoDTO;
import com.rrhh.gestionEmpleados.model.Empleado;

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
}