package com.bookmanager.application.usecase.user;

import com.bookmanager.application.dto.UserResponse;
import com.bookmanager.domain.entity.User;

public final class UserMapper {
    private UserMapper() {
    }

    public static UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                !user.isDeleted(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
