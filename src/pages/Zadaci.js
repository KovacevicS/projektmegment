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

const Zadaci = () => {
  const { user } = useAuth();
  const [zadaci, setZadaci] = useState([]);
  // const [filteredZadaci, setFilteredZadaci] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchZadaci = async () => {
      try {
        console.log(`Fetching tasks for user ID: ${user.id}`); // Debug
        const response = await axios.get(
          `http://localhost:5000/api/tasks?korisnik_id=${user.id}`
        );
        console.log(response.data); // Debug
        setZadaci(response.data);
        // setFilteredZadaci(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setSnackbarMessage("Error fetching tasks");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    if (user && user.id) {
      fetchZadaci();
    }
  }, [user]);

  /*  useEffect(() => {
    setFilteredZadaci(
      zadaci.filter((zadatak) => {
        const imeZadatka = zadatak.ime_zadatka ? zadatak.ime_zadatka.toLowerCase() : '';
        const opisZadatka = zadatak.opis_zadatka ? zadatak.opis_zadatka.toLowerCase() : '';
        return imeZadatka.includes(searchTerm.toLowerCase()) || opisZadatka.includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, zadaci]);
   */

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setZadaci(zadaci.filter((zadatak) => zadatak.id !== id));
      // setFilteredZadaci(filteredZadaci.filter((zadatak) => zadatak.id !== id));
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
      /* setFilteredZadaci(
        filteredZadaci.map((zadatak) =>
          zadatak.id === id ? { ...zadatak, status } : zadatak
        )
      ); */
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
  console.log(user);
  console.log(zadaci);
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
      <Link to="/dodaj-zadatak">
        <Button variant="contained" color="primary">
          Dodaj Zadatak
        </Button>
      </Link>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ime zadatka</TableCell>
              <TableCell>Krajnji rok</TableCell>
              <TableCell>Opis zadatka</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Napomena</TableCell>
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
                <TableCell>
                  {user && user.uloga === "admin" && (
                    <>
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
                    </>
                  )}
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
