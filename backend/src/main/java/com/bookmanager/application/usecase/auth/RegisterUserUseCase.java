package com.bookmanager.application.usecase.auth;

import com.bookmanager.application.dto.AuthResponse;
import com.bookmanager.application.dto.RegisterRequest;
import com.bookmanager.domain.entity.User;
import com.bookmanager.domain.exception.ResourceConflictException;
import com.bookmanager.domain.repository.UserRepositoryPort;
import com.bookmanager.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RegisterUserUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse execute(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        String normalizedUsername = request.username().trim().toLowerCase();

        if (userRepositoryPort.findByEmail(normalizedEmail).isPresent()) {
            throw new ResourceConflictException("email already registered");
        }
        if (userRepositoryPort.findByUsername(normalizedUsername).isPresent()) {
            throw new ResourceConflictException("username already registered");
        }

        User user = User.create(
                normalizedUsername,
                normalizedEmail,
                passwordEncoder.encode(request.password())
        );

        userRepositoryPort.save(user);
        log.info("User registered: id={}, email={}", user.getId(), user.getEmail());

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateToken(user.getEmail(), user.getRole(), user.getId());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(), user.getRole(), user.getId());
        return new AuthResponse(accessToken, jwtService.getExpirationMs(), refreshToken);
    }
}