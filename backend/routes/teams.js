const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint za dobavljanje svih timova
router.get('/', (req, res) => {
    const query = "SELECT * FROM timovi";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching teams:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Endpoint za dobavljanje pojedinačnog tima po ID-u
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM timovi WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching team by ID:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(results[0]);
    });
});

// Endpoint za dodavanje novog tima
router.post('/', (req, res) => {
    const { naziv, opis, lider_id } = req.body;

    const insertQuery = `
        INSERT INTO timovi (naziv, opis, lider_id)
        VALUES (?, ?, ?)
    `;

    db.query(insertQuery, [naziv, opis, lider_id], (err, result) => {
        if (err) {
            console.error('Error inserting team into database:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Team added successfully' });
    });
});

// Ostale rute za izmenu, brisanje itd.

module.exports = router;
