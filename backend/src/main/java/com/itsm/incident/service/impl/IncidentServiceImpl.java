package com.itsm.incident.service.impl;

import com.itsm.incident.dto.IncidentRequestDto;
import com.itsm.incident.dto.IncidentResponseDto;
import com.itsm.incident.model.Incident;
import com.itsm.incident.model.Severity;
import com.itsm.incident.repository.IncidentRepository;
import com.itsm.incident.service.AITriageService;
import com.itsm.incident.service.IncidentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of Incident Service.
 * Follows Single Responsibility Principle - only handles incident business logic.
 * Follows Dependency Inversion Principle - depends on abstractions (interfaces).
 */
@Service
public class IncidentServiceImpl implements IncidentService {
    
    private final IncidentRepository incidentRepository;
    private final AITriageService aiTriageService;
    
    // Constructor injection following Dependency Inversion Principle
    public IncidentServiceImpl(IncidentRepository incidentRepository, AITriageService aiTriageService) {
        this.incidentRepository = incidentRepository;
        this.aiTriageService = aiTriageService;
    }
    
    @Override
    public IncidentResponseDto createIncident(IncidentRequestDto requestDto) {
        // Convert DTO to entity
        Incident incident = new Incident(
            requestDto.getTitle(),
            requestDto.getDescription(),
            requestDto.getAffectedService()
        );
        
        // Apply AI analysis
        aiTriageService.analyzeAndEnrichIncident(incident);
        
        // Save to database
        Incident savedIncident = incidentRepository.save(incident);
        
        // Convert to response DTO
        return convertToResponseDto(savedIncident);
    }
    
    @Override
    public List<IncidentResponseDto> getAllIncidents() {
        return incidentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public IncidentResponseDto getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));
        return convertToResponseDto(incident);
    }
    
    @Override
    public List<IncidentResponseDto> getIncidentsBySeverity(Severity severity) {
        return incidentRepository.findByAiSeverityOrderByCreatedAtDesc(severity)
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    private IncidentResponseDto convertToResponseDto(Incident incident) {
        IncidentResponseDto dto = new IncidentResponseDto();
        dto.setId(incident.getId());
        dto.setTitle(incident.getTitle());
        dto.setDescription(incident.getDescription());
        dto.setAffectedService(incident.getAffectedService());
        dto.setAiSeverity(incident.getAiSeverity());
        dto.setAiCategory(incident.getAiCategory());
        dto.setAiSuggestedAction(incident.getAiSuggestedAction());
        dto.setCreatedAt(incident.getCreatedAt());
        return dto;
    }
}
