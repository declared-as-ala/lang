package com.linguabridge.backend.controller.admin;

import com.linguabridge.backend.model.FillBlankQuestion;
import com.linguabridge.backend.service.admin.AdminFillBlankService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fillblank")
@RequiredArgsConstructor
public class AdminFillBlankController {

    private final AdminFillBlankService service;

    @GetMapping
    public List<FillBlankQuestion> getAll() {
        return service.findAll();
    }

    @PostMapping
    public FillBlankQuestion save(@RequestBody FillBlankQuestion q) {
        return service.save(q);
    }

    @PutMapping("/{id}")
    public FillBlankQuestion update(@PathVariable String id, @RequestBody FillBlankQuestion q) {
        q.setId(id);
        return service.save(q);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
