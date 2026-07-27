package com.bookmanager.application.usecase.user;

import com.bookmanager.domain.entity.User;
import com.bookmanager.domain.exception.ResourceNotFoundException;
import com.bookmanager.domain.repository.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DeleteUserUseCase {

    private final UserRepositoryPort userRepositoryPort;

    public void execute(UUID id) {
        User user = userRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("user not found"));

        user.softDelete();
        userRepositoryPort.save(user);
    }
}
