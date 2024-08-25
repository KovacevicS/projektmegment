import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../services/auth";
import { format } from "date-fns";

const sortZadaci = (zadaci) => {
  return zadaci.slice().sort((a, b) => {
    // Sortiranje po važnosti
    if (a.vaznost === b.vaznost) {
      // Ako je važnost ista, sortira se po datumu
      return new Date(a.datum_zavrsetka) - new Date(b.datum_zavrsetka);
    }
    return a.vaznost === 'Visoka' ? -1 : 1;
  });
};

const Zadaci = () => {
  const { user } = useAuth();
  const [zadaci, setZadaci] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchZadaci = async () => {
      try {
        let url = "http://localhost:5000/api/tasks";
        if (user && user.uloga !== "admin") {
          url += `?korisnik_id=${user.id}`;
        }
        const response = await axios.get(url);
        const sortedZadaci = sortZadaci(response.data);
        setZadaci(sortedZadaci);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setSnackbarMessage("Error fetching tasks");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    if (user) {
      fetchZadaci();
    }
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setZadaci(zadaci.filter((zadatak) => zadatak.id !== id));
      setSnackbarMessage("Task deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting task:", error);
      setSnackbarMessage("Error deleting task");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { status });
      setZadaci(
        zadaci.map((zadatak) =>
          zadatak.id === id ? { ...zadatak, status } : zadatak
        )
      );
      setSnackbarMessage("Task status updated");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating task status:", error);
      setSnackbarMessage("Error updating task status");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h2>Lista Zadataka</h2>
      <TextField
        label="Pretraži zadatke"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        style={{ marginBottom: "20px" }}
      />
      {user && user.uloga === "admin" && (
        <Link to="/dodaj-zadatak">
          <Button variant="contained" color="primary">
            Dodaj Zadatak
          </Button>
        </Link>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ime zadatka</TableCell>
              <TableCell>Krajnji rok</TableCell>
              <TableCell>Opis zadatka</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Napomena</TableCell>
              <TableCell>Vaznost</TableCell>
              {user && user.uloga === "admin" && (
                <TableCell>Korisnik</TableCell>
              )}
              <TableCell>Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zadaci.map((zadatak) => (
              <TableRow key={zadatak.id}>
                <TableCell>{zadatak.naziv}</TableCell>
                <TableCell>
                  {format(new Date(zadatak.datum_zavrsetka), "dd MMM yyyy")}
                </TableCell>
                <TableCell>{zadatak.opis}</TableCell>
                <TableCell>
                  <TextField
                    select
                    value={zadatak.status}
                    onChange={(e) =>
                      handleStatusChange(zadatak.id, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="U toku">U toku</MenuItem>
                    <MenuItem value="Završeno">Završeno</MenuItem>
                    <MenuItem value="Na čekanju">Na čekanju</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>{zadatak.napomena}</TableCell>
                <TableCell>{zadatak.vaznost}</TableCell>
                {user && user.uloga === "admin" && (
                  <TableCell>
                    {zadatak.korisnik_ime} {zadatak.korisnik_prezime}
                  </TableCell>
                )}
                <TableCell>
                  <Link to={`/edit-zadatak/${zadatak.id}`}>
                    <Button variant="contained" startIcon={<EditIcon />}>
                      Izmeni
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(zadatak.id)}
                  >
                    Obriši
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Zadaci;
