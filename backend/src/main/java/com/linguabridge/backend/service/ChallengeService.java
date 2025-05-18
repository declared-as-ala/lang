package com.linguabridge.backend.service;

import com.linguabridge.backend.model.ChallengeQuestion;
import com.linguabridge.backend.repository.ChallengeQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeQuestionRepository repo;

    /**
     * Renvoie un échantillon aléatoire de `num` questions pour le niveau demandé.
     * Si la collection contient moins de `num` questions, on renvoie tout.
     */
    public List<ChallengeQuestion> getRandomByLevel(String level, int num) {
        if (num <= 0) return Collections.emptyList();
        return repo.sampleByLevel(level, num);
    }
}
