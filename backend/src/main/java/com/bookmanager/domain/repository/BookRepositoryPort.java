package com.bookmanager.domain.repository;

import com.bookmanager.domain.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface BookRepositoryPort {
    Book save(Book book);
    Optional<Book> findById(UUID id);
    Optional<Book> findActiveById(UUID id);
    Page<Book> search(String title, String author, Integer year, Pageable pageable);
    void delete(Book book);
    boolean existsByTitleAndAuthor(String title, String author);
}
