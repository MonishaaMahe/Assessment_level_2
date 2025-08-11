package com.projectmanagement.dto;

public class TimeSummaryDTO {
    private Long entityId;
    private String entityName;
    private Float totalHours;
    private Integer entryCount;
    
    public TimeSummaryDTO(Long entityId, String entityName, Float totalHours, Integer entryCount) {
        this.entityId = entityId;
        this.entityName = entityName;
        this.totalHours = totalHours;
        this.entryCount = entryCount;
    }
    
    // Getters and Setters
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    
    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }
    
    public Float getTotalHours() { return totalHours; }
    public void setTotalHours(Float totalHours) { this.totalHours = totalHours; }
    
    public Integer getEntryCount() { return entryCount; }
    public void setEntryCount(Integer entryCount) { this.entryCount = entryCount; }
}