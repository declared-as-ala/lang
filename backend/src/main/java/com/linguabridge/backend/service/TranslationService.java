package com.linguabridge.backend.service;

import com.linguabridge.backend.client.TogetherAIClient;
import com.linguabridge.backend.dto.TranslateRequest;
import com.linguabridge.backend.dto.TranslateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Converts ENG → DE and fetches an illustration.
 */
@Service
@RequiredArgsConstructor
public class TranslationService {

    private final TogetherAIClient togetherAIClient;

    // ► Replace with a real dictionary or AI in production
    private static final Map<String, String> WORDS = Map.of(
            "dog", "der Hund",
            "apple", "der Apfel",
            "cat", "die Katze"
    );

    private static final Map<String, String> PRONUNCIATIONS = Map.of(
            "dog", "[dɔg]",
            "apple", "[ˈæpəl]",
            "cat", "[kæt]"
    );

    public TranslateResponse translate(TranslateRequest req) {
        String english = req.getText().trim().toLowerCase();
        String german = WORDS.getOrDefault(english, "—");
        boolean found = WORDS.containsKey(english);

        // 1. Generate image
        String img;
        try {
            img = togetherAIClient.generateImage(english);
        } catch (Exception e) {
            img = "https://placehold.co/600x400?text=Image+Unavailable";
        }

        // 2. Get pronunciation if available
        String pronunciation = PRONUNCIATIONS.getOrDefault(english, "—");

        // 3. Generate example sentences
        String exampleEnglish = found
                ? "The " + english + " is in the garden."
                : "No example available.";

        String exampleGerman = found
                ? german + " ist im Garten."
                : "Kein Beispiel verfügbar.";

        // 4. Tags and status
        List<String> tags = found ? List.of("demo", "flashcard") : List.of();
        String status = found ? "success" : "not_found";

        return TranslateResponse.builder()
                .english(english)
                .german(german)
                .pronunciation(pronunciation)
                .imageUrl(img)
                .exampleEnglish(exampleEnglish)
                .exampleGerman(exampleGerman)
                .tags(tags)
                .status(status)
                .build();
    }
}
