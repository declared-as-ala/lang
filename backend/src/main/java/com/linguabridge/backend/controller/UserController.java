package com.linguabridge.backend.controller;

import com.linguabridge.backend.dto.UserProfileResponse;
import com.linguabridge.backend.dto.UserUpdateRequest;
import com.linguabridge.backend.model.User;
import com.linguabridge.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    @GetMapping("/{userId}")
    @PreAuthorize("authentication.name == #userId or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable String userId) {
        logger.info("Fetching profile for user: {}", userId);
        UserProfileResponse profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("authentication.principal.id == #userId or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @PathVariable String userId,
            @RequestBody UserUpdateRequest request) {
        logger.info("Updating profile for user: {}", userId);
        UserProfileResponse updatedProfile = userService.updateUserProfile(userId, request);
        return ResponseEntity.ok(updatedProfile);
    }
} 