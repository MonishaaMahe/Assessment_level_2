package com.projectmanagement.controller;

import com.projectmanagement.dto.ProjectCreateRequest;
import com.projectmanagement.entity.Project;
import com.projectmanagement.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
@Tag(name = "Project Management", description = "APIs for managing projects")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    @Operation(summary = "Get all projects")
    public List<Project> getAllProjects(@RequestParam(required = false) String userId, @RequestParam(required = false) String role) {
        return projectService.getAllProjects(userId, role);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID with milestones")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Create a new project")
    public Project createProject(@RequestBody ProjectCreateRequest request) {
        return projectService.createProject(request.getProject(), request.getAssignedDevelopers());
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update project")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        try {
            Project updatedProject = projectService.updateProject(id, projectDetails);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}