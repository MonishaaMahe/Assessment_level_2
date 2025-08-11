package com.projectmanagement.service;

import com.projectmanagement.entity.Milestone;
import com.projectmanagement.entity.Project;
import com.projectmanagement.repository.MilestoneRepository;
import com.projectmanagement.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MilestoneService {
    
    @Autowired
    private MilestoneRepository milestoneRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    public Milestone createMilestone(Long projectId, Milestone milestone) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        milestone.setProject(project);
        return milestoneRepository.save(milestone);
    }
    
    public Milestone updateMilestone(Long id, Milestone milestoneDetails) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        milestone.setTitle(milestoneDetails.getTitle());
        milestone.setDescription(milestoneDetails.getDescription());
        milestone.setDueDate(milestoneDetails.getDueDate());
        milestone.setCompleted(milestoneDetails.getCompleted());
        
        return milestoneRepository.save(milestone);
    }
    
    public void deleteMilestone(Long id) {
        milestoneRepository.deleteById(id);
    }
}