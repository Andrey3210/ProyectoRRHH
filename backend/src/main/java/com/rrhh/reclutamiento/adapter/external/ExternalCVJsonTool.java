package com.rrhh.reclutamiento.adapter.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.StreamSupport;

@Component
@RequiredArgsConstructor
public class ExternalCVJsonTool {

    private final ObjectMapper objectMapper;

    public ExternalProfile leerPerfilDesdeArchivo(Path ruta) {
        if (ruta == null || !Files.exists(ruta)) {
            return ExternalProfile.vacio();
        }

        try {
            String nombre = ruta.getFileName().toString().toLowerCase();
            if (nombre.endsWith(".json")) {
                return leerDesdeJson(ruta);
            }
            if (nombre.endsWith(".pdf")) {
                return leerDesdePdf(ruta);
            }
            return ExternalProfile.vacio();
        } catch (IOException e) {
            return ExternalProfile.vacio();
        }
    }

    private ExternalProfile leerDesdeJson(Path ruta) throws IOException {
        JsonNode root = objectMapper.readTree(ruta.toFile());
        return new ExternalProfile(
                toList(root.path("formacion")),
                toList(root.path("experiencias")),
                extraerHabilidades(root.path("habilidades"))
        );
    }

    private ExternalProfile leerDesdePdf(Path ruta) throws IOException {
        String texto = extraerTextoPlano(ruta);
        if (texto.isBlank()) {
            return ExternalProfile.vacio();
        }

        List<JsonNode> experiencias = parsearExperiencias(texto);
        List<String> habilidades = parsearHabilidades(texto);

        return new ExternalProfile(Collections.emptyList(), experiencias, habilidades);
    }

    private List<JsonNode> toList(JsonNode node) {
        if (node != null && node.isArray()) {
            return StreamSupport.stream(node.spliterator(), false).toList();
        }
        return Collections.emptyList();
    }

    private List<String> extraerHabilidades(JsonNode habilidadesNode) {
        if (habilidadesNode != null && habilidadesNode.isArray()) {
            return StreamSupport.stream(habilidadesNode.spliterator(), false)
                    .map(JsonNode::asText)
                    .filter(s -> s != null && !s.isBlank())
                    .toList();
        }
        return Collections.emptyList();
    }

