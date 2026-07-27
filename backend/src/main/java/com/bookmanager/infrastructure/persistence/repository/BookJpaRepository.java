package com.bookmanager.infrastructure.persistence.repository;

import com.bookmanager.infrastructure.persistence.entity.BookJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface BookJpaRepository extends JpaRepository<BookJpaEntity, UUID> {

    @Query(value = "SELECT * FROM books b WHERE b.deleted = false " +
            "AND (:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) " +
            "AND (:year IS NULL OR b.year = :year)",
            countQuery = "SELECT COUNT(*) FROM books b WHERE b.deleted = false " +
            "AND (:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) " +
            "AND (:year IS NULL OR b.year = :year)",
            nativeQuery = true)
    Page<BookJpaEntity> search(@Param("title") String title,
                                @Param("author") String author,
                                @Param("year") Integer year,
                                Pageable pageable);

    @Query(value = "SELECT * FROM books b WHERE b.id = :id AND b.deleted = false", nativeQuery = true)
    Optional<BookJpaEntity> findActiveById(@Param("id") UUID id);

    boolean existsByTitleAndAuthorAndDeletedFalse(String title, String author);
}
