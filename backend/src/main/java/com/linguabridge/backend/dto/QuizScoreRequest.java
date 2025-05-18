// 📁 src/main/java/com/linguabridge/backend/dto/QuizScoreRequest.java
package com.linguabridge.backend.dto;

import lombok.Data;

@Data
public class QuizScoreRequest {
    private String userId;
    private String quizType;    // e.g. "challenge", "conjugation", ...
    private String level;       // "beginner", "intermediate", "advanced"
    private int score;
}
