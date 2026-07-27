package com.bookmanager.infrastructure.persistence.repository;

import com.bookmanager.infrastructure.persistence.entity.UserJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserJpaRepository extends JpaRepository<UserJpaEntity, UUID> {
    Optional<UserJpaEntity> findByEmail(String email);
    Optional<UserJpaEntity> findByEmailAndDeletedFalse(String email);
    Optional<UserJpaEntity> findByUsername(String username);
    Page<UserJpaEntity> findAllByDeletedFalse(Pageable pageable);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, UUID id);
    boolean existsByUsernameIgnoreCaseAndIdNot(String username, UUID id);
}
