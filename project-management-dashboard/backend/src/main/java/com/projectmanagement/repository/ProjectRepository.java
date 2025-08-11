package com.projectmanagement.repository;

import com.projectmanagement.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.milestones WHERE p.id = :id")
    Optional<Project> findByIdWithMilestones(@Param("id") Long id);
    
    List<Project> findByAssignedToUserId(String assignedToUserId);
    List<Project> findByCreatedBy(String createdBy);
}