package com.linguabridge.backend.controller;

import com.linguabridge.backend.dto.TranslateRequest;
import com.linguabridge.backend.dto.TranslateResponse;
import com.linguabridge.backend.service.TranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TranslateController {

    private final TranslationService translationService;

    @PostMapping("/translate")
    public TranslateResponse translate(@RequestBody TranslateRequest req) {
        return translationService.translate(req);
    }
}
