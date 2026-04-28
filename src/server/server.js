import express from "express";
import cors from "cors";
import db from "./database.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/projects", (request, response) => {
    const query = `
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.source_link, 
            p.completion_date, 
            GROUP_CONCAT(DISTINCT l.name) as languages, 
            GROUP_CONCAT(DISTINCT c.name) as categories
        FROM projects p
        LEFT JOIN project_languages pl ON p.id = pl.project_id
        LEFT JOIN languages l ON pl.language_id = l.id
        LEFT JOIN project_categories pc ON p.id = pc.project_id
        LEFT JOIN categories c ON pc.category_id = c.id
        GROUP BY p.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        const projects = rows.map(row => ({
            ...row,
            languages: row.languages ? row.languages.split(',') : [],
            categories: row.categories ? row.categories.split(',') : []
        }));

        response.json({
            "message": "success",
            "data": projects
        });
    });
});

app.post("/api/projects", (request, response) => {
    const { name, description, source_link, completion_date, language_ids, category_ids } = request.body;
    const insertProjectQuery = `INSERT INTO projects (name, description, source_link, completion_date) VALUES (?, ?, ?, ?)`;

    db.run(insertProjectQuery, [name, description, source_link, completion_date], function (err) {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        const projectId = this.lastID;
        const insertLanguagesQuery = `INSERT INTO project_languages (project_id, language_id) VALUES (?, ?)`;
        language_ids.forEach(language_id => {
            db.run(insertLanguagesQuery, [projectId, language_id]);
        });

        const insertCategoriesQuery = `INSERT INTO project_categories (project_id, category_id) VALUES (?, ?)`;
        category_ids.forEach(category_id => {
            db.run(insertCategoriesQuery, [projectId, category_id]);
        });

        response.json({
            "message": "success",
            "data": { id: projectId }
        });
    });
});

app.put("/api/projects/:id", (request, response) => {
    const projectId = request.params.id;
    const { name, description, source_link, completion_date, language_ids, category_ids } = request.body;
    const updateProjectQuery = `UPDATE projects SET name = ?, description = ?, source_link = ?, completion_date = ? WHERE id = ?`;

    db.run(updateProjectQuery, [name, description, source_link, completion_date, projectId], function (err) {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        const deleteLanguagesQuery = `DELETE FROM project_languages WHERE project_id = ?`;
        db.run(deleteLanguagesQuery, [projectId], () => {
            const insertLanguagesQuery = `INSERT INTO project_languages (project_id, language_id) VALUES (?, ?)`;
            language_ids.forEach(language_id => {
                db.run(insertLanguagesQuery, [projectId, language_id]);
            });
        });

        const deleteCategoriesQuery = `DELETE FROM project_categories WHERE project_id = ?`;
        db.run(deleteCategoriesQuery, [projectId], () => {
            const insertCategoriesQuery = `INSERT INTO project_categories (project_id, category_id) VALUES (?, ?)`;
            category_ids.forEach(category_id => {
                db.run(insertCategoriesQuery, [projectId, category_id]);
            });
        });

        response.json({ message: "success", changes: this.changes });
    });
});

app.delete("/api/projects/:id", (request, response) => {
    db.run(`DELETE FROM projects WHERE id = ?`, request.params.id, function (err) {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }

        const deleteLanguagesQuery = `DELETE FROM project_languages WHERE project_id = ?`;
        db.run(deleteLanguagesQuery, request.params.id);

        const deleteCategoriesQuery = `DELETE FROM project_categories WHERE project_id = ?`;
        db.run(deleteCategoriesQuery, request.params.id);

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
            "data": { id: this.lastID, name: name }
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
    const { language_ids, category_ids, start_date, end_date } = request.query;
    let query = `
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.source_link, 
            p.completion_date, 
            GROUP_CONCAT(DISTINCT l.name) as languages, 
            GROUP_CONCAT(DISTINCT c.name) as categories
        FROM projects p
        LEFT JOIN project_languages pl ON p.id = pl.project_id
        LEFT JOIN languages l ON pl.language_id = l.id
        LEFT JOIN project_categories pc ON p.id = pc.project_id
        LEFT JOIN categories c ON pc.category_id = c.id
        WHERE 1=1
    `;
    const params = [];

    if (language_ids) {
        const langIds = language_ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        if (langIds.length > 0) {
            query += ` AND p.id IN (SELECT project_id FROM project_languages WHERE language_id IN (${langIds.map(() => '?').join(',')}))`;
            params.push(...langIds);
        }
    }

    if (category_ids) {
        const catIds = category_ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        if (catIds.length > 0) {
            query += ` AND p.id IN (SELECT project_id FROM project_categories WHERE category_id IN (${catIds.map(() => '?').join(',')}))`;
            params.push(...catIds);
        }
    }

    if (start_date) {
        query += " AND p.completion_date >= ?";
        params.push(start_date);
    }

    if (end_date) {
        query += " AND p.completion_date <= ?";
        params.push(end_date);
    }
    
    query += " GROUP BY p.id";

    db.all(query, params, (err, rows) => {
        if (err) {
            response.status(400).json({ "error": err.message });
            return;
        }
        
        const projects = rows.map(row => ({
            ...row,
            languages: row.languages ? row.languages.split(',') : [],
            categories: row.categories ? row.categories.split(',') : []
        }));

        response.json({
            "message": "success",
            "data": projects
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
            "data": { id: this.lastID, name: name }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
