package com.linguabridge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Incoming payload from the browser:
 * {
 *   "text": "apple"
 * }
 */
@Data                     // getters + setters + toString, etc.
@NoArgsConstructor        // for Jackson
@AllArgsConstructor        // convenience ctor
public class TranslateRequest {

    /** The English word / phrase to translate. */
    private String text;

    /*  ▶︎  Add more fields later if you need (e.g. target language). */
}
