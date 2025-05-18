package com.linguabridge.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChatCompletionDTO {
    private String id;
    private String model;
    private List<Choice> choices;
    private Usage usage;

    @Data public static class Choice {
        private int index;
        private ChatMessageDTO message;
        private String finishReason;
    }
    @Data public static class Usage {
        private int promptTokens;
        private int completionTokens;
        private int totalTokens;
    }
}
