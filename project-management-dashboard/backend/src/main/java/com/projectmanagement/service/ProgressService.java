package com.projectmanagement.service;

import com.projectmanagement.dto.ProjectProgressDTO;
import com.projectmanagement.dto.ProjectStatusChartDTO;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.ProjectStatus;
import com.projectmanagement.entity.Task;
import com.projectmanagement.entity.TaskStatus;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    public ProjectProgressDTO getProjectProgress(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        
        int totalTasks = tasks.size();
        int completedTasks = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        int inProgressTasks = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        int todoTasks = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        
        int progressPercent = totalTasks > 0 ? (completedTasks * 100) / totalTasks : 0;
        
        return new ProjectProgressDTO(
            project.getId(),
            project.getName(),
            project.getStatus(),
            progressPercent,
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks
        );
    }
    
    public List<ProjectProgressDTO> getAllProjectsProgress() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
            .map(project -> getProjectProgress(project.getId()))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void updateProjectProgress(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        
        if (tasks.isEmpty()) {
            project.setProgressPercent(0);
            projectRepository.save(project);
            return;
        }
        
        int totalTasks = tasks.size();
        int completedTasks = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        int progressPercent = (completedTasks * 100) / totalTasks;
        
        project.setProgressPercent(progressPercent);
        
        // Auto-update status based on progress and due date
        if (progressPercent == 100) {
            project.setStatus(ProjectStatus.COMPLETED);
        } else if (progressPercent > 0) {
            // Check if project is at risk based on due date
            if (project.getEndDate() != null && LocalDate.now().isAfter(project.getEndDate().minusDays(7)) && progressPercent < 80) {
                project.setStatus(ProjectStatus.AT_RISK);
            } else if (project.getEndDate() != null && LocalDate.now().isAfter(project.getEndDate())) {
                project.setStatus(ProjectStatus.DELAYED);
            } else {
                project.setStatus(ProjectStatus.ON_TRACK);
            }
        }
        
        projectRepository.save(project);
    }
    
    public List<ProjectStatusChartDTO> getProjectStatusChart() {
        return projectRepository.findAll().stream()
            .collect(Collectors.groupingBy(Project::getStatus, Collectors.counting()))
            .entrySet().stream()
            .map(entry -> new ProjectStatusChartDTO(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());
    }
}