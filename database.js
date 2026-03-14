import sqlite3 from "sqlite3";

const verboseDb = sqlite3.verbose();
const db = new verboseDb.Database("./portfolio.db", (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connected to database.");
});

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS languages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            source_link TEXT,
            completion_date TEXT,
            language_id INTEGER,
            category_id INTEGER,
            FOREIGN KEY (language_id) REFERENCES languages (id),
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )`
    );
});

export default db;
