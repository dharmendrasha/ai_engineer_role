package com.itsm.incident.service.impl;

import com.itsm.incident.model.Category;
import com.itsm.incident.model.Incident;
import com.itsm.incident.model.Severity;
import com.itsm.incident.service.AITriageService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Implementation of AI Triage Service using simulated rule-based logic.
 * Follows Single Responsibility Principle - only handles AI analysis logic.
 * Follows Open/Closed Principle - can be extended for more complex AI logic.
 */
@Service
public class AITriageServiceImpl implements AITriageService {
    
    // Simulated AI logic for categorization
    private static final Map<String, Category> KEYWORD_TO_CATEGORY = Map.of(
        "network", Category.NETWORK,
        "database", Category.DATABASE,
        "security", Category.SECURITY,
        "hardware", Category.HARDWARE,
        "software", Category.SOFTWARE,
        "application", Category.APPLICATION,
        "access", Category.USER_ACCESS,
        "performance", Category.PERFORMANCE
    );
    
    // Keywords that indicate high severity
    private static final List<String> CRITICAL_SEVERITY_KEYWORDS = Arrays.asList(
        "critical", "down", "outage", "failure", "crashed", "security breach", "data loss"
    );
    
    // Keywords that indicate medium severity
    private static final List<String> HIGH_SEVERITY_KEYWORDS = Arrays.asList(
        "slow", "intermittent", "degraded", "timeout", "error", "warning"
    );
    
    private static final List<String> MEDIUM_SEVERITY_KEYWORDS = Arrays.asList(
        "minor", "small", "occasional", "sometimes"
    );
    
    @Override
    public void analyzeAndEnrichIncident(Incident incident) {
        String combinedText = (incident.getTitle() + " " + 
                              incident.getDescription() + " " + 
                              incident.getAffectedService()).toLowerCase();
        
        // Determine severity using AI logic
        incident.setAiSeverity(determineSeverity(combinedText));
        
        // Determine category using AI logic
        incident.setAiCategory(determineCategory(combinedText));
        
        // Generate suggested action based on AI analysis
        incident.setAiSuggestedAction(generateSuggestedAction(incident));
    }
    
    private Severity determineSeverity(String text) {
        if (containsAnyKeyword(text, CRITICAL_SEVERITY_KEYWORDS)) {
            return Severity.CRITICAL;
        } else if (containsAnyKeyword(text, HIGH_SEVERITY_KEYWORDS)) {
            return Severity.HIGH;
        } else if (containsAnyKeyword(text, MEDIUM_SEVERITY_KEYWORDS)) {
            return Severity.LOW;
        }
        return Severity.MEDIUM; // Default severity
    }
    
    private Category determineCategory(String text) {
        for (Map.Entry<String, Category> entry : KEYWORD_TO_CATEGORY.entrySet()) {
            if (text.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return Category.SOFTWARE; // Default category
    }
    
    private String generateSuggestedAction(Incident incident) {
        StringBuilder action = new StringBuilder();
        
        // Add severity-based action prefix
        switch (incident.getAiSeverity()) {
            case CRITICAL:
                action.append("IMMEDIATE ACTION REQUIRED: ");
                break;
            case HIGH:
                action.append("High priority - escalate to senior team. ");
                break;
            case MEDIUM:
                action.append("Standard resolution process. ");
                break;
            case LOW:
                action.append("Low priority - can be handled during regular hours. ");
                break;
        }
        
        // Add category-specific action recommendations
        switch (incident.getAiCategory()) {
            case NETWORK:
                action.append("Check network connectivity, router configurations, and firewall rules.");
                break;
            case DATABASE:
                action.append("Verify database connections, check for locks, and review query performance.");
                break;
            case SECURITY:
                action.append("Immediately isolate affected systems and contact security team.");
                break;
            case HARDWARE:
                action.append("Check hardware status, logs, and consider replacement if necessary.");
                break;
            case APPLICATION:
                action.append("Review application logs, restart services if needed, and check dependencies.");
                break;
            case USER_ACCESS:
                action.append("Verify user credentials, check permissions, and reset if necessary.");
                break;
            case PERFORMANCE:
                action.append("Monitor system resources, analyze performance metrics, and optimize as needed.");
                break;
            default:
                action.append("Follow standard troubleshooting procedures and document findings.");
        }
        
        return action.toString();
    }
    
    private boolean containsAnyKeyword(String text, List<String> keywords) {
        return keywords.stream().anyMatch(text::contains);
    }
}
