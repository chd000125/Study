package com.example.chat_websocket.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private Long groupId;
    private Long userId;
    private String userName;
    private String content;
}
