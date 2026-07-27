package com.bookmanager.application.usecase.auth;

import com.bookmanager.application.dto.AuthResponse;
import com.bookmanager.application.dto.LoginRequest;
import com.bookmanager.domain.entity.User;
import com.bookmanager.domain.repository.UserRepositoryPort;
import com.bookmanager.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoginUserUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse execute(LoginRequest request) {
        User user = userRepositoryPort.findActiveByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("invalid credentials");
        }

        log.info("User logged in: id={}, email={}", user.getId(), user.getEmail());

        String accessToken = jwtService.generateToken(user.getEmail(), user.getRole(), user.getId());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(), user.getRole(), user.getId());
        return new AuthResponse(accessToken, jwtService.getExpirationMs(), refreshToken);
    }
}