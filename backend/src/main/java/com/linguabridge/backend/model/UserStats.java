package com.linguabridge.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_stats")
public class UserStats {
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    private Integer totalQuizzesTaken;
    private Integer averageQuizScore;
    private Integer totalTranslations;
    private Integer totalChatSessions;
    private Integer totalTimeSpentMinutes;
    private LocalDateTime lastActivityDate;
    private String currentLevel;
} 