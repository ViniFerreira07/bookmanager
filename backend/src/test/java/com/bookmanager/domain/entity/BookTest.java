package com.bookmanager.domain.entity;

import com.bookmanager.domain.exception.InvalidBookException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BookTest {

    @Test
    void createBook_WithValidData_ShouldSucceed() {
        Book book = Book.create("Clean Code", "Robert C. Martin", 2008, "A handbook", null);

        assertNotNull(book.getId());
        assertEquals("Clean Code", book.getTitle());
        assertEquals("Robert C. Martin", book.getAuthor());
        assertEquals(2008, book.getYear());
        assertEquals("A handbook", book.getDescription());
        assertNull(book.getCoverUrl());
        assertNotNull(book.getCreatedAt());
        assertFalse(book.isDeleted());
    }

    @Test
    void createBook_WithNullYear_ShouldSucceed() {
        Book book = Book.create("Test", "Author", null, null, null);
        assertNull(book.getYear());
    }

    @Test
    void createBook_WithNegativeYear_ShouldThrow() {
        assertThrows(InvalidBookException.class,
                () -> Book.create("Test", "Author", -1, null, null));
    }

    @Test
    void createBook_WithBlankTitle_ShouldThrow() {
        assertThrows(InvalidBookException.class,
                () -> Book.create("", "Author", 2020, null, null));
    }

    @Test
    void createBook_WithNullTitle_ShouldThrow() {
        assertThrows(InvalidBookException.class,
                () -> Book.create(null, "Author", 2020, null, null));
    }

    @Test
    void createBook_WithBlankAuthor_ShouldThrow() {
        assertThrows(InvalidBookException.class,
                () -> Book.create("Title", "", 2020, null, null));
    }

    @Test
    void createBook_WithTitleTooLong_ShouldThrow() {
        String longTitle = "a".repeat(151);
        assertThrows(InvalidBookException.class,
                () -> Book.create(longTitle, "Author", 2020, null, null));
    }

    @Test
    void createBook_WithBlankDescription_ShouldTrimToEmpty() {
        Book book = Book.create("Title", "Author", 2020, "   ", null);
        assertEquals("", book.getDescription());
    }

    @Test
    void updateInformation_ShouldUpdateFields() {
        Book book = Book.create("Old Title", "Old Author", 2000, "Old desc", null);
        book.updateInformation("New Title", "New Author", 2021, "New desc", "http://cover.url");

        assertEquals("New Title", book.getTitle());
        assertEquals("New Author", book.getAuthor());
        assertEquals(2021, book.getYear());
        assertEquals("New desc", book.getDescription());
        assertEquals("http://cover.url", book.getCoverUrl());
        assertNotNull(book.getUpdatedAt());
    }

    @Test
    void updateInformation_WithInvalidData_ShouldThrow() {
        Book book = Book.create("Title", "Author", 2000, null, null);
        assertThrows(InvalidBookException.class,
                () -> book.updateInformation("", "Author", 2000, null, null));
    }

    @Test
    void softDelete_ByOwner_ShouldSucceed() {
        Book book = Book.create("Title", "Author", 2000, null, null);
        book.softDelete();

        assertTrue(book.isDeleted());
        assertNotNull(book.getDeletedAt());
        assertNotNull(book.getUpdatedAt());
    }

    @Test
    void canBeDeleted_WhenNotDeleted_ShouldReturnTrue() {
        Book book = Book.create("Title", "Author", 2000, null, null);
        assertTrue(book.canBeDeleted());
    }

    @Test
    void canBeDeleted_WhenDeleted_ShouldReturnFalse() {
        Book book = Book.create("Title", "Author", 2000, null, null);
        book.softDelete();
        assertFalse(book.canBeDeleted());
    }

    @Test
    void validate_WithValidBook_ShouldNotThrow() {
        Book book = Book.create("Title", "Author", 2000, null, null);
        assertDoesNotThrow(book::validate);
    }
}