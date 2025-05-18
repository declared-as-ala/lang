// 📁 src/main/java/com/linguabridge/backend/model/UserProgress.java
package com.linguabridge.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "user_progress")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    private String userId;

    /**
     * quizzes maps quizType → ( level → stats )
     * e.g. "challenge" → { "beginner" → QuizStats, "intermediate" → QuizStats, ... }
     */
    private Map<String, Map<String, QuizStats>> quizzes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizStats {
        private int score;
        private int attempts;
        private LocalDateTime lastUpdated;
    }
}
