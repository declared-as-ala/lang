package com.linguabridge.backend.repository;

import com.linguabridge.backend.model.UserStats;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserStatsRepository extends MongoRepository<UserStats, String> {
    UserStats findByUserId(String userId);
} 