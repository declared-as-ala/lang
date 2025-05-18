package com.linguabridge.backend.service;

import com.linguabridge.backend.dto.UserProfileResponse;
import com.linguabridge.backend.dto.UserUpdateRequest;
import com.linguabridge.backend.model.User;
import com.linguabridge.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserProfileResponse getUserProfile(String userId) {
        logger.debug("Fetching user profile for id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", userId);
                    return new RuntimeException("User not found");
                });

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .level(user.getLevel())
                .role(user.getRole())
                .build();
    }

    public UserProfileResponse updateUserProfile(String userId, UserUpdateRequest request) {
        logger.debug("Updating user profile for id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", userId);
                    return new RuntimeException("User not found");
                });

        // Validate email if it's being changed
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                logger.error("Email {} is already in use", request.getEmail());
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        // Update other fields if provided
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getLevel() != null) {
            user.setLevel(request.getLevel());
        }

        logger.debug("Saving updated user profile");
        userRepository.save(user);
        logger.info("User profile updated successfully for id: {}", userId);

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .level(user.getLevel())
                .role(user.getRole())
                .build();
    }
} 