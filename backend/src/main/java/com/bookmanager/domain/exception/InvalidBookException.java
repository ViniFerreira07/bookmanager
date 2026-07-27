package com.bookmanager.domain.exception;

public class InvalidBookException extends BusinessRuleException {
    public InvalidBookException(String message) {
        super(message);
    }
}