package com.linguabridge.backend.controller.admin;

import com.linguabridge.backend.dto.AdminUserDTO;
import com.linguabridge.backend.dto.AdminUserUpdateDTO;
import com.linguabridge.backend.service.admin.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<AdminUserDTO> getAllUsers() {
        return adminUserService.getAllUsers();
    }

    @GetMapping("/search")
    public List<AdminUserDTO> searchUsers(@RequestParam("q") String keyword) {
        return adminUserService.searchUsers(keyword);
    }

    @PostMapping
    public AdminUserDTO create(@RequestBody AdminUserUpdateDTO dto) {
        return adminUserService.createUser(dto);
    }

    @PutMapping("/{id}")
    public AdminUserDTO update(@PathVariable String id, @RequestBody AdminUserUpdateDTO dto) {
        return adminUserService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        adminUserService.deleteUser(id);
    }
}
