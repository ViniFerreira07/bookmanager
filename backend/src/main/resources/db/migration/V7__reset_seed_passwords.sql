CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE users
SET password = crypt('password', gen_salt('bf')),
    updated_at = CURRENT_TIMESTAMP
WHERE email IN ('admin@bookmanager.com', 'user@bookmanager.com');
