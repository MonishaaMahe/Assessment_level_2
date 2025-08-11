package com.projectmanagement.service;

import com.projectmanagement.entity.Attachment;
import com.projectmanagement.entity.EntityType;
import com.projectmanagement.repository.AttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentService {
    
    @Autowired
    private AttachmentRepository attachmentRepository;
    
    private final String uploadDir = "uploads/";
    
    public List<Attachment> getAttachments(EntityType entityType, Long entityId) {
        return attachmentRepository.findByEntityTypeAndEntityIdOrderByUploadedAtDesc(entityType, entityId);
    }
    
    public Attachment uploadFile(MultipartFile file, EntityType entityType, Long entityId, String uploadedBy) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);
        
        // Create attachment record
        Attachment attachment = new Attachment();
        attachment.setEntityType(entityType);
        attachment.setEntityId(entityId);
        attachment.setFileName(originalFilename);
        attachment.setFileUrl(filePath.toString());
        attachment.setUploadedBy(uploadedBy);
        
        return attachmentRepository.save(attachment);
    }
    
    public byte[] downloadFile(Long attachmentId) throws IOException {
        Attachment attachment = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new RuntimeException("Attachment not found"));
        
        Path filePath = Paths.get(attachment.getFileUrl());
        return Files.readAllBytes(filePath);
    }
}