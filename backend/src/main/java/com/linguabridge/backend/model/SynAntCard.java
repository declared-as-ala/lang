package com.linguabridge.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "syn_ant_cards")
public class SynAntCard {

    @Id
    private String id;

    @Field("id")
    private Integer cardId;

    @Field("word_english")
    private String wordEnglish;

    @Field("word_german")
    private String wordGerman;

    @Field("synonym_english")
    private String synonymEnglish;

    @Field("synonym_german")
    private String synonymGerman;

    @Field("antonym_english")
    private String antonymEnglish;

    @Field("antonym_german")
    private String antonymGerman;

    @Field("level")
    private String level;

    @Field("score")
    private Integer score;

    // 🔹 Constructeurs
    public SynAntCard() {}

    public SynAntCard(Integer cardId, String wordEnglish, String wordGerman,
                      String synonymEnglish, String synonymGerman,
                      String antonymEnglish, String antonymGerman,
                      String level, Integer score) {
        this.cardId = cardId;
        this.wordEnglish = wordEnglish;
        this.wordGerman = wordGerman;
        this.synonymEnglish = synonymEnglish;
        this.synonymGerman = synonymGerman;
        this.antonymEnglish = antonymEnglish;
        this.antonymGerman = antonymGerman;
        this.level = level;
        this.score = score;
    }

    // 🔹 Getters
    public String getId() { return id; }
    public Integer getCardId() { return cardId; }
    public String getWordEnglish() { return wordEnglish; }
    public String getWordGerman() { return wordGerman; }
    public String getSynonymEnglish() { return synonymEnglish; }
    public String getSynonymGerman() { return synonymGerman; }
    public String getAntonymEnglish() { return antonymEnglish; }
    public String getAntonymGerman() { return antonymGerman; }
    public String getLevel() { return level; }
    public Integer getScore() { return score; }

    // 🔹 Setters
    public void setId(String id) { this.id = id; }
    public void setCardId(Integer cardId) { this.cardId = cardId; }
    public void setWordEnglish(String wordEnglish) { this.wordEnglish = wordEnglish; }
    public void setWordGerman(String wordGerman) { this.wordGerman = wordGerman; }
    public void setSynonymEnglish(String synonymEnglish) { this.synonymEnglish = synonymEnglish; }
    public void setSynonymGerman(String synonymGerman) { this.synonymGerman = synonymGerman; }
    public void setAntonymEnglish(String antonymEnglish) { this.antonymEnglish = antonymEnglish; }
    public void setAntonymGerman(String antonymGerman) { this.antonymGerman = antonymGerman; }
    public void setLevel(String level) { this.level = level; }
    public void setScore(Integer score) { this.score = score; }
}
