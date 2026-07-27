package com.bookmanager.infrastructure.controller;

import com.bookmanager.application.dto.CreateUserRequest;
import com.bookmanager.application.dto.UpdateUserRequest;
import com.bookmanager.application.dto.UpdateUserStatusRequest;
import com.bookmanager.application.dto.UserResponse;
import com.bookmanager.application.usecase.user.CreateUserUseCase;
import com.bookmanager.application.usecase.user.DeleteUserUseCase;
import com.bookmanager.application.usecase.user.ListUsersUseCase;
import com.bookmanager.application.usecase.user.UpdateUserStatusUseCase;
import com.bookmanager.application.usecase.user.UpdateUserUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Admin user management")
public class UserController {

    private final ListUsersUseCase listUsersUseCase;
    private final CreateUserUseCase createUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    private final UpdateUserStatusUseCase updateUserStatusUseCase;

    @GetMapping
    @Operation(summary = "List users", description = "Returns paginated users, including inactive")
    public Page<UserResponse> list(Pageable pageable) {
        return listUsersUseCase.execute(pageable);
    }

    @PostMapping
    @Operation(summary = "Create user")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(createUserUseCase.execute(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user")
    public UserResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateUserRequest request) {
        return updateUserUseCase.execute(id, request);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Activate or deactivate user")
    public UserResponse updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateUserStatusRequest request) {
        return updateUserStatusUseCase.execute(id, request.active());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete user")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        deleteUserUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
