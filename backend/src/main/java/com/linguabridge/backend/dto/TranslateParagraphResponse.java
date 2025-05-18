package com.linguabridge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TranslateParagraphResponse {
    private String original;
    private String translated;
}