package com.projectmanagement.service;

import com.projectmanagement.dto.TimeSummaryDTO;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.Task;
import com.projectmanagement.entity.TimeEntry;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.TaskRepository;
import com.projectmanagement.repository.TimeEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TimeEntryService {
    
    @Autowired
    private TimeEntryRepository timeEntryRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    public List<TimeEntry> getAllTimeEntries() {
        return timeEntryRepository.findAll();
    }
    
    public List<TimeEntry> getTimeEntriesByUser(String userId) {
        return timeEntryRepository.findByUserId(userId);
    }
    
    public List<TimeEntry> getTimeEntriesByProject(Long projectId) {
        return timeEntryRepository.findByProjectId(projectId);
    }
    
    public List<TimeEntry> getTimeEntriesByTask(Long taskId) {
        return timeEntryRepository.findByTaskId(taskId);
    }
    
    public TimeEntry createTimeEntry(TimeEntry timeEntry) {
        return timeEntryRepository.save(timeEntry);
    }
    
    public TimeEntry updateTimeEntry(Long id, TimeEntry timeEntryDetails) {
        TimeEntry timeEntry = timeEntryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Time entry not found"));
        
        timeEntry.setUserId(timeEntryDetails.getUserId());
        timeEntry.setProjectId(timeEntryDetails.getProjectId());
        timeEntry.setTaskId(timeEntryDetails.getTaskId());
        timeEntry.setDate(timeEntryDetails.getDate());
        timeEntry.setHoursSpent(timeEntryDetails.getHoursSpent());
        timeEntry.setDescription(timeEntryDetails.getDescription());
        
        return timeEntryRepository.save(timeEntry);
    }
    
    public void deleteTimeEntry(Long id) {
        timeEntryRepository.deleteById(id);
    }
    
    public TimeSummaryDTO getProjectTimeSummary(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        
        Float totalHours = timeEntryRepository.getTotalHoursByProject(projectId);
        Integer entryCount = timeEntryRepository.getEntryCountByProject(projectId);
        
        return new TimeSummaryDTO(
            projectId,
            project.getName(),
            totalHours != null ? totalHours : 0.0f,
            entryCount != null ? entryCount : 0
        );
    }
    
    public TimeSummaryDTO getTaskTimeSummary(Long taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        Float totalHours = timeEntryRepository.getTotalHoursByTask(taskId);
        Integer entryCount = timeEntryRepository.getEntryCountByTask(taskId);
        
        return new TimeSummaryDTO(
            taskId,
            task.getTitle(),
            totalHours != null ? totalHours : 0.0f,
            entryCount != null ? entryCount : 0
        );
    }
}