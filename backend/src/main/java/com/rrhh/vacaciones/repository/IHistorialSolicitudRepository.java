package com.rrhh.vacaciones.repository;

import com.rrhh.vacaciones.model.HistorialSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IHistorialSolicitudRepository extends JpaRepository<HistorialSolicitud, Integer> {

    // Para el comando: VerHistorial
    // Recupera todo el historial de una solicitud ordenado por fecha (el más reciente primero)
    List<HistorialSolicitud> findBySolicitudIdSolicitudOrderByFechaAccionDesc(Integer idSolicitud);
}