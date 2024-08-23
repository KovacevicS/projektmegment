import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditProjekat = () => {
    const { id } = useParams();
    const [ime_projekta, setImeProjekta] = useState('');
    const [krajnji_rok, setKrajnjiRok] = useState(null);
    const [opis_projekta, setOpisProjekta] = useState('');
    const [ljudi_u_projektu, setLjudiProjekta] = useState([]);
    const [za_koga_projekat, setZaKogaProjekat] = useState('');
    const [korisnici, setKorisnici] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjekat = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/projekti/${id}`);
                const projekat = response.data;
                setImeProjekta(projekat.ime_projekta);
                setKrajnjiRok(new Date(projekat.krajnji_rok));
                setOpisProjekta(projekat.opis_projekta);
                setLjudiProjekta(projekat.ljudi_u_projektu);
                setZaKogaProjekat(projekat.za_koga_projekat);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        const fetchKorisnici = async () => {
            try {
                const response = await axios.get('http://localhost:5000/korisnici');
                setKorisnici(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchProjekat();
        fetchKorisnici();
    }, [id]);

    const handleEditProjekat = async (e) => {
        e.preventDefault();
        try {
            const updatedProjekat = {
                ime_projekta,
                krajnji_rok: krajnji_rok ? krajnji_rok.toISOString().split('T')[0] : '',
                opis_projekta,
                ljudi_u_projektu,
                za_koga_projekat
            };

            await axios.put(`http://localhost:5000/projekti/${id}`, updatedProjekat);
            navigate('/projekti');
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <div>
            <h2>Izmeni projekat</h2>
            <form onSubmit={handleEditProjekat}>
                <input
                    type="text"
                    placeholder="Naziv projekta"
                    value={ime_projekta}
                    onChange={(e) => setImeProjekta(e.target.value)}
                />
                <DatePicker
                    selected={krajnji_rok}
                    onChange={(date) => setKrajnjiRok(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Krajnji rok projekta"
                />
                <input
                    type="text"
                    placeholder="Opis projekta"
                    value={opis_projekta}
                    onChange={(e) => setOpisProjekta(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel id="multiple-select-label">Ljudi u projektu</InputLabel>
                    <Select
                        labelId="multiple-select-label"
                        multiple
                        value={ljudi_u_projektu}
                        onChange={(e) => setLjudiProjekta(e.target.value)}
                        renderValue={(selected) => selected.map(id => {
                            const korisnik = korisnici.find(k => k.id === id);
                            return korisnik ? korisnik.ime + ' ' + korisnik.prezime : '';
                        }).join(', ')}
                    >
                        {korisnici.map((korisnik) => (
                            <MenuItem key={korisnik.id} value={korisnik.id}>
                                {korisnik.ime} {korisnik.prezime}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <input
                    type="text"
                    placeholder="Za koga se radi projekat"
                    value={za_koga_projekat}
                    onChange={(e) => setZaKogaProjekat(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">Izmeni projekat</Button>
            </form>
        </div>
    );
};

export default EditProjekat;
