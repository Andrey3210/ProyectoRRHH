package com.rrhh.reclutamiento.adapter.model;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

public record CVParsedData(List<ParsedEducation> formaciones,
                           List<ParsedExperience> experiencias,
                           List<String> habilidades) {

    public CVParsedData {
        formaciones = formaciones != null ? formaciones : Collections.emptyList();
        experiencias = experiencias != null ? experiencias : Collections.emptyList();
        habilidades = habilidades != null ? habilidades : Collections.emptyList();
    }

    public static CVParsedData vacio() {
        return new CVParsedData(Collections.emptyList(), Collections.emptyList(), Collections.emptyList());
    }

    public record ParsedEducation(String nivelEstudios,
                                  String situacion,
                                  String carrera,
                                  String institucion,
                                  LocalDate fechaInicio,
                                  LocalDate fechaFin,
                                  String cursos,
                                  String observaciones) {
    }

    public record ParsedExperience(String empresa,
                                   String cargo,
                                   String funciones,
                                   LocalDate fechaInicio,
                                   LocalDate fechaFin,
                                   String referencia,
                                   String telefonoReferencia) {
    }
}
