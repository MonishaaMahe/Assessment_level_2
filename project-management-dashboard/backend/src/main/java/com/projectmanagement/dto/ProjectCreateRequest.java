package com.projectmanagement.dto;

import com.projectmanagement.entity.Project;
import java.util.List;

public class ProjectCreateRequest {
    private String name;
    private String description;
    private String startDate;
    private String endDate;
    private String createdBy;
    private List<String> assignedDevelopers;
    
    public Project getProject() {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setCreatedBy(createdBy);
        return project;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public List<String> getAssignedDevelopers() { return assignedDevelopers; }
    public void setAssignedDevelopers(List<String> assignedDevelopers) { this.assignedDevelopers = assignedDevelopers; }
}