package com.linguabridge.backend.repository;

import com.linguabridge.backend.model.Flashcard;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FlashcardRepository extends MongoRepository<Flashcard, String> {
    List<Flashcard> findByLevelIgnoreCase(String level);
}
