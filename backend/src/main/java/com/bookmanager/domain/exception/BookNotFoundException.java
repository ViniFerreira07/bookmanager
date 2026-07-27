package com.bookmanager.domain.exception;

public class BookNotFoundException extends ResourceNotFoundException {
    public BookNotFoundException() {
        super("book not found");
    }

    public BookNotFoundException(String message) {
        super(message);
    }
}