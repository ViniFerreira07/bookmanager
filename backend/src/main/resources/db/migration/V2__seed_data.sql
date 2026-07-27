INSERT INTO users (id, username, email, password, role, created_at, updated_at, deleted) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin', 'admin@bookmanager.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92sWj0x8ZdPMGBsZcJZ9G', 'ADMIN', CURRENT_TIMESTAMP, NULL, FALSE),
  ('22222222-2222-2222-2222-222222222222', 'user', 'user@bookmanager.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92sWj0x8ZdPMGBsZcJZ9G', 'USER', CURRENT_TIMESTAMP, NULL, FALSE);

INSERT INTO books (title, author, year, description, cover_url, created_by) VALUES
  ('Clean Code', 'Robert C. Martin', 2008, 'A handbook of agile software craftsmanship.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794', '11111111-1111-1111-1111-111111111111'),
  ('Spring in Action', 'Craig Walls', 2021, 'A practical guide to Spring Boot and enterprise Java.', 'https://images.unsplash.com/photo-1516979187454-437ec0f68d0c', '22222222-2222-2222-2222-222222222222'),
  ('Domain-Driven Design', 'Eric Evans', 2003, 'A classic introduction to strategic design.', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f', '11111111-1111-1111-1111-111111111111');
