package com.projectmanagement.repository;

import com.projectmanagement.entity.Attachment;
import com.projectmanagement.entity.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByEntityTypeAndEntityIdOrderByUploadedAtDesc(EntityType entityType, Long entityId);
    List<Attachment> findByUploadedBy(String uploadedBy);
}