import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';  // Uključite Navbar ovde
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import Korisnici from './pages/Korisnici';
import DodajKorisnika from './pages/DodajKorisnika';
import EditKorisnik from './pages/EditKorisnik';
import Projekti from './pages/Projekti';
import DodajProjekat from './pages/DodajProjekat';
import EditProjekat from './pages/EditProjekat';
import Zadaci from './pages/Zadaci';
import DodajZadatak from './pages/DodajZadatak';
import EditZadatak from './pages/EditZadatak';
import SendMessage from './pages/SendMessage';
import { AuthProvider } from './services/auth';
import VerifyPage from './pages/VerifyPage';
import './App.css';
//jebem ti jebeni github
function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar /> 
        <Routes>
        <Route  path="/" component={HomePage} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />
          <Route path="/korisnici" element={<Korisnici />} />
          <Route path="/dodaj-korisnika" element={<DodajKorisnika />} />
          <Route path="/edit-korisnik/:id" element={<EditKorisnik />} />
          <Route path="/projekti" element={<Projekti />} />
          <Route path="/dodaj-projekat" element={<DodajProjekat />} />
          <Route path="/edit-projekat/:id" element={<EditProjekat />} />
          <Route path="/zadaci" element={<Zadaci />} />
          <Route path="/dodaj-zadatak" element={<DodajZadatak />} />
          <Route path="/edit-zadatak/:id" element={<EditZadatak />} />
          <Route path="/send-message/:projekatId" element={<SendMessage />} />
          <Route path="/verify/:token" element={<VerifyPage />} />

        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
