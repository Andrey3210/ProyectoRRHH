package com.rrhh.reclutamiento.adapter.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
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
            JsonNode root = objectMapper.readTree(ruta.toFile());
            return new ExternalProfile(
                    root.path("formacion"),
                    root.path("experiencias"),
                    root.path("habilidades")
            );
        } catch (IOException e) {
            return ExternalProfile.vacio();
        }
    }

    public record ExternalProfile(JsonNode formacionNode, JsonNode experienciasNode, JsonNode habilidadesNode) {
        public static ExternalProfile vacio() {
            return new ExternalProfile(null, null, null);
        }

        public List<JsonNode> formacion() {
            if (formacionNode != null && formacionNode.isArray()) {
                return StreamSupport.stream(formacionNode.spliterator(), false)
                        .toList();
            }
            return Collections.emptyList();
        }

        public List<JsonNode> experiencias() {
            if (experienciasNode != null && experienciasNode.isArray()) {
                return StreamSupport.stream(experienciasNode.spliterator(), false)
                        .toList();
            }
            return Collections.emptyList();
        }

        public List<String> habilidades() {
            if (habilidadesNode != null && habilidadesNode.isArray()) {
                return StreamSupport.stream(habilidadesNode.spliterator(), false)
                        .map(JsonNode::asText)
                        .filter(s -> s != null && !s.isBlank())
                        .toList();
            }
            return Collections.emptyList();
        }
    }
}
