import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTypography,
} from "mdb-react-ui-kit";
import Select from 'react-select';

const DodajProjekat = () => {
  const [ime_projekta, setImeProjekta] = useState("");
  const [krajnji_rok, setKrajnjiRok] = useState(null);
  const [opis_projekta, setOpisProjekta] = useState("");
  const [ljudi_u_projektu, setLjudiProjekta] = useState([]);
  const [za_koga_projekat, setZaKogaProjekat] = useState("");
  const [korisnici, setKorisnici] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKorisnici = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/korisnici");
        setKorisnici(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchKorisnici();
  }, []);

  const handleDodajProjekat = async (e) => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (`0${date.getMonth() + 1}`).slice(-2);
      const day = (`0${date.getDate()}`).slice(-2);
      return `${day}.${month}.${year}`;
    };

    e.preventDefault();
    try {
      const noviProjekat = {
        ime_projekta,
        krajnji_rok: krajnji_rok ? formatDate(krajnji_rok) : "",
        opis_projekta,
        ljudi_u_projektu: ljudi_u_projektu.map((korisnik) => korisnik.value),
        za_koga_projekat,
      };

      console.log("Podaci koji se šalju na backend:", noviProjekat);

      const response = await axios.post(
        "http://localhost:5000/api/projekti",
        noviProjekat
      );
      console.log(response.data);
      navigate("/projekti");
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };
  const korisniciOptions = korisnici.map((korisnik) => ({
    value: korisnik.id,
    label: `${korisnik.ime} ${korisnik.prezime}`
  }));

  return (
    <MDBContainer fluid>
      <MDBCard
        className="mx-5 mb-5 p-5 shadow-5"
        style={{
          marginTop: "-100px",
          background: "hsla(0, 0%, 100%, 0.8)",
          backdropFilter: "blur(30px)",
          margin: "auto"
        }}
      >
        <MDBCardBody className="p-5 text-center">
          <MDBTypography variant="h4" className="mb-4">
            Dodaj novi projekat
          </MDBTypography>
          <form onSubmit={handleDodajProjekat}>
            <MDBInput
              label="Naziv projekta"
              value={ime_projekta}
              onChange={(e) => setImeProjekta(e.target.value)}
              className="mb-4"
            />
            <DatePicker
              selected={krajnji_rok}
              onChange={(date) => setKrajnjiRok(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Krajnji rok projekta"
              customInput={
                <MDBInput
                  label="Krajnji rok projekta"
                  className="mb-4"
                />
              }
              modal
              disableFocusTrap
            />
            <MDBInput
              label="Opis projekta"
              value={opis_projekta}
              onChange={(e) => setOpisProjekta(e.target.value)}
              className="mb-4"
            />
            <Select
              isMulti
              options={korisniciOptions}
              value={ljudi_u_projektu}
              onChange={setLjudiProjekta}
              className="mb-4"
            />
            <MDBInput
              label="Za koga se radi projekat"
              value={za_koga_projekat}
              onChange={(e) => setZaKogaProjekat(e.target.value)}
              className="mb-4"
            />
            <MDBBtn type="submit" color="primary" block>
              Dodaj projekat
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default DodajProjekat;
