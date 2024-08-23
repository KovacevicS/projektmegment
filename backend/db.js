// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sava2005',
    database: 'zakazivanje',
});

module.exports = db;
