import express from "express";
import cors from "cors";
import db from "./database.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/projects", (request, response) => {
    db.all(`SELECT p.id, p.name, p.description, p.source_link, p.completion_date, l.name as language, c.name as category 
            FROM projects p
            LEFT JOIN languages l ON p.language_id = l.id
            LEFT JOIN categories c ON p.category_id = c.id`, [], (err, rows) => {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        response.json({
            "message": "success",
            "data": rows
        });
    });
});

app.post("/api/projects", (request, response) => {
    const { name, description, source_link, completion_date, language_id, category_id } = request.body;
    db.run(`INSERT INTO projects (name, description, source_link, completion_date, language_id, category_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, source_link, completion_date, language_id, category_id], function (err) {
            if (err) {
                response.status(400).json({ "error": err.message });
                return;
            }

            response.json({
                "message": "success",
                "data": { id: this.lastID }
            });
        });
});

app.put("/api/projects/:id", (request, response) => {
    const { name, description, source_link, completion_date, language_id, category_id } = request.body;
    db.run(`UPDATE projects SET name = ?, description = ?, source_link = ?, completion_date = ?, language_id = ?, category_id = ? WHERE id = ?`,
        [name, description, source_link, completion_date, language_id, category_id, request.params.id], function (err) {
            if (err) {
                response.status(400).json({ "error": err.message });
                return;
            }

            response.json({ message: "success", changes: this.changes });
        });
});

app.delete("/api/projects/:id", (request, response) => {
    db.run(`DELETE FROM projects WHERE id = ?`, request.params.id, function (err) {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        response.json({ message: "success", changes: this.changes });
    });
});

app.get("/api/languages", (request, response) => {
    db.all("SELECT * FROM languages", [], (err, rows) => {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        response.json({
            "message": "success",
            "data": rows
        });
    });
});

app.post("/api/languages", (request, response) => {
    const { name } = request.body;
    db.run(`INSERT INTO languages (name) VALUES (?)`, [name], function (err) {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        response.json({
            "message": "success",
            "data": { id: this.lastID }
        });
    });
});

app.get("/api/categories", (request, response) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        response.json({
            "message": "success",
            "data": rows
        });
    });
});

app.get("/api/reports", (request, response) => {
    const { language_id, category_id, start_date, end_date } = request.query;
    let query = `SELECT p.id, p.name, p.description, p.source_link, p.completion_date, l.name as language, c.name as category 
                 FROM projects p
                 LEFT JOIN languages l ON p.language_id = l.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE 1=1`;
    const params = [];

    if (language_id) {
        query += " AND p.language_id = ?";
        params.push(language_id);
    }

    if (category_id) {
        query += " AND p.category_id = ?";
        params.push(category_id);
    }

    if (start_date) {
        query += " AND p.completion_date >= ?";
        params.push(start_date);
    }

    if (end_date) {
        query += " AND p.completion_date <= ?";
        params.push(end_date);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        response.json({
            "message": "success",
            "data": rows
        });
    });
});

app.post("/api/categories", (request, response) => {
    const { name } = request.body;
    db.run(`INSERT INTO categories (name) VALUES (?)`, [name], function (err) {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        response.json({
            "message": "success",
            "data": { id: this.lastID }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
