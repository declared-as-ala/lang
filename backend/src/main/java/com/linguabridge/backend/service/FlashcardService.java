package com.linguabridge.backend.service;

import com.linguabridge.backend.model.Flashcard;
import com.linguabridge.backend.repository.FlashcardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository repository;

    public List<Flashcard> getAll() {
        return repository.findAll();
    }

    public List<Flashcard> getByLevel(String level) {
        return repository.findByLevelIgnoreCase(level);
    }

    public List<Flashcard> getRandomByLevel(String level, int num) {
        List<Flashcard> list = repository.findByLevelIgnoreCase(level);
        Collections.shuffle(list);
        return list.stream().limit(num).toList();
    }

    public Flashcard save(Flashcard card) {
        return repository.save(card);
    }

    public void delete(String mongoId) {
        repository.deleteById(mongoId);
    }
}
