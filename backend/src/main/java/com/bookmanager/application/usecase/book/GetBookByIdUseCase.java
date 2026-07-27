package com.bookmanager.application.usecase.book;

import com.bookmanager.application.dto.BookResponse;
import com.bookmanager.application.mapper.BookMapper;
import com.bookmanager.domain.exception.BookNotFoundException;
import com.bookmanager.domain.repository.BookRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GetBookByIdUseCase {

    private final BookRepositoryPort bookRepositoryPort;
    private final BookMapper bookMapper;

    public BookResponse execute(UUID id) {
        return bookRepositoryPort.findActiveById(id)
                .map(bookMapper::toResponse)
                .orElseThrow(BookNotFoundException::new);
    }
}