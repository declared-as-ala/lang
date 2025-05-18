// 📁 src/main/java/com/linguabridge/backend/dto/QuizQuestionDto.java
package com.linguabridge.backend.dto;

import java.util.List;

public record QuizQuestionDto(
        String id,
        String level,
        String term,
        List<String> options,
        String correctAnswer
) {}
