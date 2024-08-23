import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageIcon from "@mui/icons-material/Message";
import { useAuth } from "../services/auth";

const Projekti = () => {
  const { user } = useAuth();
  const [projekti, setProjekti] = useState([]);
  const [korisnici, setKorisnici] = useState([]);

  const fetchProjekti = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projekti");
      setProjekti(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchKorisnici = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/korisnici");
      setKorisnici(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchProjekti();
    fetchKorisnici();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projekti/${id}`);
      setProjekti(projekti.filter((projekat) => projekat.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const parseIds = (idsString) => {
    if (typeof idsString === "string") {
      const cleanedString = idsString
        .replace(/[\[\]]/g, "")
        .replace(/\s+/g, "");
      const ids = cleanedString.split(",").map((id) => parseInt(id.trim(), 10));
      return ids.filter((id) => !isNaN(id));
    } else if (Array.isArray(idsString)) {
      const cleanedArray = idsString.map((id) =>
        id.replace(/[\[\]]/g, "").trim()
      );
      return cleanedArray
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
    } else {
      return [];
    }
  };

  const findKorisniciNames = (idsString) => {
    const ids = parseIds(idsString);
    const matchingKorisnici = korisnici.filter((korisnik) =>
      ids.includes(korisnik.id)
    );
    const names = matchingKorisnici.map(
      (korisnik) => `${korisnik.ime} ${korisnik.prezime}`
    );
    return names.length > 0 ? names.join(", ") : "Nepoznat korisnik";
  };

  return (
    <div>
      <h2>Lista Projekata</h2>
      {projekti.map((projekat) => (
        <Card key={projekat.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {projekat.ime_projekta}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Krajnji rok: {projekat.krajnji_rok}
            </Typography>
            <Typography variant="body2">{projekat.opis_projekta}</Typography>
            <Typography variant="body2" color="text.secondary">
              Ljudi u projektu: {findKorisniciNames(projekat.ljudi_u_projektu)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Za koga: {projekat.za_koga_projekat}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton component={Link} to={`/send-message/${projekat.id}`}>
              <MessageIcon />
            </IconButton>
            {user && user.uloga === "admin" && (
              <>
                <IconButton
                  component={Link}
                  to={`/projekti/edit/${projekat.id}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(projekat.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </CardActions>
        </Card>
      ))}
      <Link to="/dodaj-projekat">
        <Button variant="contained" color="primary">
          Dodaj Projekat
        </Button>
      </Link>
    </div>
  );
};

export default Projekti;
