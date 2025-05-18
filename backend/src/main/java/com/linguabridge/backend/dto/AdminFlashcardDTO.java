package com.linguabridge.backend.dto;

import lombok.Data;

@Data
public class AdminFlashcardDTO {
    private String id;
    private Integer cardId;
    private String english;
    private String german;
    private String article;
    private String exampleSentence;
    private String level;
}
