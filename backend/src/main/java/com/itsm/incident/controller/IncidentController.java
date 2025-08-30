package com.itsm.incident.controller;

import com.itsm.incident.dto.IncidentRequestDto;
import com.itsm.incident.dto.IncidentResponseDto;
import com.itsm.incident.model.Severity;
import com.itsm.incident.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for incident management.
 * Follows Single Responsibility Principle - only handles HTTP requests/responses.
 * Follows Dependency Inversion Principle - depends on service interface.
 */
@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class IncidentController {
    
    private final IncidentService incidentService;
    
    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }
    
    @PostMapping
    public ResponseEntity<IncidentResponseDto> createIncident(@Valid @RequestBody IncidentRequestDto requestDto) {
        try {
            IncidentResponseDto responseDto = incidentService.createIncident(requestDto);
            return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<IncidentResponseDto>> getAllIncidents() {
        try {
            List<IncidentResponseDto> incidents = incidentService.getAllIncidents();
            return new ResponseEntity<>(incidents, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponseDto> getIncidentById(@PathVariable Long id) {
        try {
            IncidentResponseDto incident = incidentService.getIncidentById(id);
            return new ResponseEntity<>(incident, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<IncidentResponseDto>> getIncidentsBySeverity(@PathVariable Severity severity) {
        try {
            List<IncidentResponseDto> incidents = incidentService.getIncidentsBySeverity(severity);
            return new ResponseEntity<>(incidents, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
