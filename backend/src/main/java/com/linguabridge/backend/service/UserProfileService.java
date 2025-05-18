package com.linguabridge.backend.service;

import com.linguabridge.backend.dto.UserProfileDTO;
import com.linguabridge.backend.dto.UserProfileUpdateDTO;
import com.linguabridge.backend.model.Level;
import com.linguabridge.backend.model.User;
import com.linguabridge.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileDTO getProfile() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));

        return mapToDTO(user);
    }

    @Transactional
    public UserProfileDTO updateProfile(UserProfileUpdateDTO dto) {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));

        // ✅ Mise à jour conditionnelle
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new IllegalArgumentException("Email déjà utilisé.");
            }
            user.setEmail(dto.getEmail());
        }

        if (dto.getName() != null) {
            user.setName(dto.getName());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getScore() != null) {
            user.setScore(dto.getScore());
        }

        if (dto.getLevel() != null) {
            try {
                user.setLevel(Level.valueOf(dto.getLevel().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Niveau invalide. Ex: BEGINNER, INTERMEDIATE, ADVANCED");
            }
        }

        userRepository.save(user);
        return mapToDTO(user);
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private UserProfileDTO mapToDTO(User user) {
        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getScore(),
                user.getLevel().name(),
                user.getRole()
        );
    }
}
