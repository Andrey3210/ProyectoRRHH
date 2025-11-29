package com.rrhh.reclutamiento.repository;

import com.rrhh.shared.domain.model.PostulanteProceso;
import com.rrhh.shared.domain.enums.EstadoPostulante;
import com.rrhh.shared.domain.enums.EtapaProceso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostulanteProcesoRepository extends JpaRepository<PostulanteProceso, Integer> {
    
    List<PostulanteProceso> findByIdProcesoActual(Integer idProceso);
    
    List<PostulanteProceso> findByEtapaActual(EtapaProceso etapa);
    
    List<PostulanteProceso> findByEstado(EstadoPostulante estado);
    
    @Query("SELECT pp FROM PostulanteProceso pp WHERE " +
           "pp.idProcesoActual = :idProceso AND pp.etapaActual = :etapa")
    List<PostulanteProceso> findByProcesoYEtapa(
        @Param("idProceso") Integer idProceso,
        @Param("etapa") EtapaProceso etapa
    );
    
    @Query("SELECT pp FROM PostulanteProceso pp WHERE " +
           "pp.idProcesoActual IN (SELECT ps.idProceso FROM ProcesoSeleccion ps WHERE ps.idVacante = :idVacante)")
    List<PostulanteProceso> findByVacante(@Param("idVacante") Integer idVacante);
    
    Optional<PostulanteProceso> findByIdProcesoActualAndIdPostulante(Integer idProceso, Integer idPostulante);
}

