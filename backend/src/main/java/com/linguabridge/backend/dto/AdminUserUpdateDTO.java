package com.linguabridge.backend.dto;

import lombok.Data;

@Data
public class AdminUserUpdateDTO {
    private String name;
    private String email;
    private String password;
    private String role; // "ADMIN" ou "USER"
    private Integer score;
    private String level; // "BEGINNER", "INTERMEDIATE", "ADVANCED"
}
