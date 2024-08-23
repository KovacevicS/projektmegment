import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';

const EditKorisnik = () => {
    const { id } = useParams();
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [email, setEmail] = useState('');
    const [uloga, setUloga] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchKorisnik = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/korisnici/${id}`);
                const korisnik = response.data;
                setIme(korisnik.ime);
                setPrezime(korisnik.prezime);
                setEmail(korisnik.email);
                setUloga(korisnik.uloga);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchKorisnik();
    }, [id]);

    const handleEditKorisnik = async (e) => {
        e.preventDefault();
        try {
            const updatedKorisnik = {
                ime,
                prezime,
                email,
                uloga
            };

            await axios.put(`http://localhost:5000/korisnici/${id}`, updatedKorisnik);
            navigate('/korisnici');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            <h2>Izmeni korisnika</h2>
            <form onSubmit={handleEditKorisnik}>
                <input
                    type="text"
                    placeholder="Ime"
                    value={ime}
                    onChange={(e) => setIme(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Prezime"
                    value={prezime}
                    onChange={(e) => setPrezime(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <select
                    value={uloga}
                    onChange={(e) => setUloga(e.target.value)}
                >
                    <option value="" disabled>Odaberi ulogu</option>
                    <option value="admin">Admin</option>
                    <option value="nabavka">Nabavka</option>
                    <option value="komercijala">Komercijala</option>
                    <option value="radnik">Radnik</option>
                    <option value="finansije">Finansije</option>
                </select>
                <Button type="submit" variant="contained" color="primary">Izmeni korisnika</Button>
            </form>
        </div>
    );
};

export default EditKorisnik;
