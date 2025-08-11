package com.projectmanagement.controller;

import com.projectmanagement.entity.Notification;
import com.projectmanagement.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam String userId) {
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }
}