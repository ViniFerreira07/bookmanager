package com.bookmanager.application.usecase.user;

import com.bookmanager.application.dto.UserResponse;
import com.bookmanager.domain.entity.User;
import com.bookmanager.domain.exception.ResourceNotFoundException;
import com.bookmanager.domain.repository.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UpdateUserStatusUseCase {

    private final UserRepositoryPort userRepositoryPort;

    public UserResponse execute(UUID id, boolean active) {
        User user = userRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("user not found"));

        if (active) {
            user.reactivate();
        } else {
            if (!user.isDeleted()) {
                user.softDelete();
            }
        }

        return UserMapper.toResponse(userRepositoryPort.save(user));
    }
}
