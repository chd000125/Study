package com.example.chat_websocket.repository;

import com.example.chat_websocket.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByStudyGroupIdOrderByCreatedAt(Long groupId);
}
