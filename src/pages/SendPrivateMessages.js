import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, IconButton, Typography, TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { useAuth } from "../services/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Primer ikone

const SendPrivateMessages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedUserSurname, setSelectedUserSurname] = useState('');
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/private-messages/private/${user.id}/${selectedUser}`);
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedUser, user.id]);

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);

    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setSelectedUserName(response.data.ime);
      setSelectedUserSurname(response.data.prezime);
    } catch (error) {
      console.error("Error fetching selected user info:", error);
    }
  };

  const handleBackClick = () => {
    setSelectedUser(null);
    setMessage("");
    setSelectedUserName('');
    setSelectedUserSurname('');
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedUser) {
      try {
        await axios.post("http://localhost:5000/api/private-messages/send", {
          sender_id: user.id,
          receiver_id: selectedUser,
          message: message,
        });
        setMessage(""); // Clear message input
        // Fetch updated conversation or handle UI updates
      } catch (error) {
        console.error("Error sending private message:", error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {selectedUser ? ` ${selectedUserName} ${selectedUserSurname}` : "Select a User to Send a Private Message"}
      </Typography>

      {selectedUser ? (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBackClick}
            style={{ marginBottom: "20px" }}
          >
            Back
          </Button>

          <List style={{ marginTop: "20px", padding: 0 }}>
            {messages.map((msg) => (
              <ListItem
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: msg.sender_id === user.id ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  marginBottom: '10px'
                }}
              >
                {msg.sender_id !== user.id && (
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircleIcon />
                    </Avatar>
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={msg.message}
                  secondary={` ${new Date(msg.timestamp).toLocaleString()}`}
                  style={{
                    borderRadius: '15px',
                    padding: '10px',
                    maxWidth: '40%',
                    wordBreak: 'break-word',
                    backgroundColor: msg.sender_id === user.id ? '#DCF8C6' : '#FFFFFF',
                    alignSelf: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                  }}
                />
              </ListItem>
            ))}
          </List>
          
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={handleMessageChange}
            style={{ 
              borderRadius: '30%', 
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            style={{ marginTop: "20px" }}
          >
            Send Message
          </Button>
        </>
      ) : (
        <div>
          {users.map((user) => (
            <IconButton
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              style={{ margin: "10px" }}
            >
              <AccountCircleIcon />
              <Typography variant="body1" style={{ marginLeft: "10px" }}>
                {user.ime} {user.prezime}
              </Typography>
            </IconButton>
          ))}
        </div>
      )}
    </div>
  );
};

export default SendPrivateMessages;
