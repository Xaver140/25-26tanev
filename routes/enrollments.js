import express from 'express';
import pool from '../tabla.js';

const enrollmentsRoutes = express.Router();

// GET
enrollmentsRoutes.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM enrollments');
        res.json(rows);
    } catch (err) {
        res.status(500).send("Hiba");
    }
});

// POST
enrollmentsRoutes.post('/', async (req, res) => {
    const { student_id, course_id } = req.body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO enrollments (student_id, course_id, enrolled_at) VALUES (?, ?, NOW())',
            [student_id, course_id]
        );

        res.status(201).json({
            id: result.insertId,
            student_id,
            course_id,
            enrolled_at: new Date()
        });

    } catch (err) {
        res.status(501).send("Nem teljesíthető");
    }
});

// PUT
enrollmentsRoutes.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { student_id, course_id, enrolled_at } = req.body;

    try {
        const [result] = await pool.execute(
            'UPDATE enrollments SET student_id=?, course_id=?, enrolled_at=? WHERE id=?',
            [student_id, course_id, enrolled_at, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Azonosító nem található");
        }
        res.json({ message: "Siker" });
    } catch (err) {
        res.status(501).send("Nem teljesíthető");
    }
});

// DELETE
enrollmentsRoutes.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await pool.execute(
            'DELETE FROM enrollments WHERE id=?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Azonosító nem található");
        }

        res.json({ message: "Adat törölve" });

    } catch (err) {
        res.status(501).send("Nem teljesíthető");
    }
});

export default enrollmentsRoutes;