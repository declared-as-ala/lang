package com.linguabridge.backend.repository;

import com.linguabridge.backend.model.QuizQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends MongoRepository<QuizQuestion, String> {
 List<QuizQuestion> findByModeAndLevel(String mode, String level);

}