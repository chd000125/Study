package com.example.todoApi.service;

import com.example.todoApi.dto.TodoRequestDto;
import com.example.todoApi.dto.TodoResponseDto;
import com.example.todoApi.entity.Todo;
import com.example.todoApi.repository.TodoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private static final Logger logger = LoggerFactory.getLogger(TodoService.class);

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // 모든 TodoList.jsx 조회
    public List<TodoResponseDto> getAllTodoList() {
        return todoRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Todo 생성
    public TodoResponseDto createTodo(TodoRequestDto dto) {
        Todo todo = new Todo();
        todo.setAuthor(dto.getAuthor()); // 작성자 추가
        todo.setTitle(dto.getTitle());
        todo.setCompleted(dto.isCompleted());
        todo.setCreatedDate(java.time.LocalDateTime.now()); // 생성 날짜 세팅

        logger.debug("todolist 정보: {}", dto);

        Todo savedTodo = todoRepository.save(todo);

        return convertToDto(savedTodo);
    }

    // Todo 업데이트
    public TodoResponseDto updateTodo(Long id, TodoRequestDto dto) {
        return todoRepository.findById(id).map(todo -> {
            todo.setTitle(dto.getTitle());
            todo.setCompleted(dto.isCompleted());
            Todo updatedTodo = todoRepository.save(todo);
            return convertToDto(updatedTodo);
        }).orElseThrow(() -> new RuntimeException("해당 Todo가 없습니다."));
    }

    // Todo 삭제
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    // 엔티티 -> DTO 변환 메서드
    private TodoResponseDto convertToDto(Todo todo) {
        double progress = todo.isCompleted() ? 100.0 : 0.0; // 예시: 완료 여부로 작성률 설정
        return new TodoResponseDto(
                todo.getId(),
                todo.getAuthor(),
                todo.getTitle(),
                todo.isCompleted(),
                todo.getCreatedDate(),
                progress
        );
    }
}
