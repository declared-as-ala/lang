// 📁 src/main/java/com/linguabridge/backend/dto/QuizStatsDto.java
package com.linguabridge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizStatsDto {
    private int score;
    private int attempts;
    private LocalDateTime lastUpdated;
}
