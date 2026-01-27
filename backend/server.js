const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// TEST SERVER
app.get('/', (req, res) => {
  res.send('Backend JADWALIN AJAH berjalan');
});

// API ambil jadwal
app.get('/api/schedules', (req, res) => {
  db.query('SELECT * FROM schedules', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// API ambil Tugas Minggu Ini
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// API ambil Pengumuman Terbaru
app.get('/api/announcements', (req, res) => {
  db.query('SELECT * FROM announcements ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// API ambil Data Mahasiswa Terbaru
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// API ambil Kalender Akademik
app.get('/api/calendar', (req, res) => {
  // Kita urutkan berdasarkan sort_date agar timeline-nya rapi
  const sql = "SELECT * FROM kalender_akademik ORDER BY sort_date ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET semua mata kuliah
app.get('/api/daftar_matkul', (req, res) => {
  db.query('SELECT * FROM daftar_matkul', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET materi berdasarkan subject_id
app.get('/api/subjects/:id/materi', (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT * FROM materi WHERE subject_id = ? ORDER BY meeting ASC',
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.listen(3001, () => {
  console.log('Backend running di http://localhost:3001');
});

