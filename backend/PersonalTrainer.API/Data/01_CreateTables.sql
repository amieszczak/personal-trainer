-- Personal Trainer Database Schema (SQLite)
-- Created: 2025-12-07

-- Table: Transformations
CREATE TABLE IF NOT EXISTS Transformations (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Age INTEGER NOT NULL,
    Description TEXT NOT NULL,
    Story TEXT NOT NULL,
    Quote TEXT NOT NULL,
    Image TEXT NULL
);
