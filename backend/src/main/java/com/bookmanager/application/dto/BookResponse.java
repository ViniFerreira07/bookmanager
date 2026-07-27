package com.bookmanager.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record BookResponse(
        UUID id,
        String title,
        String author,
        Integer year,
        String description,
        String coverUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
