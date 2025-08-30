package com.itsm.incident.repository;

import com.itsm.incident.model.Incident;
import com.itsm.incident.model.Severity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Incident entity.
 * Follows Interface Segregation Principle - only includes necessary methods.
 */
@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByAiSeverityOrderByCreatedAtDesc(Severity severity);
    List<Incident> findAllByOrderByCreatedAtDesc();
}
