package com.rrhh.reclutamiento.adapter;

import com.fasterxml.jackson.databind.JsonNode;
import com.rrhh.reclutamiento.adapter.external.ExternalCVJsonTool;
import com.rrhh.reclutamiento.adapter.model.CVParsedData;
import com.rrhh.shared.domain.model.CV;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ExternalToolCVAdapter implements CVDataExtractionAdapter {

    private final ExternalCVJsonTool externalTool;

    @Override
    public CVParsedData extraerDatos(CV cv) {
        if (cv == null || cv.getRutaArchivo() == null || cv.getRutaArchivo().isBlank()) {
            return CVParsedData.vacio();
        }

        ExternalCVJsonTool.ExternalProfile perfil;
        try {
            perfil = externalTool.leerPerfilDesdeArchivo(Paths.get(cv.getRutaArchivo()));
        } catch (Exception e) {
            return CVParsedData.vacio();
        }

        List<CVParsedData.ParsedEducation> formaciones = new ArrayList<>();
        for (JsonNode node : perfil.formacion()) {
            formaciones.add(new CVParsedData.ParsedEducation(
                    node.path("nivel").asText("No especificado"),
                    node.path("situacion").asText("EN_CURSO"),
                    node.path("carrera").asText(null),
                    node.path("institucion").asText("Institución no identificada"),
                    parseFecha(node.path("inicio").asText(null)),
                    parseFecha(node.path("fin").asText(null)),
                    node.path("cursos").asText(null),
                    node.path("observaciones").asText(null)
            ));
        }

        List<CVParsedData.ParsedExperience> experiencias = new ArrayList<>();
        for (JsonNode node : perfil.experiencias()) {
            experiencias.add(new CVParsedData.ParsedExperience(
                    node.path("empresa").asText("Empresa no indicada"),
                    node.path("cargo").asText("Cargo no indicado"),
                    node.path("funciones").asText(null),
                    parseFecha(node.path("inicio").asText(null)),
                    parseFecha(node.path("fin").asText(null)),
                    node.path("referencia").asText(null),
                    node.path("telefonoReferencia").asText(null)
            ));
        }

        return new CVParsedData(formaciones, experiencias, perfil.habilidades());
    }

    private LocalDate parseFecha(String fecha) {
        if (fecha == null || fecha.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(fecha);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
