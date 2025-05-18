package com.linguabridge.backend.service.admin;

import com.linguabridge.backend.model.ConjugationQuestion;
import com.linguabridge.backend.repository.ConjugationQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminConjugationService {

    private final ConjugationQuestionRepository repo;

    public List<ConjugationQuestion> findAll() {
        return repo.findAll();
    }

    public Optional<ConjugationQuestion> findById(String id) {
        return repo.findById(id);
    }

    public ConjugationQuestion save(ConjugationQuestion q) {
        return repo.save(q);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
