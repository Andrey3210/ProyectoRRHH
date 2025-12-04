package com.rrhh.incentivos.service;

import com.rrhh.incentivos.domain.model.Bono;
import com.rrhh.incentivos.domain.model.EmpleadoInc;
import com.rrhh.incentivos.domain.model.EstadoBono;
import com.rrhh.incentivos.domain.model.Evidencia;
import com.rrhh.incentivos.domain.model.EvidenciaAtencion;
import com.rrhh.incentivos.domain.model.EvidenciaVenta;
import com.rrhh.incentivos.domain.model.Meta;
import com.rrhh.incentivos.domain.model.ReglaIncentivo;
import com.rrhh.incentivos.dto.*;
import com.rrhh.incentivos.pattern.FabricaIncentivos; 
import com.rrhh.incentivos.repository.BonoRepository;
import com.rrhh.incentivos.repository.MetaRepository;
import com.rrhh.incentivos.repository.ReglaIncentivoRepository;
import com.rrhh.incentivos.repository.EmpleadoRepository;
import com.rrhh.shared.domain.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncentivoService implements IIncentivoService {

    private final BonoRepository bonoRepository;
    private final MetaRepository metaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ReglaIncentivoRepository reglaIncentivoRepository;
    
    // INYECCIÓN DEL PATRÓN ABSTRACT FACTORY
    // Spring inyecta automáticamente los beans "VENTAS" y "ATENCION" en este mapa
    private final Map<String, FabricaIncentivos> fabricas;

    // =========================================================================
    //                            MÓDULO EMPLEADO
    // =========================================================================

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
            // Usamos el discriminador para saber el tipo (instanceof sigue funcionando correctamente)
            if (evidencia instanceof EvidenciaVenta) {
                dto.setTipoEvidencia("VENTA");
                EvidenciaVenta venta = (EvidenciaVenta) evidencia;
                dto.setIdBoleta(venta.getIdBoleta());
                dto.setMontoVendido(venta.getMontoVendido());
            } else if (evidencia instanceof EvidenciaAtencion) {
                dto.setTipoEvidencia("ATENCION");
                EvidenciaAtencion atencion = (EvidenciaAtencion) evidencia;
                dto.setIdTicket(atencion.getIdTicket());
                dto.setSatisfaccionCliente(atencion.getEstadoTicket()); 
            }
        } else {
            dto.setResumen("Sin evidencia adjunta");
        }

        return dto;
    }
    
    @Override
    @Transactional(readOnly = true)
    public DashboardEmpleadoDTO obtenerDashboardEmpleado(Integer idEmpleado, String periodo) {
        DashboardEmpleadoDTO dto = new DashboardEmpleadoDTO();
        
        EmpleadoInc empleado = empleadoRepository.findById(idEmpleado)
            .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
        
        // Obtener área del puesto actual
        String area = "General";
        if (empleado.getPuesto() != null) {
            area = empleado.getPuesto().getDepartamento();
        }
        dto.setSaludo("Hola, " + empleado.getNombres() + " (" + area + ")");
        dto.setPeriodo(periodo);

        // Calcular Acumulado
        List<Bono> bonosPeriodo = bonoRepository.findByEmpleadoIdEmpleadoAndPeriodo(idEmpleado, periodo);
        BigDecimal totalAcumulado = bonosPeriodo.stream()
            .map(Bono::getMonto)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        dto.setMontoAcumulado(totalAcumulado);
        dto.setEstadoCierre("Pendiente de Cierre");
        
        if (totalAcumulado.compareTo(new BigDecimal("1000")) > 0) {
            dto.setMensajeMotivacional("¡Excelente ritmo! Estás entre los mejores del equipo.");
        } else {
            dto.setMensajeMotivacional("Sigue esforzándote para alcanzar tus metas del mes.");
        }

        // Metas
        List<Meta> metas = metaRepository.findByEmpleadoIdEmpleadoAndPeriodo(idEmpleado, periodo)
                                        .map(List::of)
                                        .orElse(new ArrayList<>());
        
        List<DashboardEmpleadoDTO.MetaProgresoItem> itemsMeta = new ArrayList<>();
        for (Meta m : metas) {
            DashboardEmpleadoDTO.MetaProgresoItem item = new DashboardEmpleadoDTO.MetaProgresoItem();
            // CORRECCIÓN: Usamos getNombreMeta() ya que getTipoMeta() fue eliminado
            item.setTitulo(m.getNombreMeta() != null ? m.getNombreMeta() : "Meta Asignada");
            
            double actual = m.getValorActual() != null ? m.getValorActual().doubleValue() : 0.0;
            double objetivo = m.getValorObjetivo() != null ? m.getValorObjetivo().doubleValue() : 0.0;
            int porcentaje = (objetivo > 0) ? (int)((actual / objetivo) * 100) : 0;
            
            item.setPorcentaje(Math.min(porcentaje, 100));
            item.setSubtitulo("Has logrado " + m.getValorActual() + " de " + m.getValorObjetivo());
            
            if (porcentaje >= 100) {
                item.setMensajeEstado("¡Meta cumplida! Bono asegurado.");
                item.setColorEstado("success");
            } else {
                BigDecimal faltante = m.getValorObjetivo().subtract(m.getValorActual());
                item.setMensajeEstado("¡Faltan " + faltante + " para cumplir la meta!");
                item.setColorEstado("primary");
            }
            itemsMeta.add(item);
        }
        dto.setMisMetas(itemsMeta);

        // Últimos Logros
        List<Bono> ultimosBonos = bonoRepository.findTop5ByEmpleadoIdEmpleadoOrderByFechaCalculoDesc(idEmpleado);
        List<DashboardEmpleadoDTO.LogroItem> itemsLogro = ultimosBonos.stream().map(b -> {
            DashboardEmpleadoDTO.LogroItem item = new DashboardEmpleadoDTO.LogroItem();
            String concepto = (b.getRegla() != null) ? b.getRegla().getNombreRegla() : "Bono Extra";
            item.setTitulo("Te ganaste el bono '" + concepto + "'");
            item.setFecha(b.getFechaCalculo() != null ? b.getFechaCalculo().toString() : ""); 
            item.setIcono("TROFEO");
            return item;
        }).collect(Collectors.toList());
        dto.setUltimosLogros(itemsLogro);

        return dto;
    }

    // =========================================================================
    //                          MÓDULO ADMIN - DASHBOARD
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public DashboardAdminDTO obtenerDatosDashboard(String periodo) {
        DashboardAdminDTO dto = new DashboardAdminDTO();

        BigDecimal total = bonoRepository.sumMontoTotalPorPeriodo(periodo);
        // Manejo defensivo de valores nulos
        dto.setTotalPagar(total != null ? total : BigDecimal.ZERO);

        // CORRECCIÓN: Eliminamos el casteo (int) porque el DTO espera Long
        dto.setPendientesRevision(bonoRepository.countByEstado(EstadoBono.PENDIENTE));

        long metasCumplidas = metaRepository.countMetasCumplidas(periodo);
        long totalMetas = metaRepository.countByPeriodo(periodo);
        
        if (totalMetas > 0) {
            double porcentaje = (double) metasCumplidas / totalMetas * 100;
            dto.setPorcentajeMetasCumplidas(Math.round(porcentaje * 100.0) / 100.0);
        } else {
            dto.setPorcentajeMetasCumplidas(0.0);
        }

        dto.setEmpleadosActivos(empleadoRepository.countByEstado("ACTIVO"));

        dto.setEvolucionSemestral(List.of(
            new BigDecimal("38000"), new BigDecimal("41000"), new BigDecimal("39500"),
            new BigDecimal("42000"), new BigDecimal("44000"), total != null ? total : BigDecimal.ZERO
        ));

        // CAMBIO: Usamos HashMap estándar para evitar problemas de compatibilidad o inmutabilidad
        Map<String, BigDecimal> presupuesto = new HashMap<>();
        presupuesto.put("Ventas", new BigDecimal("25000"));
        presupuesto.put("Atención al Cliente", new BigDecimal("15000"));
        presupuesto.put("Recursos Humanos", new BigDecimal("5280"));
        
        dto.setPresupuestoPorArea(presupuesto);

        return dto;
    }

    // =========================================================================
    //                        MÓDULO ADMIN - REGLAS DE NEGOCIO
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public List<ReglaAdminDTO> listarReglasPorCategoria(String categoria) {
        List<ReglaIncentivo> reglas = reglaIncentivoRepository.findByCategoria(categoria);
        return reglas.stream().map(this::mapToReglaAdminDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void crearNuevaRegla(ReglaCreateDTO dto) {
        FabricaIncentivos fabrica = fabricas.get(dto.getCategoria());
        if (fabrica == null) {
            fabrica = fabricas.get("VENTAS");
        }

        ReglaIncentivo regla = fabrica.crearRegla();

        // Configuración común
        regla.setNombreRegla(dto.getNombre());
        regla.setPeriodo(dto.getFrecuencia());
        regla.setActivo(true); 

        String condicionLogica = dto.getMetrica() + " " + dto.getOperador() + " " + dto.getValorObjetivo();
        regla.setCondicion(condicionLogica);

        if ("ESPECIE".equalsIgnoreCase(dto.getTipoRecompensa())) {
            regla.setTipoValor("ESPECIE");
            regla.setDescripcionRecompensa(dto.getDescripcionRegalo());
            regla.setValorCalculo(BigDecimal.ZERO);
        } else {
            if ("PORCENTAJE".equalsIgnoreCase(dto.getTipoCalculo())) {
                regla.setTipoValor("PORCENTAJE");
            } else {
                regla.setTipoValor("FIJO");
            }
            regla.setValorCalculo(dto.getMonto());
            regla.setDescripcionRecompensa(null);
        }

        reglaIncentivoRepository.save(regla);
    }

    @Override
    @Transactional
    public void cambiarEstadoRegla(Integer idRegla, boolean nuevoEstado) {
        ReglaIncentivo regla = reglaIncentivoRepository.findById(idRegla)
            .orElseThrow(() -> new RuntimeException("Regla no encontrada"));
        regla.setActivo(nuevoEstado);
        reglaIncentivoRepository.save(regla);
    }
    
    @Override
    @Transactional
    public void eliminarRegla(Integer idRegla) {
        reglaIncentivoRepository.deleteById(idRegla);
    }

    // =========================================================================
    //                        MÓDULO ADMIN - METAS DEL PERIODO
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public ResumenMetasDTO obtenerResumenMetas(String departamento, String periodo) {
        ResumenMetasDTO resumen = new ResumenMetasDTO();

        // Traducción de nombres para consulta en BD
        String nombreDptoBd = departamento;
        if ("VENTAS".equalsIgnoreCase(departamento)) {
            nombreDptoBd = "Comercial";
        } else if ("ATENCION".equalsIgnoreCase(departamento) || "ATENCIÓN".equalsIgnoreCase(departamento)) {
            nombreDptoBd = "Servicio al Cliente";
        }

        Meta metaGlobal = metaRepository.findMetaGlobal(nombreDptoBd, periodo).orElse(null);
        resumen.setMetaGlobalObjetivo(metaGlobal != null ? metaGlobal.getValorObjetivo() : BigDecimal.ZERO);

        // Obtenemos metas individuales
        List<Meta> metasIndividuales = metaRepository.findMetasIndividuales(nombreDptoBd, periodo);
        
        BigDecimal sumaAsignada = BigDecimal.ZERO;
        BigDecimal sumaAvance = BigDecimal.ZERO;
        List<MetaEmpleadoDTO> listaDTOs = new ArrayList<>();

        for (Meta metaIndiv : metasIndividuales) {
            MetaEmpleadoDTO dto = new MetaEmpleadoDTO();
            EmpleadoInc emp = metaIndiv.getEmpleado();
            
            dto.setIdMeta(metaIndiv.getIdMeta());
            dto.setIdEmpleado(emp.getIdEmpleado());
            dto.setNombreEmpleado(emp.getNombreCompleto());
            dto.setCargo(emp.getPuesto() != null ? emp.getPuesto().getNombrePuesto() : "N/A");
            dto.setAvatar(emp.getNombres().substring(0,1) + emp.getApellidoPaterno().substring(0,1));
            
            dto.setMetaObjetivo(metaIndiv.getValorObjetivo());
            dto.setAvanceActual(metaIndiv.getValorActual());
            
            if (metaIndiv.getValorObjetivo() != null && metaIndiv.getValorObjetivo().compareTo(BigDecimal.ZERO) > 0) {
                double pct = metaIndiv.getValorActual().doubleValue() / metaIndiv.getValorObjetivo().doubleValue() * 100;
                dto.setPorcentajeAvance(Math.min(pct, 100.0));
            } else {
                dto.setPorcentajeAvance(0.0);
            }
            
            dto.setEstado(dto.getPorcentajeAvance() >= 100 ? "Cumplida" : "En Curso");

            sumaAsignada = sumaAsignada.add(metaIndiv.getValorObjetivo());
            sumaAvance = sumaAvance.add(metaIndiv.getValorActual());
            
            listaDTOs.add(dto);
        }

        resumen.setEmpleados(listaDTOs);
        resumen.setSumaAsignada(sumaAsignada);

        if (resumen.getMetaGlobalObjetivo().compareTo(BigDecimal.ZERO) > 0) {
            double pctEquipo = sumaAvance.doubleValue() / resumen.getMetaGlobalObjetivo().doubleValue() * 100;
            resumen.setPorcentajeAvanceEquipo(Math.round(pctEquipo * 10.0) / 10.0);
        } else {
            resumen.setPorcentajeAvanceEquipo(0.0);
        }

        return resumen;
    }

    @Override
    @Transactional
    public void asignarMetaEmpleado(MetaAsignacionDTO dto) {
        EmpleadoInc empleado = empleadoRepository.findById(dto.getIdEmpleado())
            .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        Meta meta = metaRepository.findByEmpleadoIdEmpleadoAndPeriodo(dto.getIdEmpleado(), dto.getPeriodo())
            .orElse(null);

        if (meta == null) {
            String deptoKey = "VENTAS"; 
            if (empleado.getPuesto() != null) {
                String dpto = empleado.getPuesto().getDepartamento();
                if (dpto != null && (dpto.toUpperCase().contains("ATENCION") || dpto.toUpperCase().contains("CLIENTE"))) {
                    deptoKey = "ATENCION";
                }
            }
            
            FabricaIncentivos fabrica = fabricas.get(deptoKey);
            if (fabrica == null) fabrica = fabricas.get("VENTAS");

            meta = fabrica.crearMeta(); 

            meta.setEmpleado(empleado);
            meta.setPeriodo(dto.getPeriodo());
            meta.setValorActual(BigDecimal.ZERO);
            meta.setFechaInicio(java.time.LocalDate.now());
            meta.setFechaFin(java.time.LocalDate.now().plusMonths(1));
            
            if (empleado.getPuesto() != null) {
                meta.setIdDepartamento(empleado.getPuesto().getDepartamento());
            }
        }

        meta.setNombreMeta(dto.getTipoMeta()); 
        meta.setValorObjetivo(dto.getValorObjetivo());

        metaRepository.save(meta);
    }

    // =========================================================================
    //                        MÓDULO ADMIN - APROBACIONES
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public PantallaAprobacionDTO obtenerDataAprobaciones(String periodo) {
        PantallaAprobacionDTO data = new PantallaAprobacionDTO();

        BigDecimal total = bonoRepository.sumTotalPeriodo(periodo);
        BigDecimal aprobados = bonoRepository.sumMontoPorPeriodoYEstado(periodo, EstadoBono.APROBADO);
        BigDecimal pendientes = bonoRepository.sumMontoPorPeriodoYEstado(periodo, EstadoBono.PENDIENTE);

        data.setTotalBolsa(total != null ? total : BigDecimal.ZERO);
        data.setYaAprobado(aprobados != null ? aprobados : BigDecimal.ZERO);
        data.setPorAprobar(pendientes != null ? pendientes : BigDecimal.ZERO);

        List<Bono> listaBonos = bonoRepository.findPendientesPorPeriodo(periodo);
        
        List<BonoAprobacionDTO> filas = listaBonos.stream()
            .map(this::mapToBonoAprobacionDTO)
            .collect(Collectors.toList());
            
        data.setBonos(filas);

        return data;
    }

    @Override
    @Transactional
    public void aprobarBono(Integer idBono) {
        Bono bono = bonoRepository.findById(idBono)
            .orElseThrow(() -> new RuntimeException("Bono no encontrado"));
        bono.setEstado(EstadoBono.APROBADO);
        bonoRepository.save(bono);
    }

    @Override
    @Transactional
    public void rechazarBono(Integer idBono) {
        Bono bono = bonoRepository.findById(idBono)
            .orElseThrow(() -> new RuntimeException("Bono no encontrado"));
        bono.setEstado(EstadoBono.RECHAZADO);
        bonoRepository.save(bono);
    }

    @Override
    @Transactional
    public void aprobarMasivo(List<Integer> idsBonos) {
        List<Bono> bonos = bonoRepository.findAllById(idsBonos);
        bonos.forEach(b -> b.setEstado(EstadoBono.APROBADO));
        bonoRepository.saveAll(bonos);
    }

    // =========================================================================
    //                        MÓDULO ADMIN - REPORTES
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public ReporteIncentivosDTO generarReporteAnual(String anio) {
        ReporteIncentivosDTO reporte = new ReporteIncentivosDTO();
        
        List<Bono> bonosAnio = bonoRepository.findByAnio(anio);

        List<String> meses = List.of("Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic");
        List<BigDecimal> dataVentas = new ArrayList<>();
        List<BigDecimal> dataAtencion = new ArrayList<>();

        for (int i = 0; i < 12; i++) {
            dataVentas.add(BigDecimal.ZERO);
            dataAtencion.add(BigDecimal.ZERO);
        }

        for (Bono b : bonosAnio) {
            int indiceMes = obtenerIndiceMes(b.getPeriodo());
            if (indiceMes >= 0 && indiceMes < 12) {
                // Usamos la fábrica o la categoría de la regla para determinar el tipo
                boolean esVenta = false;
                if (b.getRegla() != null && "VENTAS".equalsIgnoreCase(b.getRegla().getCategoria())) {
                    esVenta = true;
                }
                
                if (esVenta) {
                    dataVentas.set(indiceMes, dataVentas.get(indiceMes).add(b.getMonto()));
                } else {
                    dataAtencion.set(indiceMes, dataAtencion.get(indiceMes).add(b.getMonto()));
                }
            }
        }

        reporte.setEtiquetasMeses(meses);
        reporte.setDataVentas(dataVentas);
        reporte.setDataAtencion(dataAtencion);

        Map<String, List<Bono>> bonosPorPeriodo = bonosAnio.stream()
            .collect(Collectors.groupingBy(Bono::getPeriodo));

        List<ReporteIncentivosDTO.FilaReporteDTO> filas = new ArrayList<>();

        bonosPorPeriodo.forEach((periodo, listaBonos) -> {
            ReporteIncentivosDTO.FilaReporteDTO fila = new ReporteIncentivosDTO.FilaReporteDTO();
            fila.setPeriodo(periodo);
            fila.setConcepto("Nómina Incentivos");
            
            long numBeneficiarios = listaBonos.stream()
                .map(b -> b.getEmpleado().getIdEmpleado())
                .distinct()
                .count();
            fila.setNumBeneficiarios((int) numBeneficiarios);

            BigDecimal total = listaBonos.stream()
                .map(Bono::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            fila.setMontoTotal(total);

            boolean hayPendientes = listaBonos.stream()
                .anyMatch(b -> "PENDIENTE".equals(b.getEstado().toString()));
            fila.setEstadoPago(hayPendientes ? "Pendiente" : "Pagado");

            filas.add(fila);
        });

        filas.sort((f1, f2) -> f2.getPeriodo().compareTo(f1.getPeriodo()));
        reporte.setTablaDetalle(filas);
        return reporte;
    }

    // =========================================================================
    //                            MAPPERS / HELPERS
    // =========================================================================

    private BonoResumenDTO mapToResumenDTO(Bono bono) {
        BonoResumenDTO dto = new BonoResumenDTO();
        dto.setIdBono(bono.getIdBono());
        
        if (bono.getRegla() != null) {
            dto.setConcepto(bono.getRegla().getNombreRegla());
        } else if (bono.getMeta() != null) {
            // CORRECCIÓN: Usamos getNombreMeta() o un default
            String nombreMeta = bono.getMeta().getNombreMeta();
            dto.setConcepto("Bono Meta: " + (nombreMeta != null ? nombreMeta : "General"));
        } else {
            dto.setConcepto("Bono Manual");
        }

        dto.setFecha(bono.getFechaCalculo() != null ? bono.getFechaCalculo().toString() : "N/A");
        dto.setEstado(bono.getEstado() != null ? bono.getEstado().toString() : "PENDIENTE");

        if (bono.getRegla() != null && "ESPECIE".equalsIgnoreCase(bono.getRegla().getTipoValor())) {
            dto.setTipo("ESPECIE");
            dto.setDescripcionPremio(bono.getRegla().getDescripcionRecompensa());
            dto.setMonto(BigDecimal.ZERO);
        } else {
            dto.setTipo("DINERO");
            dto.setMonto(bono.getMonto());
            dto.setDescripcionPremio(null);
        }
        
        if (bono.getEvidencias() != null && !bono.getEvidencias().isEmpty()) {
            dto.setEvidenciaNombre(bono.getEvidencias().get(0).obtenerResumen());
        } else {
            dto.setEvidenciaNombre("Ver Detalle");
        }
        
        return dto;
    }

    private ReglaAdminDTO mapToReglaAdminDTO(ReglaIncentivo entity) {
        ReglaAdminDTO dto = new ReglaAdminDTO();
        dto.setId(entity.getIdRegla());
        dto.setNombre(entity.getNombreRegla());
        dto.setCondicionLogica(entity.getCondicion());
        dto.setPeriodo(entity.getPeriodo());
        dto.setEstado(entity.getActivo());
        dto.setCategoria(entity.getCategoria());

        if (entity.getDescripcionRecompensa() != null && !entity.getDescripcionRecompensa().isEmpty()) {
            dto.setRecompensa("🎁 " + entity.getDescripcionRecompensa());
        } else if ("PORCENTAJE".equals(entity.getTipoValor())) {
            dto.setRecompensa("$ " + entity.getValorCalculo() + "%");
        } else {
            dto.setRecompensa("S/ " + entity.getValorCalculo());
        }

        return dto;
    }

    private BonoAprobacionDTO mapToBonoAprobacionDTO(Bono bono) {
        BonoAprobacionDTO dto = new BonoAprobacionDTO();
        dto.setIdBono(bono.getIdBono());
        dto.setMonto(bono.getMonto());
        dto.setEstado(bono.getEstado().toString());

        dto.setAlertaMonto(bono.getMonto().compareTo(new BigDecimal("10000")) > 0);

        if (bono.getEmpleado() != null) {
            dto.setNombreEmpleado(bono.getEmpleado().getNombreCompleto());
            Puesto puesto = bono.getEmpleado().getPuesto();
            dto.setDepartamento(puesto != null ? puesto.getDepartamento() : "Sin Asignar");
        }

        if (bono.getRegla() != null) {
            dto.setConcepto(bono.getRegla().getNombreRegla());
            dto.setCodigoRef("Regla #" + bono.getRegla().getIdRegla());
        } else if (bono.getMeta() != null) {
            String nombreMeta = bono.getMeta().getNombreMeta();
            dto.setConcepto("Bono por Meta: " + (nombreMeta != null ? nombreMeta : "General"));
            dto.setCodigoRef("Meta #" + bono.getMeta().getIdMeta());
        } else {
            dto.setConcepto("Bono Manual");
            dto.setCodigoRef("N/A");
        }

        if (bono.getEvidencias() != null && !bono.getEvidencias().isEmpty()) {
            dto.setEvidencia(bono.getEvidencias().get(0).obtenerResumen());
        } else {
            dto.setEvidencia("Sin evidencia");
        }

        return dto;
    }

    private int obtenerIndiceMes(String periodo) {
        try {
            if (periodo.contains("-")) {
                String[] parts = periodo.split("-");
                return Integer.parseInt(parts[1]) - 1; 
            }
            return 0; 
        } catch (Exception e) {
            return 0;
        }
    }
}