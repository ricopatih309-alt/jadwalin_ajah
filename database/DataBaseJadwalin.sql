create database Jadwalin_Ajah

-- Table Tugas Minggu ini
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(100) NOT NULL,
  deadline VARCHAR(50) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Values Table Tugas Minggu ini
INSERT INTO tasks (subject, deadline, note) VALUES 
('Teknik Pemrog Terstruktur', 'Kamis (06/02)', 'Vclass Kuis/Forum M13'),
('Teknik Pemrog Terstruktur', 'Kamis (29/01)', 'Presentasi Project Website'),
('Matematika Lanjut 1', 'Selasa (04/02)', 'Vclass Latihan Soal UU tambahan nilai'),
('Sistem Basis Data', 'Kamis (28/01)', 'Vclass Kuis M13/M14');

-- Table Pengumuman Terbaru
CREATE TABLE announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject VARCHAR(100) NOT NULL,
  date VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Values Table Pengumuman Terbaru
INSERT INTO announcements (subject, date, content) VALUES 
('Teknik Pemrog Terstruktur', 'Kamis (06/02)', 'Vclass Kuis/Forum M13'),
('Teknik Pemrog Terstruktur', 'Kamis (29/01)', 'Presentasi Project Website'),
('Matematika Lanjut 1', 'Selasa (04/02)', 'Vclass Latihan Soal UU tambahan nilai'),
('Sistem Basis Data', 'Kamis (28/01)', 'Vclass Kuis M13/M14');


-- Table Jadwal Perkuliahan
CREATE TABLE schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day VARCHAR(20),
  time VARCHAR(30),
  code VARCHAR(20),
  subject VARCHAR(100),
  room VARCHAR(50),
  lecturer VARCHAR(100),
  sks INT);

-- Values Table Jadwal Perkuliahan
INSERT INTO schedules (day, time, code, subject, room, lecturer, sks)
VALUES
('Senin','07:30 - 09:30','IT045','Komputasi Big Data','Ruang UGTV','Team Teaching',3),
('Selasa','10:30 - 12:30','IT022','Sistem Basis Data 1','Ruang E225','Dosen Yulia Chalri',3),
('Selasa','13:30 - 15:30','IT011','Manajemen & SIM 1','Ruang E313','Dosen Cahyawati Diah K',2),
('Selasa','15:30 - 17:30','MAT05','Matematika Lanjut 1','Ruang E523','Dosen Rifki Kosasih',3),
('Rabu','08:30 - 10:30','ING02','Bahasa Inggris Bisnis 1','Ruang E344','Dosen Erni Hastuti',2),
('Rabu','12:30 - 15:30','IT033','Peng. Org. & Arst Komputer','Ruang E221','Dosen Novrina',3),
('Kamis','07:30 - 09:30','MAT09','Matematika Sistem Informasi','Ruang E316','Dosen Ira Diana Solihati',2),
('Kamis','09:30 - 11:30','IT055','Teknik Pemrog Terstruktur', 'Ruang E316','Dosen Dina Agusten',3),
('Jumat','08:00 - 11:00','LAB01','Praktikum Komputasi Big Data','ONLINE','Team Teaching',1);

-- Table Anggota Kelas
create table students (
id INT AUTO_INCREMENT PRIMARY KEY,
name varchar(50) Not null,
npm varchar(50) not null,
status ENUM('Aktif', 'Cuti', 'Non-Aktif') NOT NULL DEFAULT 'Aktif');

-- Buat Tabel Agenda
CREATE TABLE kalender_akademik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    variant VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    date_range VARCHAR(100) NOT NULL, 
    sort_date DATE NOT NULL,          
    url VARCHAR(255) DEFAULT 'https://www.google.com/'
);
UPDATE kalender_akademik 
SET url = 'https://www.youtube.com/watch?v=zJI6Ekc5Qa4' 
WHERE id = 1;

