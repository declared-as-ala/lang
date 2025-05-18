package com.linguabridge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressRequest {
    private String activityType;
    private String activityId;
    private Integer score;
    private Integer timeSpent;
    private Boolean completed;
} 