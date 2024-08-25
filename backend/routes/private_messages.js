// U 'routes/privateMessages.js' ili sličnoj datoteci
const express = require('express');
const router = express.Router();
const db = require('../db'); // Pretpostavljamo da imate datoteku za konekciju sa bazom

// Kreiraj privatnu poruku
router.post('/send', (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO private_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
  db.query(query, [sender_id, receiver_id, message], (err, results) => {
    if (err) {
      console.error('Error inserting private message:', err);
      return res.status(500).json({ error: 'Error inserting private message' });
    }
    res.status(201).json({ message: 'Private message sent successfully!' });
  });
});

module.exports = router;


// Preuzmi privatne poruke između dva korisnika
router.get('/private/:userId1/:userId2', (req, res) => {
    const { userId1, userId2 } = req.params;
    const query = `
      SELECT * FROM private_messages
      WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
    `;
    db.query(query, [userId1, userId2, userId2, userId1], (err, results) => {
      if (err) {
        console.error('Error fetching private messages:', err);
        return res.status(500).json({ error: 'Error fetching private messages' });
      }
      res.json(results);
    });
  });
  
// Obrišite privatnu poruku
router.delete('/delete/:id', (req, res) => {
    const messageId = req.params.id;
    const query = 'DELETE FROM private_messages WHERE id = ?';
    db.query(query, [messageId], (err, results) => {
        if (err) {
            console.error('Error deleting private message:', err);
            return res.status(500).json({ error: 'Error deleting private message' });
        }
        res.status(200).json({ message: 'Private message deleted successfully!' });
    });
});

module.exports = router;
