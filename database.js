import sqlite3 from "sqlite3";

const dbPath = process.env.DATABASE_PATH || "./portfolio.db";

const verboseDb = sqlite3.verbose();
const db = new verboseDb.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log(`Connected to database at ${dbPath}`);
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
            completion_date TEXT
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS project_languages (
            project_id INTEGER,
            language_id INTEGER,
            PRIMARY KEY (project_id, language_id),
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
            FOREIGN KEY (language_id) REFERENCES languages (id) ON DELETE CASCADE
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS project_categories (
            project_id INTEGER,
            category_id INTEGER,
            PRIMARY KEY (project_id, category_id),
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
        )`
    );
});

export default db;
