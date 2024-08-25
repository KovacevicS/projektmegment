const express = require('express');
const router = express.Router();
const db = require('../db'); // Pretpostavljamo da imate datoteku za konekciju sa bazom

// Kreirajte poruku
router.post('/send', (req, res) => {
  const { sender_id, message, projekat_id, receiver_id } = req.body;

  if (!sender_id || !message) {
    return res.status(400).json({ error: 'Sender and message content are required' });
  }

  let query;
  let params;

  if (projekat_id) {
    query = 'INSERT INTO messages (sender_id, message, projekat_id, is_project_message) VALUES (?, ?, ?, TRUE)';
    params = [sender_id, message, projekat_id];
  } else if (receiver_id) {
    query = 'INSERT INTO messages (sender_id, message, receiver_id, is_project_message) VALUES (?, ?, ?, FALSE)';
    params = [sender_id, message, receiver_id];
  } else {
    return res.status(400).json({ error: 'Either projekat_id or receiver_id is required' });
  }

  db.query(query, params, (err, results) => {
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
router.get('/private/:senderId/:receiverId', (req, res) => {
  const { senderId, receiverId } = req.params;
  const query = 'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) AND is_project_message = FALSE';
  
  db.query(query, [senderId, receiverId, receiverId, senderId], (err, results) => {
    if (err) {
      console.error('Error fetching private messages:', err);
      return res.status(500).json({ error: 'Error fetching private messages' });
    }
    res.json(results);
  });
});


module.exports = router;
