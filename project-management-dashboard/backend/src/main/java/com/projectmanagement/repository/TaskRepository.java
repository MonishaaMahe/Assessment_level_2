package com.projectmanagement.repository;

import com.projectmanagement.entity.Task;
import com.projectmanagement.entity.TaskPriority;
import com.projectmanagement.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignedToUserId(String userId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPriority(TaskPriority priority);
    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);
}