package com.linguabridge.backend.controller;

import com.linguabridge.backend.model.ConjugationQuestion;
import com.linguabridge.backend.service.ConjugationQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conjugation")
@RequiredArgsConstructor
public class ConjugationController {

    private final ConjugationQuestionService service;

    @GetMapping
    public List<ConjugationQuestion> getByLevel(
            @RequestParam String level,
            @RequestParam(defaultValue = "10") int num
    ) {
        return service.getRandomByLevel(level, num);
    }
}
