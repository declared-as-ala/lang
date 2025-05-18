package com.linguabridge.backend.dto;

import com.linguabridge.backend.model.UserStats;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgressDTO {
    private List<ActivityProgress> activities;
    private UserStats stats;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityProgress {
        private String activityType;
        private String activityId;
        private Integer score;
        private String level;
        private String completedAt;
        private Integer timeSpentMinutes;
        private Boolean completed;
    }
} 