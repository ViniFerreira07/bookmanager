package com.bookmanager.domain.exception;

public class InvalidAuthorException extends BusinessRuleException {
    public InvalidAuthorException(String message) {
        super(message);
    }
}