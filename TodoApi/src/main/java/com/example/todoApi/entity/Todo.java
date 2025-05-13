package com.example.todoApi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String author; // 작성자

    @Column(nullable = false)
    private String title; // 할 일 제목

    @Column(nullable = false)
    private boolean completed; // 완료 여부

    @Column(nullable = false)
    private LocalDateTime createdDate; // 작성일

    @Transient
    private double progress; // 작성률 (DB에 저장 안 함, 계산용)

    // 작성률은 외부 로직에서 계산해서 setProgress 하도록 설계

    public Todo(String author, String title, boolean completed) {
        this.author = author;
        this.title = title;
        this.completed = completed;
        this.createdDate = LocalDateTime.now(); // 생성 시점 자동 입력
    }
}
