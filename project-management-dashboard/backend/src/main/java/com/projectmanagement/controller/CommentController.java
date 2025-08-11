package com.projectmanagement.controller;

import com.projectmanagement.entity.Comment;
import com.projectmanagement.entity.EntityType;
import com.projectmanagement.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        Comment savedComment = commentService.addComment(comment);
        return ResponseEntity.ok(savedComment);
    }
    
    @GetMapping
    public ResponseEntity<List<Comment>> getComments(
            @RequestParam EntityType entityType,
            @RequestParam Long entityId) {
        List<Comment> comments = commentService.getComments(entityType, entityId);
        return ResponseEntity.ok(comments);
    }
}