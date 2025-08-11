package com.projectmanagement.service;

import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.ProjectStatus;
import com.projectmanagement.entity.TeamMember;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TeamMemberRepository teamMemberRepository;
    
    public List<Project> getAllProjects(String userId, String role) {
        if ("Developer".equals(role)) {
            // Find projects where developer is a team member
            Optional<TeamMember> userTeamMembership = teamMemberRepository.findByUserId(userId);
            if (userTeamMembership.isEmpty()) {
                return List.of();
            }
            
            // Return project where this developer is a team member
            Long projectId = userTeamMembership.get().getProjectId();
            if (projectId != null) {
                return projectRepository.findById(projectId)
                    .map(List::of)
                    .orElse(List.of());
            }
            return List.of();
        } else {
            // Project Managers and Admins see all projects
            return projectRepository.findAll();
        }
    }
    
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findByIdWithMilestones(id);
    }
    
    public Project createProject(Project project, List<String> assignedDevelopers) {
        // Set default values
        project.setStatus(ProjectStatus.NEW);
        
        Project savedProject = projectRepository.save(project);
        
        // Create team member entries for assigned developers
        if (assignedDevelopers != null && !assignedDevelopers.isEmpty()) {
            for (String developerId : assignedDevelopers) {
                try {
                    // Check if team member already exists globally (due to unique constraint)
                    Optional<TeamMember> existingMember = teamMemberRepository.findByUserId(developerId);
                    
                    if (existingMember.isEmpty()) {
                        TeamMember teamMember = new TeamMember();
                        teamMember.setUserId(developerId);
                        teamMember.setProjectId(savedProject.getId());
                        teamMember.setRole("Developer");
                        teamMember.setName(developerId);
                        teamMember.setEmail(developerId + "@company.com");
                        teamMemberRepository.save(teamMember);
                    }
                } catch (Exception e) {
                    // Log error but don't fail project creation
                    System.err.println("Error assigning developer " + developerId + ": " + e.getMessage());
                }
            }
        }
        
        return savedProject;
    }
    
    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        project.setStartDate(projectDetails.getStartDate());
        project.setEndDate(projectDetails.getEndDate());
        project.setStatus(projectDetails.getStatus());
        
        return projectRepository.save(project);
    }
    
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}