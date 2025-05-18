package com.linguabridge.backend.controller;

import com.linguabridge.backend.model.Flashcard;
import com.linguabridge.backend.service.FlashcardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcard")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService service;

    @GetMapping
    public List<Flashcard> getByLevel(@RequestParam String level, @RequestParam(defaultValue = "10") int num) {
        return service.getRandomByLevel(level, num);
    }
}
