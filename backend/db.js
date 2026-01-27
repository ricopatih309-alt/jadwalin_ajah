const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rico10124173',
  database: 'Jadwalin_Ajah'
});

module.exports = db;
