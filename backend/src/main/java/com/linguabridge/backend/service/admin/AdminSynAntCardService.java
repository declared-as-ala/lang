package com.linguabridge.backend.service.admin;

import com.linguabridge.backend.model.SynAntCard;
import com.linguabridge.backend.repository.SynAntCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminSynAntCardService {

    private final SynAntCardRepository repo;

    public List<SynAntCard> findAll()                 { return repo.findAll(); }
    public SynAntCard  save(SynAntCard c)             { return repo.save(c); }
    public void        delete(String id)              { repo.deleteById(id); }
}
