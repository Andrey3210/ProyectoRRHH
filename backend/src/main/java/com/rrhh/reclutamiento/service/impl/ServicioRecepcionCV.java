package com.rrhh.reclutamiento.service.impl;

import com.rrhh.reclutamiento.adapter.CVDataExtractionAdapter;
import com.rrhh.reclutamiento.adapter.model.CVParsedData;
import com.rrhh.reclutamiento.dto.PostulanteRevisionDTO;
import com.rrhh.reclutamiento.dto.ResumenProcesamientoCV;
import com.rrhh.reclutamiento.repository.*;
import com.rrhh.reclutamiento.service.IRecepcionCVService;
import com.rrhh.shared.domain.enums.EtapaProceso;
import com.rrhh.shared.domain.enums.EstadoPostulante;
import com.rrhh.shared.domain.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicioRecepcionCV implements IRecepcionCVService {

    private final PuestoRepository puestoRepository;
    private final PostulanteProcesoRepository postulanteProcesoRepository;
    private final PostulanteRepository postulanteRepository;
    private final FormacionAcademicaRepository formacionAcademicaRepository;
    private final ExperienciaRepository experienciaRepository;
    private final HabilidadRepository habilidadRepository;
    private final PostulanteHabilidadRepository postulanteHabilidadRepository;
    private final CVDataExtractionAdapter cvDataExtractionAdapter;

    @Override
    @Transactional(readOnly = true)
    public List<Puesto> obtenerPuestosActivos() {
        return puestoRepository.findActivosOrdenados();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostulanteRevisionDTO> obtenerPostulantesRevisionPorPuesto(Integer idPuesto) {
        List<PostulanteProceso> postulantesProceso = postulanteProcesoRepository
                .findByPuestoYEtapa(idPuesto, EtapaProceso.REVISION_CV, EstadoPostulante.DESCARTADO);

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

    @Override
    @Transactional
    public List<ResumenProcesamientoCV> procesarCVsPorPuesto(Integer idPuesto) {
        List<PostulanteProceso> postulantesProceso = postulanteProcesoRepository
                .findByPuestoYEtapa(idPuesto, EtapaProceso.REVISION_CV, EstadoPostulante.DESCARTADO);

        List<ResumenProcesamientoCV> resumenes = new ArrayList<>();

        for (PostulanteProceso postulanteProceso : postulantesProceso) {
            Integer idPostulante = postulanteProceso.getPostulante().getIdPostulante();
            Optional<Postulante> postulanteOpt = postulanteRepository.findByIdWithDetalles(idPostulante)
                    .or(() -> postulanteRepository.findById(idPostulante));

            if (postulanteOpt.isEmpty() || postulanteOpt.get().getCv() == null) {
                resumenes.add(ResumenProcesamientoCV.builder()
                        .idPostulante(idPostulante)
                        .formacionesAgregadas(0)
                        .experienciasAgregadas(0)
                        .habilidadesAgregadas(0)
                        .mensaje("Postulante sin CV asociado")
                        .build());
                continue;
            }

            Postulante postulante = postulanteOpt.get();
            CV cv = postulante.getCv();

            CVParsedData datos = cvDataExtractionAdapter.extraerDatos(cv);
            int nuevasFormaciones = registrarFormaciones(postulante, datos.formaciones());
            int nuevasExperiencias = registrarExperiencias(postulante, datos.experiencias());
            int nuevasHabilidades = registrarHabilidades(postulante, datos.habilidades());

            resumenes.add(ResumenProcesamientoCV.builder()
                    .idPostulante(postulante.getIdPostulante())
                    .idCV(cv.getIdCV())
                    .formacionesAgregadas(nuevasFormaciones)
                    .experienciasAgregadas(nuevasExperiencias)
                    .habilidadesAgregadas(nuevasHabilidades)
                    .mensaje("Procesamiento completado")
                    .build());
        }

        return resumenes;
    }

    private int registrarFormaciones(Postulante postulante, List<CVParsedData.ParsedEducation> formaciones) {
        int nuevas = 0;
        for (CVParsedData.ParsedEducation formacion : formaciones) {
            String institucion = formacion.institucion() != null ? formacion.institucion() : "Institución no identificada";
            String carrera = formacion.carrera();
            String nivel = formacion.nivelEstudios() != null ? formacion.nivelEstudios() : "No especificado";
            String situacion = formacion.situacion() != null ? formacion.situacion() : "EN_CURSO";
            LocalDate inicio = formacion.fechaInicio() != null ? formacion.fechaInicio() : LocalDate.now();

            boolean existe = formacionAcademicaRepository.existsByIdPostulanteAndInstitucionAndCarreraAndNivelEstudiosAndSituacion(
                    postulante.getIdPostulante(), institucion, carrera, nivel, situacion
            );

            if (existe) {
                continue;
            }

            FormacionAcademica nuevaFormacion = new FormacionAcademica();
            nuevaFormacion.setIdPostulante(postulante.getIdPostulante());
            nuevaFormacion.setInstitucion(institucion);
            nuevaFormacion.setCarrera(carrera);
            nuevaFormacion.setNivelEstudios(nivel);
            nuevaFormacion.setSituacion(situacion);
            nuevaFormacion.setFechaInicio(inicio);
            nuevaFormacion.setFechaFin(formacion.fechaFin());
            nuevaFormacion.setCursosRelevantes(formacion.cursos());
            nuevaFormacion.setObservaciones(formacion.observaciones());
            nuevaFormacion.setFechaCreacion(LocalDateTime.now());

            formacionAcademicaRepository.save(nuevaFormacion);
            nuevas++;
        }
        return nuevas;
    }

    private int registrarExperiencias(Postulante postulante, List<CVParsedData.ParsedExperience> experiencias) {
        int nuevas = 0;
        for (CVParsedData.ParsedExperience experiencia : experiencias) {
            String empresa = experiencia.empresa() != null ? experiencia.empresa() : "Empresa no indicada";
            String cargo = experiencia.cargo() != null ? experiencia.cargo() : "Cargo no indicado";
            LocalDate inicio = experiencia.fechaInicio() != null ? experiencia.fechaInicio() : LocalDate.now();

            boolean existe = experienciaRepository.existsByIdPostulanteAndEmpresaAndCargoAndFechaInicio(
                    postulante.getIdPostulante(), empresa, cargo, inicio
            );

            if (existe) {
                continue;
            }

            Experiencia nuevaExperiencia = new Experiencia();
            nuevaExperiencia.setIdPostulante(postulante.getIdPostulante());
            nuevaExperiencia.setEmpresa(empresa);
            nuevaExperiencia.setCargo(cargo);
            nuevaExperiencia.setFuncionesPrincipales(experiencia.funciones());
            nuevaExperiencia.setFechaInicio(inicio);
            nuevaExperiencia.setFechaFin(experiencia.fechaFin());
            nuevaExperiencia.setReferenciaContacto(experiencia.referencia());
            nuevaExperiencia.setTelefonoReferencia(experiencia.telefonoReferencia());
            nuevaExperiencia.setFechaCreacion(LocalDateTime.now());

            experienciaRepository.save(nuevaExperiencia);
            nuevas++;
        }
        return nuevas;
    }

    private int registrarHabilidades(Postulante postulante, List<String> habilidades) {
        int nuevas = 0;
        for (String nombreHabilidad : habilidades) {
            if (nombreHabilidad == null || nombreHabilidad.isBlank()) {
                continue;
            }

            Optional<Habilidad> habilidad = habilidadRepository.findByNombreIgnoreCase(nombreHabilidad.trim());
            if (habilidad.isEmpty()) {
                continue;
            }

            boolean existe = postulanteHabilidadRepository.existsByIdPostulanteAndIdHabilidad(
                    postulante.getIdPostulante(), habilidad.get().getIdHabilidad()
            );

            if (existe) {
                continue;
            }

            PostulanteHabilidad postulanteHabilidad = new PostulanteHabilidad();
            postulanteHabilidad.setIdPostulante(postulante.getIdPostulante());
            postulanteHabilidad.setIdHabilidad(habilidad.get().getIdHabilidad());
            postulanteHabilidad.setNivelDominio("AUTOMATICO");
            postulanteHabilidad.setFechaRegistro(LocalDate.now());

            postulanteHabilidadRepository.save(postulanteHabilidad);
            nuevas++;
        }
        return nuevas;
    }

    private PostulanteRevisionDTO mapearAPostulanteRevision(Postulante postulante) {
        Integer edad = null;
        if (postulante.getFechaNacimiento() != null) {
            edad = java.time.Period.between(postulante.getFechaNacimiento(), java.time.LocalDate.now()).getYears();
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
