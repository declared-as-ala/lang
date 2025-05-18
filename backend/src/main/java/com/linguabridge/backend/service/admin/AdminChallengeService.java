package com.linguabridge.backend.service.admin;

import com.linguabridge.backend.model.ChallengeQuestion;
import com.linguabridge.backend.repository.ChallengeQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminChallengeService {

    private final ChallengeQuestionRepository repository;

    // 🔹 Get all questions
    public List<ChallengeQuestion> findAll() {
        return repository.findAll();
    }

    // 🔹 Get one by ID
    public Optional<ChallengeQuestion> findById(String id) {
        return repository.findById(id);
    }

    // 🔹 Create or update a question
    public ChallengeQuestion save(ChallengeQuestion question) {
        return repository.save(question);
    }

    // 🔹 Delete by ID
    public void delete(String id) {
        repository.deleteById(id);
    }

    // 🔹 Get all by level (case-insensitive)
    public List<ChallengeQuestion> findByLevel(String level) {
        return repository.findByLevelIgnoreCase(level);
    }
}
