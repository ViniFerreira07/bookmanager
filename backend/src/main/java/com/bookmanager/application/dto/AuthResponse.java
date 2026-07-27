package com.bookmanager.application.dto;

public record AuthResponse(String token, long expiresIn, String refreshToken) {}
