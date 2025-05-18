package com.linguabridge.backend.repository;

import com.linguabridge.backend.model.FillBlankQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FillBlankQuestionRepository extends MongoRepository<FillBlankQuestion, String> {
    List<FillBlankQuestion> findByLevelIgnoreCase(String level);
}
