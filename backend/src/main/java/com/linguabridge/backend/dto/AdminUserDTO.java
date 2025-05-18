package com.linguabridge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminUserDTO {
    private String id;
    private String name;
    private String email;
    private String role;
    private Integer score;
    private String level;
}
