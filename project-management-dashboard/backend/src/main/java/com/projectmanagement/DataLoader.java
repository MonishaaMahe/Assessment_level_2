package com.projectmanagement;

import com.projectmanagement.entity.Milestone;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.ProjectStatus;
import com.projectmanagement.repository.MilestoneRepository;
import com.projectmanagement.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private MilestoneRepository milestoneRepository;
    
    @Override
    public void run(String... args) {
        if (projectRepository.count() == 0) {
            loadSampleData();
        }
    }
    
    private void loadSampleData() {
        // Create projects
        Project project1 = new Project();
        project1.setName("E-commerce Platform");
        project1.setDescription("Build a modern e-commerce platform with React and Spring Boot");
        project1.setStartDate(LocalDate.of(2024, 1, 1));
        project1.setEndDate(LocalDate.of(2024, 6, 30));
        project1.setStatus(ProjectStatus.IN_PROGRESS);
        project1 = projectRepository.save(project1);
        
        Project project2 = new Project();
        project2.setName("Mobile App Development");
        project2.setDescription("Develop a cross-platform mobile application");
        project2.setStartDate(LocalDate.of(2024, 2, 1));
        project2.setEndDate(LocalDate.of(2024, 8, 31));
        project2.setStatus(ProjectStatus.NEW);
        project2 = projectRepository.save(project2);
        
        // Create milestones
        Milestone milestone1 = new Milestone();
        milestone1.setTitle("Database Design");
        milestone1.setDescription("Complete database schema design and setup");
        milestone1.setDueDate(LocalDate.of(2024, 2, 15));
        milestone1.setCompleted(true);
        milestone1.setProject(project1);
        milestoneRepository.save(milestone1);
        
        Milestone milestone2 = new Milestone();
        milestone2.setTitle("API Development");
        milestone2.setDescription("Develop REST APIs for core functionality");
        milestone2.setDueDate(LocalDate.of(2024, 3, 30));
        milestone2.setCompleted(false);
        milestone2.setProject(project1);
        milestoneRepository.save(milestone2);
    }
}