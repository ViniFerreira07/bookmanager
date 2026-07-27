package com.bookmanager.infrastructure.controller;

import com.bookmanager.application.dto.BookRequest;
import com.bookmanager.application.dto.BookResponse;
import com.bookmanager.application.usecase.book.CreateBookUseCase;
import com.bookmanager.application.usecase.book.DeleteBookUseCase;
import com.bookmanager.application.usecase.book.GetBookByIdUseCase;
import com.bookmanager.application.usecase.book.ListBooksUseCase;
import com.bookmanager.application.usecase.book.UpdateBookUseCase;
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
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Collaborative catalog management")
public class BookController {

    private final CreateBookUseCase createBookUseCase;
    private final UpdateBookUseCase updateBookUseCase;
    private final DeleteBookUseCase deleteBookUseCase;
    private final GetBookByIdUseCase getBookByIdUseCase;
    private final ListBooksUseCase listBooksUseCase;

    @GetMapping("/search")
    @Operation(summary = "Search books")
    public Page<BookResponse> search(@RequestParam(required = false) String title,
                                     @RequestParam(required = false) String author,
                                     @RequestParam(required = false) Integer year,
                                     Pageable pageable) {
        return listBooksUseCase.execute(title, author, year, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book by id")
    public BookResponse findById(@PathVariable UUID id) {
        return getBookByIdUseCase.execute(id);
    }

    @PostMapping
    @Operation(summary = "Create a new book")
    public ResponseEntity<BookResponse> create(@Valid @RequestBody BookRequest request) {
        BookResponse response = createBookUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update book")
    public BookResponse update(@PathVariable UUID id, @Valid @RequestBody BookRequest request) {
        return updateBookUseCase.execute(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete book")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        deleteBookUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}