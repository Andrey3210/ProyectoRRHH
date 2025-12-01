package com.rrhh.reclutamiento.controller;

import com.rrhh.shared.domain.model.CV;
import com.rrhh.shared.domain.model.Postulante;
import com.rrhh.reclutamiento.repository.PostulanteRepository;
import com.rrhh.shared.domain.enums.EstadoPostulante;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
        return postulanteRepository.findById(id)
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
                if (cv == null || cv.getRutaArchivo() == null) {
                    return ResponseEntity.notFound().build();
                }

                Path rutaArchivo = Paths.get(cv.getRutaArchivo());
                if (!Files.exists(rutaArchivo)) {
                    return ResponseEntity.notFound().build();
                }

                try {
                    ByteArrayResource recurso = new ByteArrayResource(Files.readAllBytes(rutaArchivo));
                    String contentType = cv.getTipoArchivo() != null ? cv.getTipoArchivo() : MediaType.APPLICATION_PDF_VALUE;
                    return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + cv.getNombreArchivo() + "\"")
                        .body(recurso);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping("/buscar")
    public ResponseEntity<List<Postulante>> buscarCandidatos(@RequestBody Map<String, Object> criterios) {
        // Implementar lógica de búsqueda avanzada
        List<Postulante> candidatos = postulanteRepository.findAll();
        return ResponseEntity.ok(candidatos);
    }
}

