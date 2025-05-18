// ✅ Model: QuizQuestion.java
package com.linguabridge.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "quiz_questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuizQuestion {
    @Id
    private String id;
    private String type; // e.g. "flashcards", "sentence_builder"
    private String level;
    private String mode; // à la place de type
; // beginner, intermediate, advanced
    private String term; // the word/phrase/question
    private List<String> options;
    private String correctAnswer;
}
