package com.linguabridge.backend.dto;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor
public class ChatMessageDTO {
    private String role;     // user | assistant | system
    private String content;  // message text
}
