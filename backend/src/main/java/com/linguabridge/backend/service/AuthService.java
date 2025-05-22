package com.linguabridge.backend.service;

import com.linguabridge.backend.dto.AuthResponse;
import com.linguabridge.backend.dto.LoginRequest;
import com.linguabridge.backend.dto.SignupRequest;
import com.linguabridge.backend.model.Level;
import com.linguabridge.backend.model.Role;
import com.linguabridge.backend.model.User;
import com.linguabridge.backend.repository.UserRepository;
import com.linguabridge.backend.util.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest request) {
        logger.debug("Checking if email {} already exists", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.error("Email {} is already in use", request.getEmail());
            throw new RuntimeException("Email already in use");
        }

        Level userLevel = request.getLevel() != null ? request.getLevel() : Level.BEGINNER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .level(userLevel)
                .roles(Collections.singleton(Role.USER)) // ⬅ rôle par défaut USER
                .build();

        userRepository.save(user);
        logger.info("User saved successfully with id: {}", user.getId());

        ResponseCookie cookie = jwtService.generateTokenCookie(
                user.getEmail(),
                user.getName(),
                "USER"
        );

        AuthResponse.UserResponse userResponse = AuthResponse.UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .level(user.getLevel())
                .roles(user.getRoles())
                .build();

        return AuthResponse.builder()
                .success(true)
                .message("Registration successful")
                .cookie(cookie)
                .user(userResponse)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        logger.error("User not found with email: {}", request.getEmail());
                        return new RuntimeException("Invalid credentials");
                    });

            ResponseCookie cookie = jwtService.generateTokenCookie(
                    user.getEmail(),
                    user.getName(),
                    user.getRoles().iterator().next().name()
            );

            AuthResponse.UserResponse userResponse = AuthResponse.UserResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .level(user.getLevel())
                    .roles(user.getRoles())
                    .score(user.getScore())
                    .build();

            return AuthResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .cookie(cookie)
                    .user(userResponse)
                    .build();

        } catch (Exception e) {
            logger.error("Login failed for {}: {}", request.getEmail(), e.getMessage());
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid email or password")
                    .build();
        }
    }

    public ResponseEntity<?> logout() {
        ResponseCookie expiredCookie = ResponseCookie.from("auth_token", "")
                .path("/")
                .httpOnly(true)
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expiredCookie.toString())
                .body("Logged out successfully");
    }
}
