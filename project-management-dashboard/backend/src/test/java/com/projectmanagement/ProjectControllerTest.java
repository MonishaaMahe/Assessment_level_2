package com.projectmanagement;

import com.projectmanagement.controller.ProjectController;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.ProjectStatus;
import com.projectmanagement.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
public class ProjectControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ProjectService projectService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    public void testGetAllProjects() throws Exception {
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setStatus(ProjectStatus.NEW);
        
        when(projectService.getAllProjects(null, null)).thenReturn(Arrays.asList(project));
        
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Project"));
    }
    
    @Test
    public void testCreateProject() throws Exception {
        Project project = new Project();
        project.setName("New Project");
        project.setDescription("Test Description");
        project.setStartDate(LocalDate.now());
        project.setStatus(ProjectStatus.NEW);
        
        Project savedProject = new Project();
        savedProject.setId(1L);
        savedProject.setName("New Project");
        savedProject.setDescription("Test Description");
        savedProject.setStartDate(LocalDate.now());
        savedProject.setStatus(ProjectStatus.NEW);
        
        when(projectService.createProject(any(Project.class), any())).thenReturn(savedProject);
        
        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("New Project"));
    }
}