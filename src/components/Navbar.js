import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/auth"; // Uvezi useAuth hook za autentifikaciju
import "./Navbar.css"; // Uključi CSS fajl za Navbar

const Navbar = () => {
  const { user, logout } = useAuth(); // Dobijanje podataka o korisniku i funkcije logout iz AuthContext-a

  return (
    <nav className="navbar">
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/korisnici">Korisnici</Link>
            <Link to="/projekti">Projekti</Link>
            <Link to="/zadaci">Zadaci</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            {" "}
            <Link to="/">Početna</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