    private String extraerTextoPlano(Path ruta) throws IOException {
        try (PDDocument document = PDDocument.load(ruta.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String texto = stripper.getText(document);
            return Normalizer.normalize(texto, Normalizer.Form.NFC);
        }
    }

    private List<JsonNode> parsearExperiencias(String texto) {
        List<JsonNode> experiencias = new ArrayList<>();
        String seccion = extraerSeccion(texto, "Experiencia Laboral", "Habilidades");

        if (!seccion.isBlank()) {
            experiencias.addAll(parsearExperienciasDesdeLineas(seccion.split("\\R")));
        }

        if (experiencias.isEmpty()) {
            experiencias.addAll(parsearExperienciasDesdeLineas(texto.split("\\R")));
        }

        return experiencias;
    }

    private List<JsonNode> parsearExperienciasDesdeLineas(String[] lineas) {
        List<JsonNode> experiencias = new ArrayList<>();
        String cargoActual = null;
        String empresaActual = null;
        LocalDate inicio = null;
        LocalDate fin = null;
        List<String> funciones = new ArrayList<>();

        Pattern cabecera = Pattern.compile("^(?<cargo>.+?)\\s+[–-]\\s+(?<empresa>.+)$");
        Pattern rangoAnios = Pattern.compile("(?<inicio>\\d{4})\\s*[–-]\\s*(?<fin>\\d{4}|Presente|Actual)", Pattern.CASE_INSENSITIVE);

        for (int i = 0; i < lineas.length; i++) {
            String linea = lineas[i].trim();
            if (linea.isBlank()) {
                continue;
            }

            Matcher cabeceraMatcher = cabecera.matcher(linea);
            if (cabeceraMatcher.matches()) {
                if (cargoActual != null) {
                    experiencias.add(crearExperiencia(cargoActual, empresaActual, inicio, fin, funciones));
                    funciones = new ArrayList<>();
                }
                cargoActual = cabeceraMatcher.group("cargo").trim();
                empresaActual = cabeceraMatcher.group("empresa").trim();

                Matcher rangoEnMismaLinea = rangoAnios.matcher(empresaActual);
                if (rangoEnMismaLinea.find()) {
                    empresaActual = empresaActual.replace(rangoEnMismaLinea.group(), "").trim();
                    inicio = parsearAnio(rangoEnMismaLinea.group("inicio"));
                    fin = parsearAnio(rangoEnMismaLinea.group("fin"));
                    continue;
                }

                if (i + 1 < lineas.length) {
                    Matcher rangoMatcher = rangoAnios.matcher(lineas[i + 1]);
                    if (rangoMatcher.find()) {
                        inicio = parsearAnio(rangoMatcher.group("inicio"));
                        fin = parsearAnio(rangoMatcher.group("fin"));
                        i++;
                        continue;
                    }
                }
                inicio = null;
                fin = null;
                continue;
            }

            if (linea.startsWith("-")) {
                funciones.add(linea.substring(1).trim());
            }
        }

        if (cargoActual != null) {
            experiencias.add(crearExperiencia(cargoActual, empresaActual, inicio, fin, funciones));
        }
        return experiencias;
    }

    private LocalDate parsearAnio(String valor) {
        try {
            int year = Integer.parseInt(valor);
            return LocalDate.of(year, 1, 1);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private JsonNode crearExperiencia(String cargo, String empresa, LocalDate inicio, LocalDate fin, List<String> funciones) {
        var node = objectMapper.createObjectNode();
        node.put("empresa", empresa != null ? empresa : "Empresa no indicada");
        node.put("cargo", cargo != null ? cargo : "Cargo no indicado");
        node.put("funciones", String.join("; ", funciones));
        node.put("inicio", inicio != null ? inicio.toString() : null);
        node.put("fin", fin != null ? fin.toString() : null);
        return node;
    }

    private List<String> parsearHabilidades(String texto) {
        List<String> habilidades = new ArrayList<>();
        habilidades.addAll(extraerHabilidadesDesdeSeccion(texto, "Habilidades Técnicas"));
        habilidades.addAll(extraerHabilidadesDesdeSeccion(texto, "Habilidades Blandas"));

        if (habilidades.isEmpty()) {
            habilidades.addAll(extraerHabilidadesDesdeSeccion(texto, "Habilidades"));
        }

        return habilidades;
    }

    private List<String> extraerHabilidadesDesdeSeccion(String texto, String tituloSeccion) {
        String seccion = extraerSeccion(texto, tituloSeccion, "Habilidades", "Perfil", "Experiencia Laboral");
        if (seccion.isBlank()) {
            return Collections.emptyList();
        }

        List<String> habilidades = new ArrayList<>();
        for (String linea : seccion.split("\\R")) {
            String limpia = linea.replace("•", "-").trim();
            if (limpia.startsWith("-")) {
                String habilidad = limpia.substring(1).trim();
                if (!habilidad.isBlank()) {
                    habilidades.add(habilidad);
                }
            }
        }
        return habilidades;
    }

    private String extraerSeccion(String texto, String inicioClave, String... finPosibles) {
        String normalizado = texto.replace("\r", "");
        String normalizadoLower = normalizado.toLowerCase();
        String inicioClaveLower = inicioClave.toLowerCase();

        int inicio = normalizadoLower.indexOf(inicioClaveLower);
        if (inicio == -1) {
            return "";
        }

        int fin = normalizado.length();
        for (String finClave : finPosibles) {
            String finClaveLower = finClave.toLowerCase();
            int posibleFin = normalizadoLower.indexOf(finClaveLower, inicio + inicioClaveLower.length());
            if (posibleFin != -1) {
                fin = Math.min(fin, posibleFin);
            }
        }

        if (fin <= inicio) {
            return "";
        }
        return normalizado.substring(inicio + inicioClave.length(), fin).trim();
    }

    public record ExternalProfile(List<JsonNode> formacion, List<JsonNode> experiencias, List<String> habilidades) {
        public static ExternalProfile vacio() {
            return new ExternalProfile(Collections.emptyList(), Collections.emptyList(), Collections.emptyList());
        }
    }
}
