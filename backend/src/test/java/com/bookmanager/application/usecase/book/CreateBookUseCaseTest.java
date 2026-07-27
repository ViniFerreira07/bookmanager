package com.bookmanager.application.usecase.book;

import com.bookmanager.application.dto.BookRequest;
import com.bookmanager.application.dto.BookResponse;
import com.bookmanager.application.mapper.BookMapper;
import com.bookmanager.domain.entity.Book;
import com.bookmanager.domain.repository.BookRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateBookUseCaseTest {

    @Mock
    private BookRepositoryPort bookRepositoryPort;
    @Mock
    private BookMapper bookMapper;

    private CreateBookUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new CreateBookUseCase(bookRepositoryPort, bookMapper);
    }

    @Test
    void execute_WithValidData_ShouldCreateBook() {
        BookRequest request = new BookRequest("Clean Code", "Robert C. Martin", 2008, "A handbook", null);
        Book book = Book.create("Clean Code", "Robert C. Martin", 2008, "A handbook", null);
        BookResponse response = new BookResponse(UUID.randomUUID(), "Clean Code", "Robert C. Martin", 2008, "A handbook", null, LocalDateTime.now(), null);

        when(bookRepositoryPort.save(any(Book.class))).thenReturn(book);
        when(bookMapper.toResponse(any(Book.class))).thenReturn(response);

        BookResponse result = useCase.execute(request);

        assertNotNull(result);
        assertEquals("Clean Code", result.title());
        verify(bookRepositoryPort).save(any(Book.class));
    }
}