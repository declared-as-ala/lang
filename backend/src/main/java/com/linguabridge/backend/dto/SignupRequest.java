package com.linguabridge.backend.dto;

import com.linguabridge.backend.model.Level;
import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private Level level; // peut être null, fallback dans service
}
