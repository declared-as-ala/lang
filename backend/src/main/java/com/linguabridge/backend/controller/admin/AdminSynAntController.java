package com.linguabridge.backend.controller.admin;

import com.linguabridge.backend.model.SynAntCard;
import com.linguabridge.backend.service.SynAntCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/synant")
@RequiredArgsConstructor
public class AdminSynAntController {

    private final SynAntCardService service;

    @GetMapping
    public List<SynAntCard> getAll() {
        return service.getAll();
    }

    @PostMapping
    public SynAntCard create(@RequestBody SynAntCard card) {
        return service.save(card);
    }

    @PutMapping("/{id}")
    public SynAntCard update(@PathVariable String id, @RequestBody SynAntCard card) {
        return service.update(id, card);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
