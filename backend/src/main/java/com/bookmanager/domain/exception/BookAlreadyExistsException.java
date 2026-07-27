package com.bookmanager.domain.exception;

public class BookAlreadyExistsException extends ResourceConflictException {
    public BookAlreadyExistsException(String title, String author) {
        super("book already exists: " + title + " by " + author);
    }
}