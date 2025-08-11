package com.projectmanagement.controller;

import com.projectmanagement.entity.Task;
import com.projectmanagement.entity.TaskPriority;
import com.projectmanagement.entity.TaskStatus;
import com.projectmanagement.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "Task Management", description = "APIs for managing tasks")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @GetMapping("/tasks")
    @Operation(summary = "Get all tasks with optional filters")
    public List<Task> getAllTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String role) {
        if (status != null) {
            return taskService.getTasksByStatus(status);
        }
        if (priority != null) {
            return taskService.getTasksByPriority(priority);
        }
        return taskService.getAllTasks(userId, role);
    }
    
    @GetMapping("/tasks/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/projects/{projectId}/tasks")
    @Operation(summary = "Get tasks for a project")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProject(projectId);
    }
    
    @PostMapping("/projects/{projectId}/tasks")
    @Operation(summary = "Create new task for a project")
    public Task createTask(@PathVariable Long projectId, @RequestBody Task task) {
        return taskService.createTask(projectId, task);
    }
    
    @PutMapping("/tasks/{id}")
    @Operation(summary = "Update task")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/tasks/{id}")
    @Operation(summary = "Delete task")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
}