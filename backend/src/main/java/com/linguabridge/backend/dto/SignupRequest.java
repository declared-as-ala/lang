package com.linguabridge.backend.dto;

import com.linguabridge.backend.model.Level;
import com.linguabridge.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private Level level;
    
    @Builder.Default
    private Set<Role> roles = Set.of(Role.USER);
}
