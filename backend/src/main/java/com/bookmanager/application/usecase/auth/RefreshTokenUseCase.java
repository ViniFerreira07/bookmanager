package com.bookmanager.application.usecase.auth;

import com.bookmanager.application.dto.AuthResponse;
import com.bookmanager.application.dto.RefreshTokenRequest;
import com.bookmanager.infrastructure.security.JwtService;
import com.bookmanager.infrastructure.security.TokenBlacklistService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class RefreshTokenUseCase {

    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthResponse execute(RefreshTokenRequest request) {
        if (tokenBlacklistService.isBlacklisted(request.refreshToken())) {
            throw new SecurityException("token has been revoked");
        }

        Claims claims = jwtService.parseClaims(request.refreshToken());
        String email = claims.getSubject();
        String role = claims.get("role", String.class);
        UUID userId = UUID.fromString(claims.get("userId", String.class));

        String newAccessToken = jwtService.generateToken(email, role, userId);
        String newRefreshToken = jwtService.generateRefreshToken(email, role, userId);

        tokenBlacklistService.blacklist(request.refreshToken());
        log.info("Token refreshed for user: email={}", email);

        return new AuthResponse(newAccessToken, jwtService.getExpirationMs(), newRefreshToken);
    }
}