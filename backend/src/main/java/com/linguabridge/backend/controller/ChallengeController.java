package com.linguabridge.backend.controller;

import com.linguabridge.backend.model.ChallengeQuestion;
import com.linguabridge.backend.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenge")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService service;

    /**
     * Exemple :  GET /api/challenge?level=beginner&num=10
     */
    @GetMapping
    public List<ChallengeQuestion> getRandomByLevel(
            @RequestParam String level,
            @RequestParam(defaultValue = "10") int num) {

        return service.getRandomByLevel(level, num);
    }
}
