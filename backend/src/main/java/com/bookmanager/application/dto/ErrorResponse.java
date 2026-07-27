package com.bookmanager.application.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ErrorResponse(
        String timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldError> errors
) {
    public static ErrorResponse of(int status, String error, String message, String path) {
        return new ErrorResponse(
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                status,
                error,
                message,
                path,
                null
        );
    }

    public static ErrorResponse withFieldErrors(int status, String error, String path, List<FieldError> errors) {
        return new ErrorResponse(
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                status,
                error,
                "validation failed",
                path,
                errors
        );
    }

    public record FieldError(String field, String message) {}
}