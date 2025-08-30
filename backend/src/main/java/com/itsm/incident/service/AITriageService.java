package com.itsm.incident.service;

import com.itsm.incident.model.Incident;

/**
 * Interface for AI-powered incident triage logic.
 * Follows Single Responsibility Principle - only handles AI analysis.
 */
public interface AITriageService {
    void analyzeAndEnrichIncident(Incident incident);
}
