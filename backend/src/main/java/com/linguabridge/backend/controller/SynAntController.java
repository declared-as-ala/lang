package com.linguabridge.backend.controller;

import com.linguabridge.backend.model.SynAntCard;
import com.linguabridge.backend.service.SynAntCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/synant")
@RequiredArgsConstructor
public class SynAntController {

    private final SynAntCardService service;

    /**
     * Example: GET /api/synant?level=medium&num=10
     */
    @GetMapping
    public List<SynAntCard> getByLevel(
            @RequestParam String level,
            @RequestParam(defaultValue = "10") int num) {
        return service.getByLevel(level, num);
    }
}
