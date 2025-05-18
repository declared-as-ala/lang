package com.linguabridge.backend.controller.admin;

import com.linguabridge.backend.model.Flashcard;
import com.linguabridge.backend.service.FlashcardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/flashcard")
@RequiredArgsConstructor
public class AdminFlashcardController {

    private final FlashcardService service;

    @GetMapping
    public List<Flashcard> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Flashcard create(@RequestBody Flashcard flashcard) {
        return service.save(flashcard);
    }

    @PutMapping("/{id}")
    public Flashcard update(@PathVariable String id, @RequestBody Flashcard flashcard) {
        flashcard.setMongoId(id);
        return service.save(flashcard);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
