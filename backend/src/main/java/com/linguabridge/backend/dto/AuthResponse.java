package com.linguabridge.backend.dto;

import com.linguabridge.backend.model.Level;
import com.linguabridge.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseCookie;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private ResponseCookie cookie;
    private UserResponse user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private String id;
        private String name;
        private String email;
        private Level level;
        private Integer score;
        private Set<Role> roles;
    }
}
