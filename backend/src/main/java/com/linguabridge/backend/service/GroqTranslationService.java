package com.linguabridge.backend.service;

import com.linguabridge.backend.dto.TranslateParagraphRequest;
import com.linguabridge.backend.dto.TranslateParagraphResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GroqTranslationService {

    private final WebClient groqWebClient;

    public TranslateParagraphResponse translate(TranslateParagraphRequest request) {
        var prompt = "Translate this English paragraph to German and respond only with the translation:\n\n" + request.getText();

        var requestBody = Map.of(
                "model", "llama3-8b-8192",
                "messages", new Object[]{
                        Map.of("role", "user", "content", prompt)
                },
                "temperature", 0.3
        );

        Map<?, ?> response = groqWebClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        var choices = (java.util.List<Map<String, Object>>) response.get("choices");
        var content = ((Map<String, String>) choices.get(0).get("message")).get("content");

        return new TranslateParagraphResponse(request.getText(), content);
    }
}
