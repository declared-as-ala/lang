package com.linguabridge.backend.service.admin;

import com.linguabridge.backend.dto.AdminFlashcardDTO;
import com.linguabridge.backend.model.Flashcard;
import com.linguabridge.backend.repository.FlashcardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminFlashcardService {

    private final FlashcardRepository flashcardRepository;

    public List<AdminFlashcardDTO> getAll() {
        return flashcardRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<AdminFlashcardDTO> getById(String id) {
        return flashcardRepository.findById(id).map(this::toDTO);
    }

    public List<AdminFlashcardDTO> searchByLevel(String level) {
        return flashcardRepository.findByLevelIgnoreCase(level)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AdminFlashcardDTO create(AdminFlashcardDTO dto) {
        Flashcard flashcard = toEntity(dto);
        return toDTO(flashcardRepository.save(flashcard));
    }

    public AdminFlashcardDTO update(String id, AdminFlashcardDTO dto) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Flashcard not found"));

        flashcard.setId(dto.getCardId());
        flashcard.setEnglish(dto.getEnglish());
        flashcard.setGerman(dto.getGerman());
        flashcard.setArticle(dto.getArticle());
        flashcard.setExampleSentence(dto.getExampleSentence());
        flashcard.setLevel(dto.getLevel());

        return toDTO(flashcardRepository.save(flashcard));
    }

    public void delete(String id) {
        flashcardRepository.deleteById(id);
    }

    private AdminFlashcardDTO toDTO(Flashcard f) {
        AdminFlashcardDTO dto = new AdminFlashcardDTO();
        dto.setCardId(f.getId());
        dto.setCardId(f.getId());
        dto.setEnglish(f.getEnglish());
        dto.setGerman(f.getGerman());
        dto.setArticle(f.getArticle());
        dto.setExampleSentence(f.getExampleSentence());
        dto.setLevel(f.getLevel());
        return dto;
    }

    private Flashcard toEntity(AdminFlashcardDTO dto) {
        Flashcard f = new Flashcard();
        f.setId(dto.getId());
        f.setId(dto.getCardId());
        f.setEnglish(dto.getEnglish());
        f.setGerman(dto.getGerman());
        f.setArticle(dto.getArticle());
        f.setExampleSentence(dto.getExampleSentence());
        f.setLevel(dto.getLevel());
        return f;
    }
}
