package com.linguabridge.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Server → browser payload:
 *
 * {
 *   "english": "apple",
 *   "german":  "der Apfel",
 *   "pronunciation": "/ˈapfəl/",
 *   "imageUrl": "https://...",
 *   "exampleEnglish": "I like to eat an apple …",
 *   "exampleGerman": "Ich esse gern einen Apfel …",
 *   "tags": ["food","fruit","basic"]
 * }
 */
@Data
@Builder
public class TranslateResponse {

    private String english;
    private String german;
    private String pronunciation;     // IPA or “—” if unknown

    private String imageUrl;          // Together-AI (or placeholder)

    private String exampleEnglish;
    private String exampleGerman;
    private String status;

    private List<String> tags;        // e.g. ["food", "fruit"]
}