-- Data Tabel Agenda
INSERT INTO kalender_akademik (category, variant, title, date_range, sort_date, url) VALUES
('Awal Semester', 'pink', 'PKKMB (Mahasiswa Baru)', '22 Sep - 26 Sep 2025', '2025-09-22', 'https://www.google.com/'),
('Awal Semester', 'pink', 'Kursus Kompetensi (S1/D3)', '22 Sep - 27 Sep 2025', '2025-09-22', 'https://www.google.com/'),
('Perkuliahan', 'yellow', 'Perkuliahan Aktif (Pra-UTS)', '29 Sep - 06 Des 2025', '2025-09-29', 'https://www.google.com/'),
('Perkuliahan', 'yellow', 'Perkuliahan (Pasca-UTS)', '02 Jan - 29 Jan 2026', '2026-01-02', 'https://www.google.com/'),
('Administrasi', 'blue-solid', 'Distribusi FRS Online', '25 Sep - 25 Okt 2025', '2025-09-25', 'https://www.google.com/'),
('Administrasi', 'blue-solid', 'Pengisian KRS Online', '29 Sep - 25 Okt 2025', '2025-09-29', 'https://www.google.com/'),
('Administrasi', 'blue-solid', 'Batas Cetak KRS', '22 Nov 2025', '2025-11-22', 'https://www.google.com/'),
('Administrasi', 'blue-solid', 'Batas Cuti Akademik', '15 Des 2025', '2025-12-15', 'https://www.google.com/'),
('Tambahan', 'blue-outline', 'Pelatihan Kompetensi', '23 Feb - 28 Feb 2026', '2026-02-23', 'https://www.google.com/'),
('Ujian', 'pink', 'Ujian Tengah Semester (UTS)', '08 Des - 24 Des 2025', '2025-12-08', 'https://www.google.com/'),
('Ujian', 'pink', 'Ujian Utama', '02 Feb - 07 Feb 2026', '2026-02-02', 'https://www.google.com/'),
('Ujian', 'pink', 'Ujian Akhir Semester (UAS)', '09 Feb - 21 Feb 2026', '2026-02-09', 'https://www.google.com/'),
('Libur', 'yellow', 'Libur Natal & Tahun Baru', '25 Des 2025 - 01 Jan 2026', '2025-12-25', 'https://www.google.com/');

-- Table Daftar Mata Kuliah
create table daftar_matkul (
	id varchar(30) primary key,
    name varchar(100) not null,
    lecturer varchar(100),
    code varchar(20) unique not null,
    sks int not null);
    
-- Data Tabel Matakuliah
INSERT INTO daftar_matkul (id, name, lecturer, code, sks) VALUES
('sbd', 'Sistem Basis Data 1', 'Yulia Chalri', 'IT022', '3'),
('kbd', 'Komputasi Big Data', 'Team Teaching', 'IT045', '3'),
('matlan', 'Matematika Lanjut 1 */**', 'Rifky Kosasih', 'MAT05', '3'),
('tpt', 'Teknik Pemrog. Terstrukutr **', 'Dina Agustin', 'IT055', '3'),
('ing', 'Bahasa Inggris', 'Erni Hastuti', 'ING02', '2'),
('msi', 'Matematika Sistem Informasi 1', 'Ira Diana Solihati', 'MAT09', '2'),
('sim','Manajemen & SIM 1','Cahyawati Diah Kusumarini','IT011','2'),
('p_kbd', 'Praktikum Komputasi Big Data', 'TEAM TEACHING', 'LAB01', '1'),
('poak', 'Peng. Org. & Arst Komputer', 'Novrina', 'IT033', '3'); 
    
-- Table Materi Kuliah
create table materi (
	id int auto_increment primary key,
    subject_id varchar(30) not null,
    meeting int not null,
    title varchar(255) not null,
    url text not null,
    foreign key (subject_id)
	references daftar_matkul(id)
    on delete cascade,
    unique (subject_id, meeting));

-- Data Tabel Materi
INSERT INTO materi (subject_id, meeting, title, url) VALUES
('sbd', '1', 'Ini percobaan materi', 'www.google.com');
	
    -- Update data yang sudah ada
UPDATE materi 
SET url = 'https://www.google.com' 
WHERE id = '1';

        