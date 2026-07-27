package com.bookmanager.application.usecase.book;

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
public class DeleteBookUseCase {

    private final BookRepositoryPort bookRepositoryPort;

    public void execute(UUID id) {
        Book book = bookRepositoryPort.findActiveById(id)
                .orElseThrow(BookNotFoundException::new);

        book.softDelete();

        bookRepositoryPort.save(book);

        log.info("Book deleted: id={}", id);
    }
}