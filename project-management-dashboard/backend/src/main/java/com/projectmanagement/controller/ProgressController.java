package com.projectmanagement.controller;

import com.projectmanagement.dto.ProjectProgressDTO;
import com.projectmanagement.dto.ProjectStatusChartDTO;
import com.projectmanagement.dto.TimeSummaryDTO;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.ProjectStatus;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.service.ProgressService;
import com.projectmanagement.service.TimeEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProgressController {
    
    @Autowired
    private ProgressService progressService;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TimeEntryService timeEntryService;
    
    @GetMapping("/projects/{id}/progress")
    public ResponseEntity<ProjectProgressDTO> getProjectProgress(@PathVariable Long id) {
        ProjectProgressDTO progress = progressService.getProjectProgress(id);
        return ResponseEntity.ok(progress);
    }
    
    @GetMapping("/projects/progress-summary")
    public ResponseEntity<List<ProjectProgressDTO>> getProgressSummary() {
        List<ProjectProgressDTO> summary = progressService.getAllProjectsProgress();
        return ResponseEntity.ok(summary);
    }
    
    @PutMapping("/projects/{id}/status")
    public ResponseEntity<Project> updateProjectStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        
        ProjectStatus newStatus = ProjectStatus.valueOf(statusUpdate.get("status"));
        project.setStatus(newStatus);
        Project updatedProject = projectRepository.save(project);
        
        return ResponseEntity.ok(updatedProject);
    }
    
    @PostMapping("/projects/{id}/refresh-progress")
    public ResponseEntity<ProjectProgressDTO> refreshProjectProgress(@PathVariable Long id) {
        progressService.updateProjectProgress(id);
        ProjectProgressDTO progress = progressService.getProjectProgress(id);
        return ResponseEntity.ok(progress);
    }
    
    @GetMapping("/projects/{projectId}/time-summary")
    public ResponseEntity<TimeSummaryDTO> getProjectTimeSummary(@PathVariable Long projectId) {
        TimeSummaryDTO summary = timeEntryService.getProjectTimeSummary(projectId);
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/tasks/{taskId}/time-summary")
    public ResponseEntity<TimeSummaryDTO> getTaskTimeSummary(@PathVariable Long taskId) {
        TimeSummaryDTO summary = timeEntryService.getTaskTimeSummary(taskId);
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/charts/project-status")
    public ResponseEntity<List<ProjectStatusChartDTO>> getProjectStatusChart() {
        List<ProjectStatusChartDTO> chartData = progressService.getProjectStatusChart();
        return ResponseEntity.ok(chartData);
    }
    
    @GetMapping("/tasks/progress-metrics")
    public ResponseEntity<List<ProjectProgressDTO>> getTaskProgressMetrics() {
        List<ProjectProgressDTO> metrics = progressService.getAllProjectsProgress();
        return ResponseEntity.ok(metrics);
    }
}