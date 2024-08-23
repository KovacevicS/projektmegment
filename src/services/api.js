// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Primer API URL-a

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

// Dodajte druge API funkcije po potrebi
