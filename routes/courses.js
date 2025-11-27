import express from 'express';
import pool from '../tabla.js';

const coursesRoutes = express.Router();

// GET
coursesRoutes.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM courses');
        res.json(rows);
    } catch (err) {
        res.status(500).send("Hiba a lekérdezés során");
    }
});

// POST
coursesRoutes.post('/', async (req, res) => {
    const { title, description } = req.body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO courses (title, description) VALUES (?, ?)',
            [title, description]
        );

        res.status(201).json({
            id: result.insertId,
            title,
            description
        });

    } catch (err) {
        res.status(500).send("Nem sikerült beszúrni az adatot");
    }
});

// PUT 
coursesRoutes.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;

    try {
        const [result] = await pool.execute(
            'UPDATE courses SET title=?, description=? WHERE id=?',
            [title, description, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Tantárgy nem található");
        }

        res.json({ message: "Sikeres frissítés" });

    } catch (err) {
        res.status(500).send("Nem sikerült frissíteni az adatot");
    }
});

// DELETE
coursesRoutes.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const [result] = await pool.execute(
            'DELETE FROM courses WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("kurzus nem található");
        }

        res.json({ message: "kurzus törölve" });

    } catch (err) {
        res.status(500).send("Nem sikerült törölni");
    }
});

export default coursesRoutes;