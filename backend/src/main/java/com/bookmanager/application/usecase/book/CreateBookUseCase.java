package com.bookmanager.application.usecase.book;

import com.bookmanager.application.dto.BookRequest;
import com.bookmanager.application.dto.BookResponse;
import com.bookmanager.application.mapper.BookMapper;
import com.bookmanager.domain.entity.Book;
import com.bookmanager.domain.exception.BookAlreadyExistsException;
import com.bookmanager.domain.repository.BookRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CreateBookUseCase {

    private final BookRepositoryPort bookRepositoryPort;
    private final BookMapper bookMapper;

    public BookResponse execute(BookRequest request) {
        if (bookRepositoryPort.existsByTitleAndAuthor(request.title(), request.author())) {
            throw new BookAlreadyExistsException(request.title(), request.author());
        }

        Book book = Book.create(
                request.title(),
                request.author(),
                request.year(),
                request.description(),
                request.coverUrl()
        );

        Book saved = bookRepositoryPort.save(book);
        log.info("Book created: id={}, title={}", saved.getId(), saved.getTitle());
        return bookMapper.toResponse(saved);
    }
}