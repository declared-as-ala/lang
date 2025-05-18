package com.linguabridge.backend.controller;

import com.linguabridge.backend.dto.AuthResponse;
import com.linguabridge.backend.dto.LoginRequest;
import com.linguabridge.backend.dto.SignupRequest;
import com.linguabridge.backend.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        logger.info("Received signup request for email: {}", request.getEmail());
        try {
            logger.debug("Validating signup request data");
            if (request.getEmail() == null || request.getEmail().isEmpty()) {
                logger.error("Email is required");
                return ResponseEntity.badRequest().body(null);
            }
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                logger.error("Password is required");
                return ResponseEntity.badRequest().body(null);
            }
            if (request.getName() == null || request.getName().isEmpty()) {
                logger.error("Name is required");
                return ResponseEntity.badRequest().body(null);
            }

            logger.debug("Calling authService.signup");
            AuthResponse response = authService.signup(request);
            logger.info("Signup successful for email: {}", request.getEmail());

            ResponseCookie cookie = response.getCookie();
            HttpHeaders headers = new HttpHeaders();
            if (cookie != null) {
                headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
            }

            return ResponseEntity.ok().headers(headers).body(response);
        } catch (AccessDeniedException e) {
            logger.error("Access denied during signup: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (Exception e) {
            logger.error("Signup failed for email: {} - Error: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        logger.info("Received login request for email: {}", request.getEmail());
        try {
            logger.debug("Validating login request data");
            if (request.getEmail() == null || request.getEmail().isEmpty()) {
                logger.error("Email is required");
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                logger.error("Password is required");
                return ResponseEntity.badRequest().body("Password is required");
            }

            logger.debug("Calling authService.login");
            AuthResponse response = authService.login(request);

            if (!response.isSuccess()) {
                logger.error("Login failed for email: {} - Invalid credentials", request.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            ResponseCookie cookie = response.getCookie();
            HttpHeaders headers = new HttpHeaders();
            if (cookie != null) {
                headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
            }

            logger.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok().headers(headers).body(response);
        } catch (AccessDeniedException e) {
            logger.error("Access denied during login: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (Exception e) {
            logger.error("Login failed for email: {} - Error: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PostMapping("/logout")
public ResponseEntity<?> logout(HttpServletResponse response) {
    // Optional: clear the cookie manually
    ResponseCookie cookie = ResponseCookie.from("auth_token", "")
        .path("/")
        .httpOnly(true)
        .maxAge(0)
        .sameSite("Lax")
        .build();
    
    response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    
    return ResponseEntity.ok("Logged out");
}

    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth() {
        logger.info("Testing authentication endpoint");
        return ResponseEntity.ok("Authentication endpoint is accessible");
    }
}
