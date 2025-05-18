package com.linguabridge.backend.service;

import com.linguabridge.backend.model.ConjugationQuestion;
import com.linguabridge.backend.repository.ConjugationQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConjugationQuestionService {

    private final ConjugationQuestionRepository repository;

    public List<ConjugationQuestion> getRandomByLevel(String level, int num) {
        List<ConjugationQuestion> list = repository.findByDifficultyIgnoreCase(level);
        Collections.shuffle(list);
        return list.stream().limit(num).toList();
    }

    public List<ConjugationQuestion> findAll() {
        return repository.findAll();
    }

    public ConjugationQuestion save(ConjugationQuestion question) {
        return repository.save(question);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
