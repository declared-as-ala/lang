package com.linguabridge.backend.repository;

import com.linguabridge.backend.model.ConjugationQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ConjugationQuestionRepository extends MongoRepository<ConjugationQuestion, String> {
    List<ConjugationQuestion> findByDifficultyIgnoreCase(String difficulty);
}
