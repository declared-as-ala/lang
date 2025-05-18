package com.linguabridge.backend.dto;

import com.linguabridge.backend.model.Level;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String id;
    private String name;
    private String email;
    private Level level;
    private String role;
} 