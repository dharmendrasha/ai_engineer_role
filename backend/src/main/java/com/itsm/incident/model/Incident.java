package com.itsm.incident.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Description is required")
    @Column(nullable = false, length = 1000)
    private String description;
    
    @NotBlank(message = "Affected service is required")
    @Column(name = "affected_service", nullable = false)
    private String affectedService;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ai_severity")
    private Severity aiSeverity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ai_category")
    private Category aiCategory;
    
    @Column(name = "ai_suggested_action", length = 500)
    private String aiSuggestedAction;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Incident() {}
    
    public Incident(String title, String description, String affectedService) {
        this.title = title;
        this.description = description;
        this.affectedService = affectedService;
    }
    
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
