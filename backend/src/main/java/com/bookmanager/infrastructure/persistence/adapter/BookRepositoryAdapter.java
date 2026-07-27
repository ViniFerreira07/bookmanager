package com.bookmanager.infrastructure.persistence.adapter;

import com.bookmanager.domain.entity.Book;
import com.bookmanager.domain.repository.BookRepositoryPort;
import com.bookmanager.infrastructure.persistence.entity.BookJpaEntity;
import com.bookmanager.infrastructure.persistence.repository.BookJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class BookRepositoryAdapter implements BookRepositoryPort {

    private final BookJpaRepository repository;

    @Override
    @SuppressWarnings("null")
    public Book save(Book book) {
        BookJpaEntity saved = repository.save(toEntity(book));
        return toDomain(Objects.requireNonNull(saved));
    }

    @Override
    @SuppressWarnings("null")
    public Optional<Book> findById(UUID id) {
        return repository.findById(Objects.requireNonNull(id)).map(this::toDomain);
    }

    @Override
    @SuppressWarnings("null")
    public Optional<Book> findActiveById(UUID id) {
        return repository.findActiveById(Objects.requireNonNull(id)).map(this::toDomain);
    }

    @Override
    public Page<Book> search(String title, String author, Integer year, Pageable pageable) {
        return repository.search(title, author, year, pageable).map(this::toDomain);
    }

    @Override
    @SuppressWarnings("null")
    public void delete(Book book) {
        repository.save(toEntity(book));
    }

    @Override
    public boolean existsByTitleAndAuthor(String title, String author) {
        return repository.existsByTitleAndAuthorAndDeletedFalse(title, author);
    }

    private BookJpaEntity toEntity(Book book) {
        return BookJpaEntity.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .year(book.getYear())
                .description(book.getDescription())
                .coverUrl(book.getCoverUrl())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .deleted(book.isDeleted())
                .deletedAt(book.getDeletedAt())
                .build();
    }

    private Book toDomain(BookJpaEntity entity) {
        return new Book(entity.getId(), entity.getTitle(), entity.getAuthor(), entity.getYear(),
                entity.getDescription(), entity.getCoverUrl(),
                entity.getCreatedAt(), entity.getUpdatedAt(), entity.isDeleted());
    }
}
