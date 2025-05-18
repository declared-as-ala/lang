package com.linguabridge.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.bson.Document;

@RestController
@RequestMapping("/api/v1")
public class TestController {
    
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);
    
    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/test")
    public String testApi() {
        logger.info("Test endpoint called");
        return "✅ API is working!";
    }

    @GetMapping("/test-db")
    public ResponseEntity<String> testDatabase() {
        try {
            Document pingCommand = new Document("ping", 1);
            mongoTemplate.getDb().runCommand(pingCommand);
            logger.info("MongoDB connection successful");
            return ResponseEntity.ok("✅ MongoDB connection successful!");
        } catch (Exception e) {
            logger.error("MongoDB connection failed", e);
            return ResponseEntity.internalServerError().body("❌ MongoDB connection failed: " + e.getMessage());
        }
    }
}
