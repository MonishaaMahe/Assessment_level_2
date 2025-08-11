package com.projectmanagement.dto;

import com.projectmanagement.entity.ProjectStatus;

public class ProjectStatusChartDTO {
    private ProjectStatus status;
    private Long count;
    
    public ProjectStatusChartDTO(ProjectStatus status, Long count) {
        this.status = status;
        this.count = count;
    }
    
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    
    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }
}