package com.projectmanagement.service;

import com.projectmanagement.entity.Notification;
import com.projectmanagement.entity.NotificationType;
import com.projectmanagement.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }
    
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
    
    public void createNotification(String recipientId, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setRecipientId(recipientId);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);
    }
}