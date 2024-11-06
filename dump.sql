PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    completed integer DEFAULT false NOT NULL
);

COMMIT;
