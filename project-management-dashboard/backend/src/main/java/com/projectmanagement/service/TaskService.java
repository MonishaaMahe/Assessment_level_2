package com.projectmanagement.service;

import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.Task;
import com.projectmanagement.entity.TaskPriority;
import com.projectmanagement.entity.TaskStatus;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ProgressService progressService;
    
    @Autowired
    private NotificationService notificationService;
    
    public List<Task> getAllTasks(String userId, String role) {
        if ("Developer".equals(role)) {
            return taskRepository.findByAssignedToUserId(userId);
        } else {
            return taskRepository.findAll();
        }
    }
    
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }
    
    public List<Task> getTasksByPriority(TaskPriority priority) {
        return taskRepository.findByPriority(priority);
    }
    
    public Task createTask(Long projectId, Task task) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        task.setProject(project);
        Task savedTask = taskRepository.save(task);
        progressService.updateProjectProgress(projectId);
        return savedTask;
    }
    
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        String oldAssignee = task.getAssignedToUserId();
        TaskStatus oldStatus = task.getStatus();
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setAssignedToUserId(taskDetails.getAssignedToUserId());
        task.setPriority(taskDetails.getPriority());
        task.setStatus(taskDetails.getStatus());
        task.setDueDate(taskDetails.getDueDate());
        
        Task updatedTask = taskRepository.save(task);
        
        // Trigger notifications
        if (oldAssignee == null && taskDetails.getAssignedToUserId() != null) {
            notificationService.createNotification(
                taskDetails.getAssignedToUserId(),
                String.format("You have been assigned to Task #%d: %s", task.getId(), task.getTitle()),
                com.projectmanagement.entity.NotificationType.ASSIGNMENT
            );
        }
        
        if (oldStatus != taskDetails.getStatus()) {
            notificationService.createNotification(
                "demo-user",
                String.format("Task #%d status changed to %s", task.getId(), taskDetails.getStatus()),
                com.projectmanagement.entity.NotificationType.STATUS_UPDATE
            );
        }
        
        progressService.updateProjectProgress(task.getProject().getId());
        return updatedTask;
    }
    
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        Long projectId = task.getProject().getId();
        taskRepository.deleteById(id);
        progressService.updateProjectProgress(projectId);
    }
}