package com.bookmanager.application.usecase.user;

import com.bookmanager.application.dto.UpdateUserRequest;
import com.bookmanager.application.dto.UserResponse;
import com.bookmanager.domain.entity.User;
import com.bookmanager.domain.exception.ResourceConflictException;
import com.bookmanager.domain.exception.ResourceNotFoundException;
import com.bookmanager.domain.repository.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UpdateUserUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoder passwordEncoder;

    public UserResponse execute(UUID id, UpdateUserRequest request) {
        User user = userRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("user not found"));

        String email = request.email().trim().toLowerCase();
        String username = request.username().trim().toLowerCase();

        if (userRepositoryPort.existsByEmailAndIdNot(email, id)) {
            throw new ResourceConflictException("email already registered");
        }
        if (userRepositoryPort.existsByUsernameAndIdNot(username, id)) {
            throw new ResourceConflictException("username already registered");
        }

        user.updateProfile(username, email, request.role());

        if (request.password() != null && !request.password().isBlank()) {
            user.changePassword(passwordEncoder.encode(request.password()));
        }

        return UserMapper.toResponse(userRepositoryPort.save(user));
    }
}
