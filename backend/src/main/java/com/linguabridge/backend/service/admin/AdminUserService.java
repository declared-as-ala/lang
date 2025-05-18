package com.linguabridge.backend.service.admin;

import com.linguabridge.backend.dto.AdminUserDTO;
import com.linguabridge.backend.dto.AdminUserUpdateDTO;
import com.linguabridge.backend.model.Level;
import com.linguabridge.backend.model.Role;
import com.linguabridge.backend.model.User;
import com.linguabridge.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminUserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<AdminUserDTO> searchUsers(String keyword) {
        return userRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public AdminUserDTO createUser(AdminUserUpdateDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setScore(dto.getScore() != null ? dto.getScore() : 0);
        user.setLevel(Level.valueOf(dto.getLevel().toUpperCase()));
        user.setRoles(Set.of(Role.valueOf(dto.getRole().toUpperCase())));

        return mapToDTO(userRepository.save(user));
    }

    public AdminUserDTO updateUser(String id, AdminUserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPassword() != null) user.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (dto.getScore() != null) user.setScore(dto.getScore());
        if (dto.getLevel() != null) user.setLevel(Level.valueOf(dto.getLevel().toUpperCase()));
        if (dto.getRole() != null) user.setRoles(Set.of(Role.valueOf(dto.getRole().toUpperCase())));

        return mapToDTO(userRepository.save(user));
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    private AdminUserDTO mapToDTO(User user) {
        return new AdminUserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getScore(),
                user.getLevel().name()
        );
    }
}
