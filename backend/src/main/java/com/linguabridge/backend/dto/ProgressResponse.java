// 📁 src/main/java/com/linguabridge/backend/dto/ProgressResponse.java
package com.linguabridge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {
    /**
     * quizzes maps quizType → ( level → QuizStatsDto )
     */
    private Map<String, Map<String, QuizStatsDto>> quizzes;
}
