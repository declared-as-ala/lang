package com.linguabridge.backend.controller;

import com.linguabridge.backend.dto.UserProfileDTO;
import com.linguabridge.backend.dto.UserProfileUpdateDTO;
import com.linguabridge.backend.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    /**
     * ✅ GET : récupérer les informations du profil connecté
     */
    @GetMapping
    public UserProfileDTO getProfile() {
        return userProfileService.getProfile();
    }

    /**
     * ✅ PUT : mettre à jour les informations du profil connecté
     */
    @PutMapping
    public UserProfileDTO updateProfile(@Valid @RequestBody UserProfileUpdateDTO dto) {
        return userProfileService.updateProfile(dto);
    }
}
