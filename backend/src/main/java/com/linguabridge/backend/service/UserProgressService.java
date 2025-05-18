// 📁 src/main/java/com/linguabridge/backend/service/UserProgressService.java
package com.linguabridge.backend.service;

import com.linguabridge.backend.dto.ProgressResponse;
import com.linguabridge.backend.dto.QuizScoreRequest;
import com.linguabridge.backend.dto.QuizStatsDto;
import com.linguabridge.backend.model.UserProgress;
import com.linguabridge.backend.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository repo;

    /**
     * Save or update a single quiz score.
     */
    public void saveOrUpdateScore(QuizScoreRequest req) {
        UserProgress up = repo.findById(req.getUserId()).orElseGet(() ->
                UserProgress.builder()
                        .userId(req.getUserId())
                        .quizzes(new HashMap<>())
                        .build()
        );

        // get or create quizType map
        Map<String, UserProgress.QuizStats> levelMap =
                up.getQuizzes().computeIfAbsent(req.getQuizType(), k -> new HashMap<>());

        // update stats for this level
        UserProgress.QuizStats stats = levelMap.getOrDefault(req.getLevel(),
                new UserProgress.QuizStats(0, 0, LocalDateTime.now()));
        stats.setScore(req.getScore());
        stats.setAttempts(stats.getAttempts() + 1);
        stats.setLastUpdated(LocalDateTime.now());

        levelMap.put(req.getLevel(), stats);
        up.getQuizzes().put(req.getQuizType(), levelMap);

        repo.save(up);
    }

    /**
     * Fetch progress for a user.
     */
    public ProgressResponse getProgress(String userId) {
        return repo.findById(userId)
                .map(up -> {
                    // convert entity → DTO
                    Map<String, Map<String, QuizStatsDto>> dtoMap = new HashMap<>();
                    up.getQuizzes().forEach((quizType, lvlMap) -> {
                        Map<String, QuizStatsDto> inner = new HashMap<>();
                        lvlMap.forEach((lvl, stats) ->
                                inner.put(lvl, new QuizStatsDto(
                                        stats.getScore(),
                                        stats.getAttempts(),
                                        stats.getLastUpdated()
                                ))
                        );
                        dtoMap.put(quizType, inner);
                    });
                    return new ProgressResponse(dtoMap);
                })
                .orElse(new ProgressResponse(new HashMap<>()));
    }
}
