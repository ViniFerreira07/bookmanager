package com.bookmanager.domain.entity;

import com.bookmanager.domain.exception.BusinessRuleException;

import java.time.LocalDateTime;
import java.util.UUID;

public class User {
    private UUID id;
    private String username;
    private String email;
    private String password;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean deleted;
    private LocalDateTime deletedAt;

    public User() {}

    public User(UUID id, String username, String email, String password, String role,
                LocalDateTime createdAt, LocalDateTime updatedAt, boolean deleted) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deleted = deleted;
    }

    public static User create(String username, String email, String encodedPassword) {
        validateUsername(username);
        validateEmail(email);
        if (encodedPassword == null || encodedPassword.isBlank()) {
            throw new BusinessRuleException("password is required");
        }

        User user = new User();
        user.id = UUID.randomUUID();
        user.username = username.trim().toLowerCase();
        user.email = email.trim().toLowerCase();
        user.password = encodedPassword;
        user.role = "USER";
        user.createdAt = LocalDateTime.now();
        user.deleted = false;
        return user;
    }

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(role);
    }

    public void updateProfile(String username, String email, String role) {
        validateUsername(username);
        validateEmail(email);
        validateRole(role);

        this.username = username.trim().toLowerCase();
        this.email = email.trim().toLowerCase();
        this.role = role.trim().toUpperCase();
        this.updatedAt = LocalDateTime.now();
    }

    public void changePassword(String encodedPassword) {
        if (encodedPassword == null || encodedPassword.isBlank()) {
            throw new BusinessRuleException("password is required");
        }
        this.password = encodedPassword;
        this.updatedAt = LocalDateTime.now();
    }

    public void reactivate() {
        if (!this.deleted) {
            return;
        }
        this.deleted = false;
        this.deletedAt = null;
        this.updatedAt = LocalDateTime.now();
    }

    public void softDelete() {
        if (this.deleted) {
            throw new BusinessRuleException("user is already deleted");
        }
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    private static void validateUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new BusinessRuleException("username is required");
        }
        if (username.trim().length() < 3 || username.trim().length() > 50) {
            throw new BusinessRuleException("username must have between 3 and 50 characters");
        }
    }

    private static void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BusinessRuleException("email is required");
        }
        String normalized = email.trim();
        if (!normalized.contains("@") || normalized.startsWith("@") || normalized.endsWith("@")) {
            throw new BusinessRuleException("email must be valid");
        }
    }

    private static void validateRole(String role) {
        if (role == null || role.isBlank()) {
            throw new BusinessRuleException("role is required");
        }
        String normalized = role.trim().toUpperCase();
        if (!"ADMIN".equals(normalized) && !"USER".equals(normalized)) {
            throw new BusinessRuleException("role must be ADMIN or USER");
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}