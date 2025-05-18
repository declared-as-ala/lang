package com.linguabridge.backend.repository;

import com.linguabridge.backend.model.SynAntCard;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SynAntCardRepository extends MongoRepository<SynAntCard, String> {
    List<SynAntCard> findByLevelIgnoreCase(String level);
}
