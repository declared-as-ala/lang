package com.linguabridge.backend.dto;

import lombok.Data;

@Data
public class FlashcardDTO {
    private String id;
    private Integer cardId;
    private String english;
    private String german;
    private String article;
    private String exampleSentence;
    private String level;
}
