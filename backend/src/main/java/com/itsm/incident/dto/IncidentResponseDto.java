package com.itsm.incident.dto;

import com.itsm.incident.model.Category;
import com.itsm.incident.model.Severity;
import java.time.LocalDateTime;

public class IncidentResponseDto {
    private Long id;
    private String title;
    private String description;
    private String affectedService;
    private Severity aiSeverity;
    private Category aiCategory;
    private String aiSuggestedAction;
    private LocalDateTime createdAt;
    
    // Constructors
    public IncidentResponseDto() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAffectedService() { return affectedService; }
    public void setAffectedService(String affectedService) { this.affectedService = affectedService; }
    
    public Severity getAiSeverity() { return aiSeverity; }
    public void setAiSeverity(Severity aiSeverity) { this.aiSeverity = aiSeverity; }
    
    public Category getAiCategory() { return aiCategory; }
    public void setAiCategory(Category aiCategory) { this.aiCategory = aiCategory; }
    
    public String getAiSuggestedAction() { return aiSuggestedAction; }
    public void setAiSuggestedAction(String aiSuggestedAction) { this.aiSuggestedAction = aiSuggestedAction; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
