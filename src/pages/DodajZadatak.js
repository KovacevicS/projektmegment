import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from "../services/auth";

const DodajZadatak = () => {
    const { user } = useAuth();
    const [naziv, setNaziv] = useState('');
    const [datum_zavrsetka, setDatumZavrsetka] = useState(null);
    const [opis, setOpis] = useState('');
    const [status, setStatus] = useState('U toku');
    const [projekti, setProjekti] = useState([]);
    const [projekat, setProjekat] = useState('');
    const [napomena, setNapomena] = useState('');
    const [korisnici, setKorisnici] = useState([]);
    const [korisnikId, setKorisnikId] = useState('');
    const [vaznost, setVaznost] = useState('Srednja');
    const [zadaci, setZadaci] = useState([]);
    const [filteredProjekti, setFilteredProjekti] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjektiIKorisnici = async () => {
            try {
                const [projektiResponse, korisniciResponse, zadaciResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/projekti'),
                    axios.get('http://localhost:5000/api/korisnici'),
                    axios.get('http://localhost:5000/api/tasks')
                ]);
                setProjekti(projektiResponse.data);
                setKorisnici(korisniciResponse.data);
                setZadaci(zadaciResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (user && user.uloga === 'admin') {
            fetchProjektiIKorisnici();
        }
    }, [user]);

    useEffect(() => {
        if (korisnikId) {
            // Filtriraj projekte na osnovu izabranog korisnika
            console.log("Izabrani korisnik ID:", korisnikId);
            const filtered = projekti.filter(projekat => {
                console.log("Projekat ID:", projekat.id, "Ljudi u projektu:", projekat.ljudi_u_projektu);
                const ljudiUProjektu = JSON.parse(projekat.ljudi_u_projektu) || [];
                return ljudiUProjektu.includes(korisnikId);
            });
            setFilteredProjekti(filtered);
        } else {
            setFilteredProjekti([]);
        }
    }, [korisnikId, projekti]);

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
                korisnik_id: korisnikId,
                vaznost
            };

            await axios.post('http://localhost:5000/api/tasks', noviZadatak);
            navigate('/zadaci');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    if (user && user.uloga !== 'admin') {
        return <div>Nemate ovlašćenje za dodavanje zadataka.</div>;
    }

    // Izračunaj broj zadataka po korisniku
    const korisniciSaBrojemZadataka = korisnici.map(korisnik => {
        const brojZadataka = zadaci.filter(zadatak => zadatak.korisnik_id === korisnik.id).length;
        return { ...korisnik, brojZadataka };
    });

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
                    <InputLabel id="select-korisnik-label">Izaberite korisnika</InputLabel>
                    <Select
                        labelId="select-korisnik-label"
                        value={korisnikId}
                        onChange={(e) => setKorisnikId(e.target.value)}
                    >
                        {korisniciSaBrojemZadataka.map(korisnik => (
                            <MenuItem key={korisnik.id} value={korisnik.id}>
                                {korisnik.ime} {korisnik.prezime} (Uloga: {korisnik.uloga})(Zadaci: {korisnik.brojZadataka})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="select-projekat-label">Projekat</InputLabel>
                    <Select
                        labelId="select-projekat-label"
                        value={projekat}
                        onChange={(e) => setProjekat(e.target.value)}
                        disabled={!korisnikId}
                    >
                        {filteredProjekti.map(projekat => (
                            <MenuItem key={projekat.id} value={projekat.id}>
                                {projekat.ime_projekta}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="select-vaznost-label">Vaznost</InputLabel>
                    <Select
                        labelId="select-vaznost-label"
                        value={vaznost}
                        onChange={(e) => setVaznost(e.target.value)}
                    >
                        <MenuItem value="Niska">Niska</MenuItem>
                        <MenuItem value="Srednja">Srednja</MenuItem>
                        <MenuItem value="Visoka">Visoka</MenuItem>
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
