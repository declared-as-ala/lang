package com.linguabridge.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "challenge_questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChallengeQuestion {

    @Id
    private String id;

    /**
     * BEGINNER | INTERMEDIATE | ADVANCED
     */
    private String level;

    @Field("question_en")      // <-- correspond exactement au champ Mongo
    private String questionEn;

    @Field("question_de")
    private String questionDe;
}
