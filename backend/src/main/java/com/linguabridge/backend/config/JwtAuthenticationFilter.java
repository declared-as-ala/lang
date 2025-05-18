package com.linguabridge.backend.config;
import com.linguabridge.backend.util.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;
    private static final String TOKEN_COOKIE_NAME = "auth_token";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String token = extractTokenFromRequest(request);
            
            if (token != null) {
                String userEmail = jwtService.extractEmail(token);
                logger.debug("Extracted email from token: {}", userEmail);
                
                if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                    logger.debug("Loaded user details for: {}", userEmail);
                    
                    if (jwtService.validateToken(token)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        logger.debug("Authentication set for user: {}", userEmail);
                    } else {
                        logger.warn("Invalid token for user: {}", userEmail);
                    }
                }
            } else {
                logger.debug("No token found in request");
            }
        } catch (Exception e) {
            logger.error("Error processing JWT token: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        // Try to get token from cookie first
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if (TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    logger.debug("Found token in cookie");
                    return cookie.getValue();
                }
            }
        }

        // If no token in cookie, try Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            logger.debug("Found token in Authorization header");
            return authHeader.substring(7);
        }

        return null;
    }
} 