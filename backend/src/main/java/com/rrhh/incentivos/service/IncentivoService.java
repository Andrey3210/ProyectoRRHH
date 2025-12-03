package com.rrhh.incentivos.service;

import com.rrhh.incentivos.dto.BonoResumenDTO;
import com.rrhh.incentivos.dto.DashboardAdminDTO;
import com.rrhh.incentivos.dto.DetalleEvidenciaDTO;
import com.rrhh.incentivos.repository.BonoRepository;
import com.rrhh.incentivos.repository.MetaRepository;
import com.rrhh.incentivos.repository.EmpleadoRepository;
import com.rrhh.shared.domain.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncentivoService implements IIncentivoService {

    private final BonoRepository bonoRepository;
    private final MetaRepository metaRepository;
    private final EmpleadoRepository empleadoRepository;

    // --- MÉTODOS DE EMPLEADO ---

    @Override
    @Transactional(readOnly = true)
    public List<BonoResumenDTO> obtenerBonosPorEmpleado(Integer idEmpleado) {
        List<Bono> bonos = bonoRepository.findByEmpleadoIdEmpleado(idEmpleado);
        return bonos.stream().map(this::mapToResumenDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DetalleEvidenciaDTO obtenerDetalleBono(Integer idBono) {
        Bono bono = bonoRepository.findById(idBono)
                .orElseThrow(() -> new RuntimeException("Bono no encontrado"));

        DetalleEvidenciaDTO dto = new DetalleEvidenciaDTO();
        
        if (bono.getEvidencias() != null && !bono.getEvidencias().isEmpty()) {
            Evidencia evidencia = bono.getEvidencias().get(0);
            
            dto.setResumen(evidencia.obtenerResumen());
            dto.setTipoEvidencia(evidencia.getTipoEvidencia().toString());

            if (evidencia instanceof EvidenciaVenta) {
                EvidenciaVenta venta = (EvidenciaVenta) evidencia;
                dto.setIdBoleta(venta.getIdBoleta());
                dto.setMontoVendido(venta.getMontoVendido());
            } else if (evidencia instanceof EvidenciaAtencion) {
                EvidenciaAtencion atencion = (EvidenciaAtencion) evidencia;
                dto.setIdTicket(atencion.getIdTicket());
                dto.setSatisfaccionCliente(atencion.getEstadoTicket()); 
            }
        } else {
            dto.setResumen("Sin evidencia adjunta");
        }

        return dto;
    }

    // --- NUEVO: MÉTODO DASHBOARD ADMIN ---

    @Override
    @Transactional(readOnly = true)
    public DashboardAdminDTO obtenerDatosDashboard(String periodo) {
        DashboardAdminDTO dto = new DashboardAdminDTO();

        // 1. Total a Pagar (Card 1)
        BigDecimal total = bonoRepository.sumMontoTotalPorPeriodo(periodo);
        dto.setTotalPagar(total != null ? total : BigDecimal.ZERO);

        // 2. Pendientes de Revisión (Card 2)
        // Usamos el Enum EstadoBono.PENDIENTE
        dto.setPendientesRevision(bonoRepository.countByEstado(EstadoBono.PENDIENTE));

        // 3. Metas Cumplidas % (Card 3)
        long metasCumplidas = metaRepository.countMetasCumplidas(periodo);
        long totalMetas = metaRepository.countByPeriodo(periodo);
        
        if (totalMetas > 0) {
            double porcentaje = (double) metasCumplidas / totalMetas * 100;
            // Redondear a 2 decimales
            dto.setPorcentajeMetasCumplidas(Math.round(porcentaje * 100.0) / 100.0);
        } else {
            dto.setPorcentajeMetasCumplidas(0.0);
        }

        // 4. Empleados Activos (Card 4)
        // Usamos el repositorio compartido de empleados
        dto.setEmpleadosActivos(empleadoRepository.countByEstado("ACTIVO"));

        // 5. Gráficos (Datos Mockeados/Simulados para visualización inicial)
        // "Evolución Semestral" - Llenamos con ceros o el total actual como ejemplo
        dto.setEvolucionSemestral(List.of(
            new BigDecimal("38000"), new BigDecimal("41000"), new BigDecimal("39500"),
            new BigDecimal("42000"), new BigDecimal("44000"), total != null ? total : BigDecimal.ZERO
        ));

        // "Presupuesto por Área"
        dto.setPresupuestoPorArea(Map.of(
            "Ventas", new BigDecimal("25000"), 
            "Atención al Cliente", new BigDecimal("15000"),
            "Recursos Humanos", new BigDecimal("5280")
        ));

        return dto;
    }

    // --- MAPPERS PRIVADOS ---

    private BonoResumenDTO mapToResumenDTO(Bono bono) {
        BonoResumenDTO dto = new BonoResumenDTO();
        dto.setIdBono(bono.getIdBono());
        dto.setConcepto(bono.getRegla() != null ? bono.getRegla().getNombreRegla() : "Bono Manual");
        dto.setFecha(bono.getFechaCalculo() != null ? bono.getFechaCalculo().toString() : "Pendiente");
        dto.setEstado(bono.getEstado() != null ? bono.getEstado().toString() : "PENDIENTE");
        dto.setMonto(bono.getMonto());
        
        dto.setTipo("DINERO"); 
        
        if (bono.getEvidencias() != null && !bono.getEvidencias().isEmpty()) {
            dto.setEvidenciaNombre(bono.getEvidencias().get(0).obtenerResumen());
        } else {
            dto.setEvidenciaNombre("N/A");
        }
        
        return dto;
    }
}