package com.linguabridge.backend.service;

import com.linguabridge.backend.model.SynAntCard;
import com.linguabridge.backend.repository.SynAntCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SynAntCardService {

    private final SynAntCardRepository repository;

    public List<SynAntCard> getAll() {
        return repository.findAll();
    }

    public List<SynAntCard> getByLevel(String level, int num) {
        List<SynAntCard> list = repository.findByLevelIgnoreCase(level);
        Collections.shuffle(list);
        return list.stream().limit(num).toList();
    }

    public SynAntCard save(SynAntCard card) {
        return repository.save(card);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public SynAntCard update(String id, SynAntCard updated) {
        updated.setId(id);
        return repository.save(updated);
    }
}
