const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint za dobavljanje svih zadataka
router.get('/', (req, res) => {
    const query = `
        SELECT zadaci.*, projekti.ime_projekta
        FROM zadaci
        LEFT JOIN projekti ON zadaci.projekat_id = projekti.id
        WHERE zadaci.korisnik_id = ?  -- Filtriraj zadatke prema korisniku
    `;
    
    // Pretpostavljamo da je korisnički ID prosleđen kroz query parametre
    const korisnik_id = req.query.korisnik_id;

    db.query(query, [korisnik_id], (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Endpoint za dobavljanje pojedinačnog zadatka po ID-u
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT zadaci.*, projekti.ime_projekta
        FROM zadaci
        LEFT JOIN projekti ON zadaci.projekat_id = projekti.id
        WHERE zadaci.id = ?
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching task by ID:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(results[0]);
    });
});

// Endpoint za dodavanje novog zadatka
router.post('/', (req, res) => {
    const { naziv, opis, status, datum_zavrsetka, projekat_id, napomena, korisnik_id } = req.body;

    const insertQuery = `
        INSERT INTO zadaci (naziv, opis, status, datum_zavrsetka, projekat_id, napomena, korisnik_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [naziv, opis, status, datum_zavrsetka, projekat_id, napomena, korisnik_id], (err, result) => {
        if (err) {
            console.error('Error inserting task into database:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Task added successfully' });
    });
});

// Endpoint za ažuriranje zadatka
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { naziv, opis, status, datum_zavrsetka, projekat_id, napomena } = req.body;

    const updateQuery = `
        UPDATE zadaci
        SET naziv = ?, opis = ?, status = ?, datum_zavrsetka = ?, projekat_id = ?, napomena = ?
        WHERE id = ?
    `;

    db.query(updateQuery, [naziv, opis, status, datum_zavrsetka, projekat_id, napomena, id], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

// Endpoint za brisanje zadatka
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM zadaci WHERE id = ?';

    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

module.exports = router;
