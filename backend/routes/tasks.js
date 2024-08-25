const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint za dobavljanje svih zadataka
// Endpoint za dobavljanje svih zadataka
router.get('/', (req, res) => {
    const korisnik_id = req.query.korisnik_id;

    // Ako korisnik_id nije prosleđen, admin može da vidi sve zadatke
    const query = `
        SELECT zadaci.*, projekti.ime_projekta, korisnici.ime AS korisnik_ime, korisnici.prezime AS korisnik_prezime
        FROM zadaci
        LEFT JOIN projekti ON zadaci.projekat_id = projekti.id
        LEFT JOIN korisnici ON zadaci.korisnik_id = korisnici.id
        WHERE ? -- Ako korisnik_id postoji, filtriraj prema korisniku
    `;
    
    const queryParams = korisnik_id ? [korisnik_id] : [true]; // Ako nije admin, filtriraj prema korisniku_id

    db.query(query, queryParams, (err, results) => {
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
    const { naziv, opis, status, datum_zavrsetka, projekat_id, napomena, korisnik_id, vaznost } = req.body;

    const insertQuery = `
        INSERT INTO zadaci (naziv, opis, status, datum_zavrsetka, projekat_id, napomena, korisnik_id, vaznost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [naziv, opis, status, datum_zavrsetka, projekat_id, napomena, korisnik_id, vaznost], (err, result) => {
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
    const { naziv, opis, status, datum_zavrsetka, projekat_id, napomena, vaznost } = req.body;

    const updateQuery = `
        UPDATE zadaci
        SET naziv = ?, opis = ?, status = ?, datum_zavrsetka = ?, projekat_id = ?, napomena = ?, vaznost = ?
        WHERE id = ?
    `;

    db.query(updateQuery, [naziv, opis, status, datum_zavrsetka, projekat_id, napomena, vaznost, id], (err, result) => {
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
