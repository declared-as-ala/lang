package com.linguabridge.backend.controller.admin;

import com.linguabridge.backend.model.ConjugationQuestion;
import com.linguabridge.backend.service.admin.AdminConjugationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/conjugation")
@RequiredArgsConstructor
public class AdminConjugationController {

    private final AdminConjugationService service;

    @GetMapping
    public List<ConjugationQuestion> getAll() {
        return service.findAll();
    }

    @PostMapping
    public ConjugationQuestion create(@RequestBody ConjugationQuestion question) {
        return service.save(question);
    }

    @PutMapping("/{id}")
    public ConjugationQuestion update(@PathVariable String id, @RequestBody ConjugationQuestion question) {
        question.setId(id);
        return service.save(question);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
