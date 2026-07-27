package com.bookmanager.infrastructure.persistence.adapter;

import com.bookmanager.domain.entity.User;
import com.bookmanager.domain.repository.UserRepositoryPort;
import com.bookmanager.infrastructure.persistence.entity.UserJpaEntity;
import com.bookmanager.infrastructure.persistence.repository.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final UserJpaRepository repository;

    @Override
    @SuppressWarnings("null")
    public User save(User user) {
        UserJpaEntity entity = toEntity(user);
        UserJpaEntity saved = repository.save(entity);
        return toDomain(Objects.requireNonNull(saved));
    }

    @Override
    @SuppressWarnings("null")
    public Optional<User> findById(UUID id) {
        return repository.findById(Objects.requireNonNull(id)).map(this::toDomain);
    }

    @Override
    public Page<User> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public Optional<User> findActiveByEmail(String email) {
        return repository.findByEmailAndDeletedFalse(email).map(this::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return repository.findByUsername(username).map(this::toDomain);
    }

    @Override
    public boolean existsByEmailAndIdNot(String email, UUID id) {
        return repository.existsByEmailIgnoreCaseAndIdNot(email, id);
    }

    @Override
    public boolean existsByUsernameAndIdNot(String username, UUID id) {
        return repository.existsByUsernameIgnoreCaseAndIdNot(username, id);
    }

    private UserJpaEntity toEntity(User user) {
        return UserJpaEntity.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .deleted(user.isDeleted())
                .deletedAt(user.getDeletedAt())
                .build();
    }

    private User toDomain(UserJpaEntity entity) {
        User user = new User(entity.getId(), entity.getUsername(), entity.getEmail(), entity.getPassword(), entity.getRole(), entity.getCreatedAt(), entity.getUpdatedAt(), entity.isDeleted());
        user.setDeletedAt(entity.getDeletedAt());
        return user;
    }
}
