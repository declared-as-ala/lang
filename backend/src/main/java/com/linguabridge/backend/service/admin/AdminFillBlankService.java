package com.linguabridge.backend.service.admin;

import com.linguabridge.backend.model.FillBlankQuestion;
import com.linguabridge.backend.repository.FillBlankQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminFillBlankService {

    private final FillBlankQuestionRepository repository;

    public List<FillBlankQuestion> findAll() {
        return repository.findAll();
    }

    public Optional<FillBlankQuestion> findById(String id) {
        return repository.findById(id);
    }

    public FillBlankQuestion save(FillBlankQuestion question) {
        return repository.save(question);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
