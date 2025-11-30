package com.rrhh.reclutamiento.service.impl;

import com.rrhh.reclutamiento.dto.PostulanteRevisionDTO;
import com.rrhh.reclutamiento.repository.PostulanteProcesoRepository;
import com.rrhh.reclutamiento.repository.PostulanteRepository;
import com.rrhh.reclutamiento.repository.PuestoRepository;
import com.rrhh.reclutamiento.service.IRecepcionCVService;
import com.rrhh.shared.domain.enums.EtapaProceso;
import com.rrhh.shared.domain.model.Postulante;
import com.rrhh.shared.domain.model.PostulanteProceso;
import com.rrhh.shared.domain.model.Puesto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicioRecepcionCV implements IRecepcionCVService {

    private final PuestoRepository puestoRepository;
    private final PostulanteProcesoRepository postulanteProcesoRepository;
    private final PostulanteRepository postulanteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Puesto> obtenerPuestosActivos() {
        return puestoRepository.findActivosOrdenados();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostulanteRevisionDTO> obtenerPostulantesRevisionPorPuesto(Integer idPuesto) {
        List<PostulanteProceso> postulantesProceso = postulanteProcesoRepository
                .findByPuestoYEtapa(idPuesto, EtapaProceso.REVISION_CV);

        return postulantesProceso.stream()
                .map(pp -> mapearAPostulanteRevision(pp.getPostulante()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Postulante> obtenerPostulanteConCV(Integer idPostulante) {
        return postulanteRepository.findByIdWithCV(idPostulante)
                .or(() -> postulanteRepository.findById(idPostulante));
    }

    private PostulanteRevisionDTO mapearAPostulanteRevision(Postulante postulante) {
        Integer edad = null;
        if (postulante.getFechaNacimiento() != null) {
            edad = Period.between(postulante.getFechaNacimiento(), LocalDate.now()).getYears();
        }

        return PostulanteRevisionDTO.builder()
                .idPostulante(postulante.getIdPostulante())
                .nombres(postulante.getNombres())
                .apellidoPaterno(postulante.getApellidoPaterno())
                .apellidoMaterno(postulante.getApellidoMaterno())
                .telefono(postulante.getTelefono())
                .email(postulante.getEmail())
                .edad(edad)
                .genero(postulante.getGenero())
                .estadoCivil(postulante.getEstadoCivil())
                .fechaNacimiento(postulante.getFechaNacimiento() != null
                        ? postulante.getFechaNacimiento().toString()
                        : null)
                .direccion(postulante.getDireccion())
                .build();
    }
}
