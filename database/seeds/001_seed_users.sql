-- seed example (password is bcrypt hash of "password")
INSERT INTO users (email, password_hash)
VALUES ('admin@example.com', '$2b$10$u1bQ8g1mBWE2G7Z9XzH6heRsmw8z/9mdnXq9zI3Gq3G1kGq0tqC7e')
ON CONFLICT (email) DO NOTHING;
