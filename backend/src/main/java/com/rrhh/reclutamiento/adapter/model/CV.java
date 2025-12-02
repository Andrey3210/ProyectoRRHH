package com.rrhh.reclutamiento.adapter.model;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

public record CV(List<ParsedEducation> formaciones,
                 List<ParsedExperience> experiencias,
                 List<String> habilidades) {

    public CV {
        formaciones = formaciones != null ? formaciones : Collections.emptyList();
        experiencias = experiencias != null ? experiencias : Collections.emptyList();
        habilidades = habilidades != null ? habilidades : Collections.emptyList();
    }

    public static CV vacio() {
        return new CV(Collections.emptyList(), Collections.emptyList(), Collections.emptyList());
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
