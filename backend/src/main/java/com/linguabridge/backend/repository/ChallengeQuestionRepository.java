package com.linguabridge.backend.repository;

import com.linguabridge.backend.model.ChallengeQuestion;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChallengeQuestionRepository
        extends MongoRepository<ChallengeQuestion, String> {

    List<ChallengeQuestion> findByLevelIgnoreCase(String level);

    /** Utilise $match + $sample pour un tirage aléatoire directement côté Mongo */
    @Aggregation(pipeline = {
            "{ $match:  { level:  { $regex: ?0 , $options: 'i' } } }",
            "{ $sample: { size:  ?1 } }"
    })
    List<ChallengeQuestion> sampleByLevel(String level, int size);
}
