package com.itsm.incident.service;

import com.itsm.incident.dto.IncidentRequestDto;
import com.itsm.incident.dto.IncidentResponseDto;
import com.itsm.incident.model.Severity;
import java.util.List;

/**
 * Interface for incident management operations.
 * Follows Single Responsibility Principle - only handles incident business logic.
 */
public interface IncidentService {
    IncidentResponseDto createIncident(IncidentRequestDto requestDto);
    List<IncidentResponseDto> getAllIncidents();
    IncidentResponseDto getIncidentById(Long id);
    List<IncidentResponseDto> getIncidentsBySeverity(Severity severity);
}
