package com.bookmanager.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record BookRequest(
        @NotBlank(message = "title is required")
        @Size(max = 150, message = "title must be at most 150 characters")
        String title,

        @NotBlank(message = "author is required")
        @Size(max = 150, message = "author must be at most 150 characters")
        String author,

        @NotNull(message = "year is required")
        Integer year,

        @Size(max = 1000, message = "description must be at most 1000 characters")
        String description,

        String coverUrl
) {}
