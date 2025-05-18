// 📁 src/main/java/com/linguabridge/backend/controller/UserProgressController.java
package com.linguabridge.backend.controller;

import com.linguabridge.backend.dto.ProgressResponse;
import com.linguabridge.backend.dto.QuizScoreRequest;
import com.linguabridge.backend.service.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final UserProgressService service;

    /** Save or update a quiz score **/
    @PostMapping
    public ResponseEntity<Void> saveScore(@RequestBody QuizScoreRequest req) {
        service.saveOrUpdateScore(req);
        return ResponseEntity.ok().build();
    }

    /** Get all progress for a user **/
    @GetMapping("/{userId}")
    public ResponseEntity<ProgressResponse> getProgress(@PathVariable String userId) {
        return ResponseEntity.ok(service.getProgress(userId));
    }
}
