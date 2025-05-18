package com.linguabridge.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "conjugation_questions")
public class ConjugationQuestion {

    @Id
    @Field("_id")  // ← identifiant MongoDB sera exposé comme "id"
    private String id;

    @Field("question_id")
    private Integer questionId;

    @Field("verb")
    private String verb;

    @Field("translation")
    private String translation;

    @Field("tense")
    private String tense;

    @Field("subject")
    private String subject;

    @Field("question_text")
    private String questionText;

    @Field("correct_answer")
    private String correctAnswer;

    @Field("wrong_answers")
    private List<String> wrongAnswers;

    @Field("difficulty")
    private String difficulty;

    @Field("score_value")
    private Integer scoreValue;

    // 🔹 Constructeurs
    public ConjugationQuestion() {}

    public ConjugationQuestion(Integer questionId, String verb, String translation, String tense,
                               String subject, String questionText, String correctAnswer,
                               List<String> wrongAnswers, String difficulty, Integer scoreValue) {
        this.questionId = questionId;
        this.verb = verb;
        this.translation = translation;
        this.tense = tense;
        this.subject = subject;
        this.questionText = questionText;
        this.correctAnswer = correctAnswer;
        this.wrongAnswers = wrongAnswers;
        this.difficulty = difficulty;
        this.scoreValue = scoreValue;
    }

    // 🔹 Getters / Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Integer getQuestionId() { return questionId; }
    public void setQuestionId(Integer questionId) { this.questionId = questionId; }

    public String getVerb() { return verb; }
    public void setVerb(String verb) { this.verb = verb; }

    public String getTranslation() { return translation; }
    public void setTranslation(String translation) { this.translation = translation; }

    public String getTense() { return tense; }
    public void setTense(String tense) { this.tense = tense; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public List<String> getWrongAnswers() { return wrongAnswers; }
    public void setWrongAnswers(List<String> wrongAnswers) { this.wrongAnswers = wrongAnswers; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getScoreValue() { return scoreValue; }
    public void setScoreValue(Integer scoreValue) { this.scoreValue = scoreValue; }
}
