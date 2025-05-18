package com.linguabridge.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "flashcards")
public class Flashcard {

    @Id
    private String mongoId;

    @Field("id")
    private Integer id;

    private String english;
    private String german;
    private String article;

    @Field("example_sentence")
    private String exampleSentence;

    private String level;
    private Integer score;

    public Flashcard() {}

    public Flashcard(Integer id, String english, String german, String article, String exampleSentence, String level, Integer score) {
        this.id = id;
        this.english = english;
        this.german = german;
        this.article = article;
        this.exampleSentence = exampleSentence;
        this.level = level;
        this.score = score;
    }

    public String getMongoId() { return mongoId; }
    public void setMongoId(String mongoId) { this.mongoId = mongoId; }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getEnglish() { return english; }
    public void setEnglish(String english) { this.english = english; }

    public String getGerman() { return german; }
    public void setGerman(String german) { this.german = german; }

    public String getArticle() { return article; }
    public void setArticle(String article) { this.article = article; }

    public String getExampleSentence() { return exampleSentence; }
    public void setExampleSentence(String exampleSentence) { this.exampleSentence = exampleSentence; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public void setId(String id2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setId'");
    }
}
