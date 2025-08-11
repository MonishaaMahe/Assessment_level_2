package com.projectmanagement.service;

import com.projectmanagement.entity.TeamMember;
import com.projectmanagement.repository.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamMemberService {
    
    @Autowired
    private TeamMemberRepository teamMemberRepository;
    
    public List<TeamMember> getAllTeamMembers(Long projectId, String userId, String role) {
        // Always return all team members for now to fix assignment issues
        if (projectId != null) {
            return teamMemberRepository.findByProjectId(projectId);
        }
        return teamMemberRepository.findAll();
    }
    
    public TeamMember createTeamMember(TeamMember teamMember) {
        return teamMemberRepository.save(teamMember);
    }
    
    public void deleteTeamMember(Long id) {
        teamMemberRepository.deleteById(id);
    }
}