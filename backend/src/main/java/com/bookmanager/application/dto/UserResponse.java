package com.bookmanager.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String email,
        String role,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
