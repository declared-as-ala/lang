package com.linguabridge.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Data
public class UserProfileUpdateDTO {

    @Size(min = 2, max = 50)
    private String name;

    @Email
    private String email;

   
    private String password;

    private Integer score;

    private String level; // "BEGINNER", "INTERMEDIATE", etc.
}
