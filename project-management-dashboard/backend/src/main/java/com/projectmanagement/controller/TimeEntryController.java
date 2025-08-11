package com.projectmanagement.controller;

import com.projectmanagement.dto.TimeSummaryDTO;
import com.projectmanagement.entity.TimeEntry;
import com.projectmanagement.service.TimeEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/time-entries")
@CrossOrigin(origins = "http://localhost:3000")
public class TimeEntryController {
    
    @Autowired
    private TimeEntryService timeEntryService;
    
    @PostMapping
    public ResponseEntity<TimeEntry> createTimeEntry(@RequestBody TimeEntry timeEntry) {
        TimeEntry savedEntry = timeEntryService.createTimeEntry(timeEntry);
        return ResponseEntity.ok(savedEntry);
    }
    
    @GetMapping
    public ResponseEntity<List<TimeEntry>> getAllTimeEntries(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long taskId) {
        
        List<TimeEntry> entries;
        if (userId != null) {
            entries = timeEntryService.getTimeEntriesByUser(userId);
        } else if (projectId != null) {
            entries = timeEntryService.getTimeEntriesByProject(projectId);
        } else if (taskId != null) {
            entries = timeEntryService.getTimeEntriesByTask(taskId);
        } else {
            entries = timeEntryService.getAllTimeEntries();
        }
        
        return ResponseEntity.ok(entries);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TimeEntry>> getTimeEntriesByUser(@PathVariable String userId) {
        List<TimeEntry> entries = timeEntryService.getTimeEntriesByUser(userId);
        return ResponseEntity.ok(entries);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TimeEntry> updateTimeEntry(@PathVariable Long id, @RequestBody TimeEntry timeEntry) {
        TimeEntry updatedEntry = timeEntryService.updateTimeEntry(id, timeEntry);
        return ResponseEntity.ok(updatedEntry);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeEntry(@PathVariable Long id) {
        timeEntryService.deleteTimeEntry(id);
        return ResponseEntity.ok().build();
    }
    

}