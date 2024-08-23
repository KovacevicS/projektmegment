import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {  MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const Korisnici = () => {
    const [korisnici, setKorisnici] = useState([]);

    useEffect(() => {
        const fetchKorisnici = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/korisnici'); // Updated API path
                setKorisnici(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchKorisnici();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/korisnici/${id}`); // Updated API path
            setKorisnici(prevKorisnici => prevKorisnici.filter(korisnik => korisnik.id !== id));
            console.log(`User with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting user with ID ${id}:`, error);
        }
    };

    return (
        <div>
            <h2>Lista Korisnika</h2>
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Ime</th>
                        <th scope='col'>Prezime</th>
                        <th scope='col'>Email</th>
                        <th scope='col'>Uloga</th>
                        <th scope='col'>Akcije</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {korisnici.map(korisnik => (
                        <tr key={korisnik.id}>
                            <td>{korisnik.ime}</td>
                            <td>{korisnik.prezime}</td>
                            <td>{korisnik.email}</td>
                            <td>{korisnik.uloga}</td>
                            <td>
                                <Link to={`/edit-korisnik/${korisnik.id}`}>
                                    <MDBBtn color='link' rounded size='sm'>Uredi</MDBBtn>
                                </Link>
                                <MDBBtn color='link' rounded size='sm' onClick={() => handleDelete(korisnik.id)}>Obriši</MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
            <Link to="/dodaj-korisnika">
                <MDBBtn color='primary' rounded>Dodaj Korisnika</MDBBtn>
            </Link>
        </div>
    );
};

export default Korisnici;
