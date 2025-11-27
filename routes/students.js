import express from 'express';
import pool from '../tabla.js';

const studentsRoutes = express.Router();

// GET
studentsRoutes.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a lekérdezéskor");
    }
});

// POST
studentsRoutes.post('/', async (req, res) => {
    const { name, email, birthdate } = req.body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO students (name, email, birthdate) VALUES (?, ?, ?)',
            [name, email, birthdate]
        );
        res.status(201).json({
            id: result.insertId,
            name,
            email,
            birthdate
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send("Ez az email cím már létezik!");
        }
        res.status(500).send("Nem sikerült beszúrni az adatot");
    }
});

// PUT
studentsRoutes.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, email, birthdate } = req.body;

    try {
        const [result] = await pool.execute(
            'UPDATE students SET name=?, email=?, birthdate=? WHERE id=?',
            [name, email, birthdate, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Diák nem található");
        }
        res.json({ message: "Siker" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send("Email már foglalt");
        }
        res.status(500).send("Nem sikerült frissíteni");
    }
});

// DELETE
studentsRoutes.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const [result] = await pool.execute(
            'DELETE FROM students WHERE id=?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Diák nem található");
        }
        res.json({ message: "Diák törölve" });
    } catch (err) {
        res.status(500).send("Nem sikerült törölni az adatot");
    }
});
export default studentsRoutes;