package com.bookmanager.domain.entity;

import com.bookmanager.domain.exception.InvalidBookException;

import java.time.LocalDateTime;
import java.util.UUID;

public class Book {
    private UUID id;
    private String title;
    private String author;
    private Integer year;
    private String description;
    private String coverUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean deleted;
    private LocalDateTime deletedAt;

    public Book() {}

    public Book(UUID id, String title, String author, Integer year, String description, String coverUrl,
                LocalDateTime createdAt, LocalDateTime updatedAt, boolean deleted) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.description = description;
        this.coverUrl = coverUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deleted = deleted;
    }

    public static Book create(String title, String author, Integer year, String description, String coverUrl) {
        validateTitle(title);
        validateAuthor(author);
        if (year != null && year < 0) {
            throw new InvalidBookException("year must be positive");
        }

        Book book = new Book();
        book.id = UUID.randomUUID();
        book.title = title.trim();
        book.author = author.trim();
        book.year = year;
        book.description = description != null ? description.trim() : null;
        book.coverUrl = coverUrl;
        book.createdAt = LocalDateTime.now();
        book.deleted = false;
        return book;
    }

    public void updateInformation(String title, String author, Integer year, String description, String coverUrl) {
        validateTitle(title);
        validateAuthor(author);
        if (year != null && year < 0) {
            throw new InvalidBookException("year must be positive");
        }

        this.title = title.trim();
        this.author = author.trim();
        this.year = year;
        this.description = description != null ? description.trim() : null;
        this.coverUrl = coverUrl;
        this.updatedAt = LocalDateTime.now();
    }

    public void softDelete() {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public boolean canBeDeleted() {
        return !deleted;
    }

    public void validate() {
        validateTitle(title);
        validateAuthor(author);
    }

    private static void validateTitle(String title) {
        if (title == null || title.isBlank()) {
            throw new InvalidBookException("title is required");
        }
        if (title.trim().length() > 150) {
            throw new InvalidBookException("title must be at most 150 characters");
        }
    }

    private static void validateAuthor(String author) {
        if (author == null || author.isBlank()) {
            throw new InvalidBookException("author is required");
        }
        if (author.trim().length() > 150) {
            throw new InvalidBookException("author must be at most 150 characters");
        }
    }

    public void forceSoftDelete() {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}