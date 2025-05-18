// 📁 com.linguabridge.backend.controller.ChatController.java
package com.linguabridge.backend.controller;

import com.linguabridge.backend.service.GroqChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final GroqChatService groqChatService;

    @PostMapping
    public ResponseEntity<Map<?, ?>> chat(@RequestBody Map<String, List<Map<String, String>>> body) {
        List<Map<String, String>> messages = body.get("messages");
        Map<?, ?> response = groqChatService.chat(messages);
        return ResponseEntity.ok(response);
    }
}
