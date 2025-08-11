package com.projectmanagement.repository;

import com.projectmanagement.entity.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    List<TimeEntry> findByUserId(String userId);
    List<TimeEntry> findByProjectId(Long projectId);
    List<TimeEntry> findByTaskId(Long taskId);
    List<TimeEntry> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(t.hoursSpent) FROM TimeEntry t WHERE t.projectId = :projectId")
    Float getTotalHoursByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT SUM(t.hoursSpent) FROM TimeEntry t WHERE t.taskId = :taskId")
    Float getTotalHoursByTask(@Param("taskId") Long taskId);
    
    @Query("SELECT COUNT(t) FROM TimeEntry t WHERE t.projectId = :projectId")
    Integer getEntryCountByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT COUNT(t) FROM TimeEntry t WHERE t.taskId = :taskId")
    Integer getEntryCountByTask(@Param("taskId") Long taskId);
}