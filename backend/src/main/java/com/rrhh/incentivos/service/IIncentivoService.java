package com.rrhh.incentivos.service;

import com.rrhh.incentivos.dto.BonoResumenDTO;
import com.rrhh.incentivos.dto.DashboardAdminDTO; // Importante
import com.rrhh.incentivos.dto.DetalleEvidenciaDTO;
import java.util.List;

public interface IIncentivoService {
    
    List<BonoResumenDTO> obtenerBonosPorEmpleado(Integer idEmpleado);
    
    DetalleEvidenciaDTO obtenerDetalleBono(Integer idBono);

    DashboardAdminDTO obtenerDatosDashboard(String periodo);
}