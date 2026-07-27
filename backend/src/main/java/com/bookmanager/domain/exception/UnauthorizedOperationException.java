package com.bookmanager.domain.exception;

public class UnauthorizedOperationException extends BusinessRuleException {
    public UnauthorizedOperationException(String message) {
        super(message);
    }

    public UnauthorizedOperationException() {
        super("you do not have permission to perform this action");
    }
}