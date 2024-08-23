import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  MenuItem,
  Paper,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import { format } from 'date-fns';

const EditZadatak = () => {
  const { id } = useParams();
  const [zadatak, setZadatak] = useState(null);
  const [naziv, setNaziv] = useState("");
  const [datumZavrsetka, setDatumZavrsetka] = useState("");
  const [opis, setOpis] = useState("");
  const [status, setStatus] = useState("");
  const [napomena, setNapomena] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchZadatak = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
        const zadatakData = response.data;
        setZadatak(zadatakData);
        setNaziv(zadatakData.naziv);
        setDatumZavrsetka(zadatakData.datum_zavrsetka);
        setOpis(zadatakData.opis);
        setStatus(zadatakData.status);
        setNapomena(zadatakData.napomena);
      } catch (error) {
        console.error("Error fetching task:", error);
        setSnackbarMessage("Error fetching task");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchZadatak();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        naziv,
        datum_zavrsetka: datumZavrsetka,
        opis,
        status,
        napomena,
      });
      setSnackbarMessage("Task updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/zadaci");
    } catch (error) {
      console.error("Error updating task:", error);
      setSnackbarMessage("Error updating task");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Izmeni Zadatak</h2>
      {zadatak ? (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Naziv zadatka"
            variant="outlined"
            fullWidth
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Krajnji rok"
            type="date"
            variant="outlined"
            fullWidth
            value={datumZavrsetka.substring(0, 10)} // Format date to YYYY-MM-DD
            onChange={(e) => setDatumZavrsetka(e.target.value)}
            style={{ marginBottom: "20px" }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Opis zadatka"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <TextField
            select
            label="Status"
            variant="outlined"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ marginBottom: "20px" }}
          >
            <MenuItem value="U toku">U toku</MenuItem>
            <MenuItem value="Završeno">Završeno</MenuItem>
            <MenuItem value="Na čekanju">Na čekanju</MenuItem>
          </TextField>
          <TextField
            label="Napomena"
            variant="outlined"
            fullWidth
            value={napomena}
            onChange={(e) => setNapomena(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <Box>
            <Button type="submit" variant="contained" color="primary">
              Sačuvaj
            </Button>
          </Box>
        </form>
      ) : (
        <p>Loading...</p>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EditZadatak;
