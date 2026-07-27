package com.bookmanager.application.usecase.user;

import com.bookmanager.application.dto.CreateUserRequest;
import com.bookmanager.application.dto.UserResponse;
import com.bookmanager.domain.entity.User;
import com.bookmanager.domain.exception.ResourceConflictException;
import com.bookmanager.domain.repository.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CreateUserUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoder passwordEncoder;

    public UserResponse execute(CreateUserRequest request) {
        String email = request.email().trim().toLowerCase();
        String username = request.username().trim().toLowerCase();

        if (userRepositoryPort.findByEmail(email).isPresent()) {
            throw new ResourceConflictException("email already registered");
        }
        if (userRepositoryPort.findByUsername(username).isPresent()) {
            throw new ResourceConflictException("username already registered");
        }

        User user = User.create(username, email, passwordEncoder.encode(request.password()));
        user.setRole(request.role().trim().toUpperCase());

        return UserMapper.toResponse(userRepositoryPort.save(user));
    }
}
