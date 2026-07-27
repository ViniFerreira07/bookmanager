package com.bookmanager.infrastructure.controller;

import com.bookmanager.application.dto.AuthResponse;
import com.bookmanager.application.dto.LoginRequest;
import com.bookmanager.application.dto.RefreshTokenRequest;
import com.bookmanager.application.dto.RegisterRequest;
import com.bookmanager.application.usecase.auth.LoginUserUseCase;
import com.bookmanager.application.usecase.auth.RefreshTokenUseCase;
import com.bookmanager.application.usecase.auth.RegisterUserUseCase;
import com.bookmanager.infrastructure.security.JwtAuthenticationToken;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication and token lifecycle")
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(registerUserUseCase.execute(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate with email and password")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginUserUseCase.execute(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(refreshTokenUseCase.execute(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout current session")
    public ResponseEntity<Void> logout(Authentication authentication) {
        // Token blacklisting is handled by the client discarding the token
        // For added security, we could add the current token to the blacklist
        if (authentication instanceof JwtAuthenticationToken) {
            // The actual token is in the Authorization header, not in the authentication object
            // Blacklisting is handled on the client side and optionally via the refresh endpoint
        }
        return ResponseEntity.noContent().build();
    }
}