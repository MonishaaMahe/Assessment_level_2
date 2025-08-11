package com.projectmanagement.dto;

import com.projectmanagement.entity.ProjectStatus;

public class ProjectProgressDTO {
    private Long projectId;
    private String projectName;
    private ProjectStatus status;
    private Integer progressPercent;
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer inProgressTasks;
    private Integer todoTasks;
    
    public ProjectProgressDTO(Long projectId, String projectName, ProjectStatus status, 
                             Integer progressPercent, Integer totalTasks, Integer completedTasks, 
                             Integer inProgressTasks, Integer todoTasks) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.status = status;
        this.progressPercent = progressPercent;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.todoTasks = todoTasks;
    }
    
    // Getters and Setters
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    
    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
    
    public Integer getTotalTasks() { return totalTasks; }
    public void setTotalTasks(Integer totalTasks) { this.totalTasks = totalTasks; }
    
    public Integer getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(Integer completedTasks) { this.completedTasks = completedTasks; }
    
    public Integer getInProgressTasks() { return inProgressTasks; }
    public void setInProgressTasks(Integer inProgressTasks) { this.inProgressTasks = inProgressTasks; }
    
    public Integer getTodoTasks() { return todoTasks; }
    public void setTodoTasks(Integer todoTasks) { this.todoTasks = todoTasks; }
}