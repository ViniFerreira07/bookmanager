DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'books' AND column_name = 'publication_year'
    ) THEN
        ALTER TABLE books RENAME COLUMN publication_year TO year;
    END IF;
END $$;
