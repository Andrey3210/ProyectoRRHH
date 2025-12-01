package com.rrhh.reclutamiento.controller;

import com.rrhh.shared.domain.model.CV;
import com.rrhh.shared.domain.model.Postulante;
import com.rrhh.reclutamiento.repository.PostulanteRepository;
import com.rrhh.shared.domain.enums.EstadoPostulante;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.InvalidMediaTypeException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/candidatos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CandidatoController {
    
    private final PostulanteRepository postulanteRepository;
    
    @GetMapping
    public ResponseEntity<List<Postulante>> obtenerCandidatos(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String puesto,
            @RequestParam(required = false) String search) {
        
        List<Postulante> candidatos;

        if (search != null && !search.isEmpty()) {
            candidatos = postulanteRepository.buscarPorTexto(search, EstadoPostulante.DESCARTADO);
        } else {
            candidatos = postulanteRepository.findByEstadoPostulacionNot(EstadoPostulante.DESCARTADO);
        }

        return ResponseEntity.ok(candidatos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Postulante> obtenerCandidatoPorId(@PathVariable Integer id) {
        // Carga el postulante con su CV y datos extraídos mediante JOIN FETCH
        return postulanteRepository.findByIdWithCV(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Postulante> crearCandidato(@RequestBody Postulante postulante) {
        try {
            Postulante nuevoPostulante = postulanteRepository.save(postulante);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPostulante);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Postulante> actualizarCandidato(
            @PathVariable Integer id,
            @RequestBody Postulante postulante) {
        return postulanteRepository.findById(id)
            .map(existing -> {
                postulante.setIdPostulante(id);
                return ResponseEntity.ok(postulanteRepository.save(postulante));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/habilidades")
    public ResponseEntity<?> obtenerHabilidades(@PathVariable Integer id) {
        return postulanteRepository.findByIdWithHabilidades(id)
            .map(postulante -> ResponseEntity.ok(postulante.getHabilidades()))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/cv")
    public ResponseEntity<?> obtenerCV(@PathVariable Integer id) {
        return postulanteRepository.findById(id)
            .map(postulante -> ResponseEntity.ok(postulante.getCv()))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/cv/archivo")
    public ResponseEntity<Resource> obtenerArchivoCV(@PathVariable Integer id) {
        return postulanteRepository.findByIdWithCV(id)
            .map(postulante -> {
                CV cv = postulante.getCv();
                return resolverRecursoCV(cv)
                    .map(resuelto -> {
                        String nombreDescarga = resuelto.nombreArchivo() != null
                            ? resuelto.nombreArchivo()
                            : cv.getNombreArchivo();
                        MediaType contentType = determinarContentType(cv, resuelto.rutaArchivo(), nombreDescarga);
                        return ResponseEntity.ok()
                            .contentType(contentType)
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + nombreDescarga + "\"")
                            .body((Resource) resuelto.recurso());
                    })
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).<Resource>build());
            })
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).<Resource>build());
    }

    private MediaType determinarContentType(CV cv, Path rutaArchivo, String nombreFallback) {
        if (rutaArchivo != null) {
            try {
                String tipoDetectado = Files.probeContentType(rutaArchivo);
                if (tipoDetectado != null) {
                    return MediaType.parseMediaType(tipoDetectado);
                }
            } catch (IOException | InvalidMediaTypeException ignored) {
            }
        }

        if (cv.getTipoArchivo() != null) {
            try {
                return MediaType.parseMediaType(cv.getTipoArchivo());
            } catch (InvalidMediaTypeException ignored) {
            }
        }

        String nombreArchivo = cv.getNombreArchivo() != null
            ? cv.getNombreArchivo()
            : nombreFallback;
        if (nombreArchivo != null && nombreArchivo.contains(".")) {
            String extension = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1).toLowerCase();
            return switch (extension) {
                case "pdf" -> MediaType.APPLICATION_PDF;
                case "doc" -> MediaType.parseMediaType("application/msword");
                case "docx" -> MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                default -> MediaType.APPLICATION_OCTET_STREAM;
            };
        }

        return MediaType.APPLICATION_OCTET_STREAM;
    }

    private record RecursoCV(ByteArrayResource recurso, String nombreArchivo, Path rutaArchivo) {}

    private Optional<RecursoCV> resolverRecursoCV(CV cv) {
        if (cv == null) {
            return Optional.empty();
        }

        List<Path> rutasCandidatas = new ArrayList<>();
        if (cv.getRutaArchivo() != null && !cv.getRutaArchivo().isBlank()) {
            rutasCandidatas.add(Paths.get(cv.getRutaArchivo()));
            String normalizada = cv.getRutaArchivo().replace("\\", java.io.File.separator);
            if (!normalizada.equals(cv.getRutaArchivo())) {
                rutasCandidatas.add(Paths.get(normalizada));
            }
        }

        for (Path ruta : rutasCandidatas) {
            if (Files.exists(ruta)) {
                try {
                    return Optional.of(new RecursoCV(
                        new ByteArrayResource(Files.readAllBytes(ruta)),
                        cv.getNombreArchivo(),
                        ruta
                    ));
                } catch (IOException ignored) {
                }
            }
        }

        if (cv.getNombreArchivo() != null) {
            ClassPathResource recursoNombre = new ClassPathResource("cv/" + cv.getNombreArchivo());
            if (recursoNombre.exists()) {
                try {
                    return Optional.of(new RecursoCV(
                        new ByteArrayResource(recursoNombre.getContentAsByteArray()),
                        cv.getNombreArchivo(),
                        null
                    ));
                } catch (IOException ignored) {
                }
            }
        }

        ClassPathResource placeholder = new ClassPathResource("cv/cv-placeholder.pdf");
        if (placeholder.exists()) {
            try {
                return Optional.of(new RecursoCV(
                    new ByteArrayResource(placeholder.getContentAsByteArray()),
                    placeholder.getFilename(),
                    null
                ));
            } catch (IOException ignored) {
            }
        }

        return Optional.empty();
    }

    private MediaType determinarContentType(CV cv, Path rutaArchivo) {
        try {
            String tipoDetectado = Files.probeContentType(rutaArchivo);
            if (tipoDetectado != null) {
                return MediaType.parseMediaType(tipoDetectado);
            }
        } catch (IOException | InvalidMediaTypeException ignored) {
        }

        if (cv.getTipoArchivo() != null) {
            try {
                return MediaType.parseMediaType(cv.getTipoArchivo());
            } catch (InvalidMediaTypeException ignored) {
            }
        }

        String nombreArchivo = cv.getNombreArchivo();
        if (nombreArchivo != null && nombreArchivo.contains(".")) {
            String extension = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1).toLowerCase();
            return switch (extension) {
                case "pdf" -> MediaType.APPLICATION_PDF;
                case "doc" -> MediaType.parseMediaType("application/msword");
                case "docx" -> MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                default -> MediaType.APPLICATION_OCTET_STREAM;
            };
        }

        return MediaType.APPLICATION_OCTET_STREAM;
    }
    
    @PostMapping("/buscar")
    public ResponseEntity<List<Postulante>> buscarCandidatos(@RequestBody Map<String, Object> criterios) {
        // Implementar lógica de búsqueda avanzada
        List<Postulante> candidatos = postulanteRepository.findAll();
        return ResponseEntity.ok(candidatos);
    }
}

