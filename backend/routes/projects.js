const express = require("express");
const router = express.Router();
const db = require("../db");

// Konverzija formata datuma
function formatDatum(datum) {
  const parts = datum.split(".");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Endpoint za dodavanje novog projekta
router.post('/', (req, res) => {
    const { ime_projekta, krajnji_rok, opis_projekta, za_koga_projekat, ljudi_u_projektu } = req.body;
  
    console.log("Podaci koji stižu na backend:", req.body); // Dodajte ovaj console.log
  
    // Provera obaveznih polja
    if (!ime_projekta || !krajnji_rok) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    // Validacija datuma
    if (!isValidDate(krajnji_rok)) {
      return res.status(400).json({ error: 'Invalid date format for krajnji_rok' });
    }
  
    const formattedDate = formatDatum(krajnji_rok);
  
    // Ensure ljudi_u_projektu is properly stringified
    let ljudiUProjektuJSON;
    try {
      ljudiUProjektuJSON = JSON.stringify(ljudi_u_projektu);
    } catch (error) {
      console.error('Error stringifying ljudi_u_projektu:', error);
      return res.status(400).json({ error: 'Invalid ljudi_u_projektu format' });
    }
  
    const projekatQuery = `
      INSERT INTO projekti (ime_projekta, krajnji_rok, opis_projekta, za_koga_projekat, ljudi_u_projektu)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(projekatQuery, [ime_projekta, formattedDate, opis_projekta, za_koga_projekat, ljudiUProjektuJSON], (err, result) => {
      if (err) {
        console.error('Error inserting project into database:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
  
      res.status(201).json({ message: 'Project added successfully', projectId: result.insertId });
    });
  });
  

// Endpoint za dobavljanje svih projekata
router.get("/", (req, res) => {
  const query = `
        SELECT * FROM projekti
    `;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Database error" });
      return;
    }

    const formattedResults = results.map((projekat) => ({
      ...projekat,
      krajnji_rok: projekat.krajnji_rok
        ? new Date(projekat.krajnji_rok).toISOString().split("T")[0]
        : "",
      ljudi_u_projektu: projekat.ljudi_u_projektu
        ? projekat.ljudi_u_projektu.split(", ")
        : [],
    }));

    res.json(formattedResults);
  });
});

// Endpoint za ažuriranje projekta
router.put("/:id", (req, res) => {
  const projekatId = req.params.id;
  const { ime_projekta, krajnji_rok, opis_projekta, za_koga_projekat } =
    req.body;

  // Validacija datuma
  if (krajnji_rok && !isValidDate(krajnji_rok)) {
    return res
      .status(400)
      .json({ error: "Invalid date format for krajnji_rok" });
  }

  const formattedDate = krajnji_rok ? formatDatum(krajnji_rok) : undefined;

  const updateProjekatQuery = `
        UPDATE projekti
        SET ime_projekta = ?, krajnji_rok = ?, opis_projekta = ?, za_koga_projekat = ?
        WHERE id = ?
    `;

  db.query(
    updateProjekatQuery,
    [ime_projekta, formattedDate, opis_projekta, za_koga_projekat, projekatId],
    (err, result) => {
      if (err) {
        console.error("Error updating project:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ message: "Project updated successfully" });
    }
  );
});

// Endpoint za brisanje projekta
router.delete("/:id", (req, res) => {
  const projekatId = req.params.id;

  const deleteProjekatQuery = `
        DELETE FROM projekti
        WHERE id = ?
    `;

  db.query(deleteProjekatQuery, [projekatId], (err, result) => {
    if (err) {
      console.error("Error deleting project:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Project deleted successfully" });
  });
});

// Pomoćna funkcija za validaciju datuma
function isValidDate(dateString) {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  return regex.test(dateString);
}

module.exports = router;
