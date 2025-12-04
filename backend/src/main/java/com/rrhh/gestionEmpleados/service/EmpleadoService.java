package com.rrhh.gestionEmpleados.service;

import com.rrhh.gestionEmpleados.model.Empleado;
import com.rrhh.gestionEmpleados.repository.EmpleadoRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmpleadoService {

    private final EmpleadoRepository repository;

    public EmpleadoService(EmpleadoRepository repository) {
        this.repository = repository;
    }

    public List<Empleado> listarTodos() {
        return repository.findAll();
    }

    public Empleado buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
    }

    public Empleado crear(Empleado emp) {
        emp.setFecha_creacion(LocalDateTime.now());
        emp.setFecha_actualizacion(LocalDateTime.now());
        return repository.save(emp);
    }

    public Empleado actualizar(Integer id, Empleado newData) {
        Empleado emp = buscarPorId(id);

        // copiar campos
        emp.setId_usuario(newData.getId_usuario());
        emp.setId_postulante(newData.getId_postulante());
        emp.setCodigo_empleado(newData.getCodigo_empleado());

        emp.setNombres(newData.getNombres());
        emp.setApellido_paterno(newData.getApellido_paterno());
        emp.setApellido_materno(newData.getApellido_materno());

        emp.setDocumento_identidad(newData.getDocumento_identidad());
        emp.setTipo_documento(newData.getTipo_documento());
        emp.setFecha_nacimiento(newData.getFecha_nacimiento());

        emp.setGenero(newData.getGenero());
        emp.setEstado_civil(newData.getEstado_civil());
        emp.setNacionalidad(newData.getNacionalidad());

        emp.setDireccion(newData.getDireccion());

        emp.setTelefono(newData.getTelefono());
        emp.setEmail(newData.getEmail());
        emp.setEmail_corporativo(newData.getEmail_corporativo());

        emp.setFecha_ingreso(newData.getFecha_ingreso());
        emp.setFecha_cese(newData.getFecha_cese());
        emp.setEstado(newData.getEstado());

        emp.setTipo_contrato(newData.getTipo_contrato());
        emp.setModalidad_trabajo(newData.getModalidad_trabajo());

        emp.setFecha_actualizacion(LocalDateTime.now());

        return repository.save(emp);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}
