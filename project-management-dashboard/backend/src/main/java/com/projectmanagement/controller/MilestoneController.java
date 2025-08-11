package com.projectmanagement.controller;

import com.projectmanagement.entity.Milestone;
import com.projectmanagement.service.MilestoneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "Milestone Management", description = "APIs for managing milestones")
public class MilestoneController {
    
    @Autowired
    private MilestoneService milestoneService;
    
    @PostMapping("/projects/{projectId}/milestones")
    @Operation(summary = "Add milestone to a project")
    public Milestone createMilestone(@PathVariable Long projectId, @RequestBody Milestone milestone) {
        return milestoneService.createMilestone(projectId, milestone);
    }
    
    @PutMapping("/milestones/{id}")
    @Operation(summary = "Update milestone")
    public ResponseEntity<Milestone> updateMilestone(@PathVariable Long id, @RequestBody Milestone milestoneDetails) {
        try {
            Milestone updatedMilestone = milestoneService.updateMilestone(id, milestoneDetails);
            return ResponseEntity.ok(updatedMilestone);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/milestones/{id}")
    @Operation(summary = "Delete milestone")
    public ResponseEntity<?> deleteMilestone(@PathVariable Long id) {
        milestoneService.deleteMilestone(id);
        return ResponseEntity.ok().build();
    }
}