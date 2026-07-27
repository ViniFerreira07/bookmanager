ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE books ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Ensure description column is varchar(2000) instead of TEXT to avoid PostgreSQL type issues
ALTER TABLE books ALTER COLUMN description TYPE VARCHAR(2000);
ALTER TABLE books ALTER COLUMN description SET NOT NULL;