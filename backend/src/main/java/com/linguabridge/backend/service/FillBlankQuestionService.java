package com.linguabridge.backend.service;

import com.linguabridge.backend.model.FillBlankQuestion;
import com.linguabridge.backend.repository.FillBlankQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FillBlankQuestionService {

    private final FillBlankQuestionRepository repository;

    public List<FillBlankQuestion> getRandomByLevel(String level, int num) {
        List<FillBlankQuestion> all = repository.findByLevelIgnoreCase(level);
        Collections.shuffle(all);
        return all.stream().limit(num).toList();
    }
}
