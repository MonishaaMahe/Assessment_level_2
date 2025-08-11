package com.projectmanagement.service;

import com.projectmanagement.entity.Comment;
import com.projectmanagement.entity.EntityType;
import com.projectmanagement.entity.NotificationType;
import com.projectmanagement.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public List<Comment> getComments(EntityType entityType, Long entityId) {
        return commentRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId);
    }
    
    public Comment addComment(Comment comment) {
        Comment savedComment = commentRepository.save(comment);
        
        // Create notification
        String entityName = comment.getEntityType().name().toLowerCase();
        String message = String.format("%s commented on %s #%d", 
            comment.getAuthorId(), entityName, comment.getEntityId());
        
        // In a real app, you'd get the assigned users/project members
        // For now, we'll create a notification for a demo user
        notificationService.createNotification("demo-user", message, NotificationType.COMMENT);
        
        return savedComment;
    }
}