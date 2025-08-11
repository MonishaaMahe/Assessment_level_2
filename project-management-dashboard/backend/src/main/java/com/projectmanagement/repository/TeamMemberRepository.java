package com.projectmanagement.repository;

import com.projectmanagement.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    Optional<TeamMember> findByUserId(String userId);
    List<TeamMember> findByProjectId(Long projectId);
}