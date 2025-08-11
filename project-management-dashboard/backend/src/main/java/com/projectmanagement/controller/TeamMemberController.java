package com.projectmanagement.controller;

import com.projectmanagement.entity.TeamMember;
import com.projectmanagement.service.TeamMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team-members")
@CrossOrigin(origins = "*")
@Tag(name = "Team Member Management", description = "APIs for managing team members")
public class TeamMemberController {
    
    @Autowired
    private TeamMemberService teamMemberService;
    
    @GetMapping
    @Operation(summary = "Get all team members")
    public List<TeamMember> getAllTeamMembers(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String role) {
        return teamMemberService.getAllTeamMembers(projectId, userId, role);
    }
    
    @PostMapping
    @Operation(summary = "Create new team member")
    public TeamMember createTeamMember(@RequestBody TeamMember teamMember) {
        return teamMemberService.createTeamMember(teamMember);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete team member")
    public ResponseEntity<?> deleteTeamMember(@PathVariable Long id) {
        teamMemberService.deleteTeamMember(id);
        return ResponseEntity.ok().build();
    }
}