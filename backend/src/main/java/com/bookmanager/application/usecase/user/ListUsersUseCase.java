package com.bookmanager.application.usecase.user;

import com.bookmanager.application.dto.UserResponse;
import com.bookmanager.domain.repository.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListUsersUseCase {

    private final UserRepositoryPort userRepositoryPort;

    public Page<UserResponse> execute(Pageable pageable) {
        return userRepositoryPort.findAll(pageable).map(UserMapper::toResponse);
    }
}
