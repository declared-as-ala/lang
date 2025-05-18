package com.linguabridge.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

@Service
@Slf4j
public class GroqChatService {

    private final WebClient client;

    public GroqChatService(@Value("${groq.api-key}") String apiKey) {
        this.client = WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public Map<?, ?> chat(List<Map<String, String>> userMessages) {
        log.debug("Preparing message context for German language learning");

        Map<String, String> systemMessage = Map.of(
            "role", "system",
            "content", """
    You are a helpful language tutor helping users learn German from English.
    You answer questions about vocabulary, grammar, and translation.
    Use simple explanations with examples in both English and German.
    Always stay in the context of language education."""
        );

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(systemMessage);
        messages.addAll(userMessages);

        Map<String, Object> requestBody = Map.of(
            "model", "llama3-70b-8192",
            "messages", messages,
            "temperature", 0.7,
            "max_tokens", 1024
        );

        log.debug("Sending request to Groq API...");

        return client.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .doOnNext(response -> log.debug("Groq response received"))
                .onErrorResume(e -> {
                    log.error("Error during Groq chat call: {}", e.getMessage());
                    return Mono.error(new RuntimeException("Failed to get response from Groq API"));
                })
                .block();
    }
}
