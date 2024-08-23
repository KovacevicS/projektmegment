import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from "../services/auth"; // Pretpostavka da koristiš neki auth hook za korisničke podatke

const DodajZadatak = () => {
    const { user } = useAuth(); // Korisnički podaci
    const [naziv, setNaziv] = useState('');
    const [datum_zavrsetka, setDatumZavrsetka] = useState(null);
    const [opis, setOpis] = useState('');
    const [status, setStatus] = useState('U toku');
    const [projekti, setProjekti] = useState([]);
    const [projekat, setProjekat] = useState('');
    const [napomena, setNapomena] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjekti = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/projekti');
                setProjekti(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjekti();
    }, []);

    const handleDodajZadatak = async (e) => {
        e.preventDefault();
        try {
            const noviZadatak = {
                naziv,
                opis,
                status,
                datum_zavrsetka: datum_zavrsetka ? datum_zavrsetka.toISOString().split('T')[0] : '',
                projekat_id: projekat,
                napomena,
                korisnik_id: user.id // Dodaj korisnik_id
            };

            await axios.post('http://localhost:5000/api/tasks', noviZadatak);
            navigate('/zadaci');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <div>
            <h2>Dodaj Zadatak</h2>
            <form onSubmit={handleDodajZadatak}>
                <TextField
                    label="Naziv zadatka"
                    value={naziv}
                    onChange={(e) => setNaziv(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <DatePicker
                    selected={datum_zavrsetka}
                    onChange={(date) => setDatumZavrsetka(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Datum završetka zadatka"
                    className="datepicker"
                />
                <TextField
                    label="Opis zadatka"
                    value={opis}
                    onChange={(e) => setOpis(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="select-projekat-label">Projekat</InputLabel>
                    <Select
                        labelId="select-projekat-label"
                        value={projekat}
                        onChange={(e) => setProjekat(e.target.value)}
                    >
                        {projekti.map(projekat => (
                            <MenuItem key={projekat.id} value={projekat.id}>
                                {projekat.ime_projekta}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Napomena"
                    value={napomena}
                    onChange={(e) => setNapomena(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">Dodaj Zadatak</Button>
            </form>
        </div>
    );
};

export default DodajZadatak;
