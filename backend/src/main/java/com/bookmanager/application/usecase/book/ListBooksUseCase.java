package com.bookmanager.application.usecase.book;

import com.bookmanager.application.dto.BookResponse;
import com.bookmanager.application.mapper.BookMapper;
import com.bookmanager.domain.repository.BookRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListBooksUseCase {

    private final BookRepositoryPort bookRepositoryPort;
    private final BookMapper bookMapper;

    public Page<BookResponse> execute(String title, String author, Integer year, Pageable pageable) {
        return bookRepositoryPort.search(title, author, year, pageable)
                .map(bookMapper::toResponse);
    }
}