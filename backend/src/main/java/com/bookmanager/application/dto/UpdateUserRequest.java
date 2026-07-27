package com.bookmanager.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @NotBlank(message = "username is required")
        @Size(min = 3, max = 50, message = "username must have between 3 and 50 characters")
        String username,

        @NotBlank(message = "email is required")
        @Email(message = "email must be valid")
        String email,

        @Size(min = 6, message = "password must have at least 6 characters")
        String password,

        @NotBlank(message = "role is required")
        @Pattern(regexp = "^(ADMIN|USER)$", message = "role must be ADMIN or USER")
        String role
) {}
