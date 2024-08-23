const express = require('express');
const router = express.Router();
const db = require('../db'); // Pretpostavljamo da imate datoteku za konekciju sa bazom

// Kreirajte poruku
router.post('/send', (req, res) => {
  const { sender_id, message, projekat_id } = req.body;

  if (!sender_id || !message || !projekat_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO messages (sender_id, message, projekat_id) VALUES (?, ?, ?)';
  db.query(query, [sender_id, message, projekat_id], (err, results) => {
    if (err) {
      console.error('Error inserting message:', err);
      return res.status(500).json({ error: 'Error inserting message' });
    }
    res.status(201).json({ message: 'Message sent successfully!' });
  });
});

// Ažurirajte poruku
router.put('/api/messages/edit/:id', (req, res) => {
  const messageId = req.params.id;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const query = 'UPDATE messages SET message = ? WHERE id = ?';
  db.query(query, [message, messageId], (err, results) => {
    if (err) {
      console.error('Error updating message:', err);
      return res.status(500).json({ error: 'Error updating message' });
    }
    res.status(200).json({ message: 'Message updated successfully!' });
  });
});

// Obrišite poruku
router.delete('/delete/:id', (req, res) => {
  const messageId = req.params.id;

  const query = 'DELETE FROM messages WHERE id = ?';
  db.query(query, [messageId], (err, results) => {
    if (err) {
      console.error('Error deleting message:', err);
      return res.status(500).json({ error: 'Error deleting message' });
    }
    res.status(200).json({ message: 'Message deleted successfully!' });
  });
});

// Preuzmite poruke za određeni projekat
router.get('/:projekatId', (req, res) => {
  const projekatId = req.params.projekatId;
  const query = 'SELECT * FROM messages WHERE projekat_id = ?';
  db.query(query, [projekatId], (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Error fetching messages' });
    }
    res.json(results);
  });
});

module.exports = router;
