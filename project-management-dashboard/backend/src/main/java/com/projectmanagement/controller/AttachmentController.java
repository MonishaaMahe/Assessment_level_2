package com.projectmanagement.controller;

import com.projectmanagement.entity.Attachment;
import com.projectmanagement.entity.EntityType;
import com.projectmanagement.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/attachments")
@CrossOrigin(origins = "http://localhost:3000")
public class AttachmentController {
    
    @Autowired
    private AttachmentService attachmentService;
    
    @PostMapping
    public ResponseEntity<Attachment> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam EntityType entityType,
            @RequestParam Long entityId,
            @RequestParam String uploadedBy) throws IOException {
        
        Attachment attachment = attachmentService.uploadFile(file, entityType, entityId, uploadedBy);
        return ResponseEntity.ok(attachment);
    }
    
    @GetMapping
    public ResponseEntity<List<Attachment>> getAttachments(
            @RequestParam EntityType entityType,
            @RequestParam Long entityId) {
        List<Attachment> attachments = attachmentService.getAttachments(entityType, entityId);
        return ResponseEntity.ok(attachments);
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) throws IOException {
        byte[] fileContent = attachmentService.downloadFile(id);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment")
                .body(fileContent);
    }
}