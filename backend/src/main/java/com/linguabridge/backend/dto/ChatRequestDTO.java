package com.linguabridge.backend.dto;

import lombok.*;

import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor
public class ChatRequestDTO {
    private String model;
    private List<ChatMessageDTO> messages;
    private Double temperature;
    private Integer maxTokens;
}
