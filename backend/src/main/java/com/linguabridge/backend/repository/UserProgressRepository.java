// 📁 src/main/java/com/linguabridge/backend/repository/UserProgressRepository.java
package com.linguabridge.backend.repository;

import com.linguabridge.backend.model.UserProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
}
