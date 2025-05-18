package com.linguabridge.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document("fill_blank_questions")
public class FillBlankQuestion {

    @Id
    private String id;

    @Field("sentence")
    private String sentence;

    @Field("translation")
    private String translation;

    @Field("question_text")
    private String questionText;

    @Field("correct_answer")
    private String correctAnswer;

    @Field("wrong_answers")
    private List<String> wrongAnswers;

    @Field("level")
    private String level;

    @Field("score")
    private int score;

    public FillBlankQuestion() {}

    public FillBlankQuestion(String sentence, String translation, String questionText,
                              String correctAnswer, List<String> wrongAnswers,
                              String level, int score) {
        this.sentence = sentence;
        this.translation = translation;
        this.questionText = questionText;
        this.correctAnswer = correctAnswer;
        this.wrongAnswers = wrongAnswers;
        this.level = level;
        this.score = score;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSentence() { return sentence; }
    public void setSentence(String sentence) { this.sentence = sentence; }

    public String getTranslation() { return translation; }
    public void setTranslation(String translation) { this.translation = translation; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public List<String> getWrongAnswers() { return wrongAnswers; }
    public void setWrongAnswers(List<String> wrongAnswers) { this.wrongAnswers = wrongAnswers; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}
