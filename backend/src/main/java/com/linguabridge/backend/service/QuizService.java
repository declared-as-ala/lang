package com.linguabridge.backend.service;

import com.linguabridge.backend.model.QuizQuestion;
import com.linguabridge.backend.repository.QuizQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizQuestionRepository quizRepo;

    public List<QuizQuestion> getQuestionsByModeAndLevel(String mode, String level) {
        return quizRepo.findByModeAndLevel(mode, level);
    }
}
