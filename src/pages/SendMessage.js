import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from "../services/auth";
import "./MessagesStyled.css";

const SendMessage = () => {
  const { projekatId } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(""); // Dodajemo selectedUser stanje

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let response;
        if (projekatId) {
          response = await axios.get(`http://localhost:5000/api/messages/${projekatId}`);
        } else if (selectedUser) {
          response = await axios.get(`http://localhost:5000/api/messages/private/${user.id}/${selectedUser}`);
        }
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    fetchUsers();
  }, [projekatId, selectedUser,user.id]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        if (editingMessageId) {
          await axios.put(`http://localhost:5000/api/messages/edit/${editingMessageId}`, {
            message: message,
          });
          setEditingMessageId(null);
        } else {
          const data = {
            sender_id: user.id,
            message: message,
            projekat_id: projekatId || null,
            receiver_id: selectedUser || null
          };
          await axios.post("http://localhost:5000/api/messages/send", data);
        }
        setMessage("");
        let response;
        if (projekatId) {
          response = await axios.get(`http://localhost:5000/api/messages/${projekatId}`);
        } else if (selectedUser) {
          response = await axios.get(`http://localhost:5000/api/messages/private/${user.id}/${selectedUser}`);
        }
        setMessages(response.data);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/delete/${messageId}`);
      let response;
      if (projekatId) {
        response = await axios.get(`http://localhost:5000/api/messages/${projekatId}`);
      } else if (selectedUser) {
        response = await axios.get(`http://localhost:5000/api/messages/private/${user.id}/${selectedUser}`);
      }
      setMessages(response.data);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? `${user.ime} ${user.prezime}` : 'Unknown User';
  };

  const handleMenuClick = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  return (
    <div className="message-container">
      <Typography variant="h4" gutterBottom>
        {projekatId ? `Messages for Project ID: ${projekatId}` : "Send a Private Message"}
      </Typography>
      
      {!projekatId && (
        <FormControl fullWidth>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.ime} {user.prezime}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      
      <Box className="messages-list">
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List>
            {messages.map((msg) => (
              <ListItem key={msg.id}>
                <div className={`message-bubble ${msg.sender_id === user.id ? 'sent' : 'received'}`}>
                  <div className="message-content">
                    <Typography variant="body2" fontWeight="bold">
                      {getUserName(msg.sender_id)}
                    </Typography>
                    <Typography variant="body2">
                      {msg.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(msg.timestamp).toLocaleString()}
                    </Typography>
                    {msg.sender_id === user.id && (
                      <div className="message-actions">
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(event) => handleMenuClick(event, msg)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={() => {
                            setEditingMessageId(selectedMessage.id);
                            setMessage(selectedMessage.message);
                            handleMenuClose();
                          }}>Edit</MenuItem>
                          <MenuItem onClick={() => handleDeleteMessage(selectedMessage.id)}>Delete</MenuItem>
                        </Menu>
                      </div>
                    )}
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      
      <Box className="message-input-container">
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
          disabled={!projekatId && !selectedUser} // Disable if no project or user selected
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          className="message-send-button"
          disabled={!projekatId && !selectedUser} // Disable if no project or user selected
        >
          {editingMessageId ? "Update" : "Send"}
        </Button>
      </Box>
    </div>
  );
};

export default SendMessage;
