package com.projectmanagement.repository;

import com.projectmanagement.entity.Comment;
import com.projectmanagement.entity.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(EntityType entityType, Long entityId);
    List<Comment> findByAuthorId(String authorId);
}