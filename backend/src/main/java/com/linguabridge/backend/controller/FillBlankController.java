package com.linguabridge.backend.controller;

import com.linguabridge.backend.model.FillBlankQuestion;
import com.linguabridge.backend.service.FillBlankQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fillblank")
@RequiredArgsConstructor
public class FillBlankController {

    private final FillBlankQuestionService service;

    @GetMapping
    public List<FillBlankQuestion> getByLevel(
            @RequestParam String level,
            @RequestParam(defaultValue = "10") int num) {
        return service.getRandomByLevel(level, num);
    }
}
