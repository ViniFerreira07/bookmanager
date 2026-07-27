package com.bookmanager.application.usecase.book;

import com.bookmanager.application.dto.BookRequest;
import com.bookmanager.application.dto.BookResponse;
import com.bookmanager.application.mapper.BookMapper;
import com.bookmanager.domain.entity.Book;
import com.bookmanager.domain.exception.BookNotFoundException;
import com.bookmanager.domain.repository.BookRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class UpdateBookUseCase {

    private final BookRepositoryPort bookRepositoryPort;
    private final BookMapper bookMapper;

        public BookResponse execute(UUID id, BookRequest request) {
        Book book = bookRepositoryPort.findActiveById(id)
                .orElseThrow(BookNotFoundException::new);

        book.updateInformation(
                request.title(),
                request.author(),
                request.year(),
                request.description(),
                request.coverUrl()
        );

        Book saved = bookRepositoryPort.save(book);
                log.info("Book updated: id={}, title={}", saved.getId(), saved.getTitle());
        return bookMapper.toResponse(saved);
    }
}