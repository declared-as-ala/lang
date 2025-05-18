package com.linguabridge.backend.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class TogetherAIClient {

    private final WebClient webClient;

    public TogetherAIClient(@Value("${together.api-key}") String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.together.xyz/v1/images/generations")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String generateImage(String prompt) {
        GenerationRequest body = new GenerationRequest(prompt, "black-forest-labs/FLUX.1-schnell-Free");

        try {
            return webClient.post()
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(ImageGenResponse.class)
                    .map(response -> {
                        if (response.data() != null && !response.data().isEmpty()) {
                            return response.data().get(0).url();
                        } else {
                            return "https://placehold.co/600x400?text=Image+Unavailable";
                        }
                    })
                    .block(); // ⬅ force Mono to resolve in blocking context
        } catch (Exception e) {
            return "https://placehold.co/600x400?text=Image+Error";
        }
    }

    public record GenerationRequest(String prompt, String model) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ImageGenResponse(List<ImageData> data) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageData {
        @JsonProperty("url")
        private String url;

        public String url() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}
