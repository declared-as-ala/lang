package com.linguabridge.backend.controller.admin;

import com.linguabridge.backend.model.ChallengeQuestion;
import com.linguabridge.backend.service.admin.AdminChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/challenge")
@RequiredArgsConstructor
public class AdminChallengeController {

    private final AdminChallengeService service;

    @GetMapping
    public List<ChallengeQuestion> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChallengeQuestion> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/level/{level}")
    public List<ChallengeQuestion> getByLevel(@PathVariable String level) {
        return service.findByLevel(level);
    }

    @PostMapping
    public ChallengeQuestion create(@RequestBody ChallengeQuestion question) {
        return service.save(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChallengeQuestion> update(
            @PathVariable String id,
            @RequestBody ChallengeQuestion updated) {
        return service.findById(id)
                .map(existing -> {
                    existing.setLevel(updated.getLevel());
                    existing.setQuestionEn(updated.getQuestionEn());
                    existing.setQuestionDe(updated.getQuestionDe());
                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.findById(id).isPresent()) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
