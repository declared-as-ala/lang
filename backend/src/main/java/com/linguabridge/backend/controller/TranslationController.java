package com.linguabridge.backend.controller;

import com.linguabridge.backend.dto.TranslateParagraphRequest;
import com.linguabridge.backend.dto.TranslateParagraphResponse;
import com.linguabridge.backend.service.GroqTranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/translate")
@RequiredArgsConstructor
public class TranslationController {

    private final GroqTranslationService groqTranslationService;

    @PostMapping("/paragraph")
    public ResponseEntity<TranslateParagraphResponse> translateParagraph(
            @RequestBody TranslateParagraphRequest request
    ) {
        return ResponseEntity.ok(groqTranslationService.translate(request));
    }
}
