package com.linguabridge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private String id;
    private String name;
    private String email;
    private Integer score;
    private String level;
    private String role; // facultatif : utile pour afficher sur la page profil
}
