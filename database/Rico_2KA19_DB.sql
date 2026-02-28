-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 27 Feb 2026 pada 06.04
-- Versi server: 11.4.10-MariaDB-deb12
-- Versi PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Basis data: `Rico_2KA19_DB`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `date` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data untuk tabel `announcements`
--

INSERT INTO `announcements` (`id`, `subject`, `date`, `content`, `created_at`) VALUES
(1, 'PERKULIAHAN SEMESTER 4', 'Senin (02/03)', 'Perkuliahan Semester 4 akan dimulai Senin, 2 Maret 2026', '2026-02-21 11:19:21'),
(2, 'IPK SEMESTER 3', 'Rabu (25/02)', 'IPK Semester 3 sudah dapat dilihat melalui Student Site', '2026-02-25 12:27:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `daftar_matkul`
--

CREATE TABLE `daftar_matkul` (
  `id` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `lecturer` varchar(100) DEFAULT NULL,
  `code` varchar(20) NOT NULL,
  `sks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data untuk tabel `daftar_matkul`
--

INSERT INTO `daftar_matkul` (`id`, `name`, `lecturer`, `code`, `sks`) VALUES
('matlan2', 'Matematika Lanjut 2 **', 'Desti Riminarsih', 'MATxx', 2),
('msi2', 'Matematika Sistem Informasi 2', 'Ira Diana Solihati', 'MAT09', 2),
('pak', 'Pengantar Akuntansi Keuangan', 'Budi Prijanto', 'AK', 3),
('pbo', 'Pemrograman Berorientasi Objek', 'Agung Slamet Riyadi', 'IT***', 3),
('sbd2', 'Sistem Basis Data 2 */**', 'Baby Lolita Basyah', 'x', 3),
('sim2', 'Manajemen & SIM 2 *', 'Mohamad Fuad', 'ITxxx', 2),
('sisop', 'Sistem Operasi **', 'Sunny Arief Sudiro', 'xxx', 3),
('stat', 'Statistika **', 'Putri Irene Kanny', 'stat1', 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kalender_akademik`
--

CREATE TABLE `kalender_akademik` (
  `id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `variant` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date_range` varchar(100) NOT NULL,
  `sort_date` date NOT NULL,
  `url` varchar(255) DEFAULT 'https://www.google.com/'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data untuk tabel `kalender_akademik`
--

INSERT INTO `kalender_akademik` (`id`, `category`, `variant`, `title`, `date_range`, `sort_date`, `url`) VALUES
(1, 'Perkuliahan', 'yellow', 'Perkuliahan sebelum UTS', '2 Maret - 23 Mei 2026', '2026-03-02', 'https://baak.gunadarma.ac.id'),
(27, 'LIBUR', 'yellow', 'Libur Hari Raya Idul Fitri', '16 Maret- 28 Maret 2026', '2026-03-16', 'https://baak.gunadarma.ac.id/'),
(28, 'Administrasi', 'blue-solid', 'Distribusi FRS Online', '2 Maret- 11 April 2026', '2026-03-02', 'https://baak.gunadarma.ac.id/'),
(29, 'Administrasi', 'blue-solid', ' Pengisian KRS Online', '4 Maret- 18 April 2026', '2026-03-04', 'https://baak.gunadarma.ac.id/'),
(30, 'Administrasi', 'blue-solid', ' Batas Akhir Cetak KRS', '16  Mei 2026', '2026-05-16', 'https://baak.gunadarma.ac.id/'),
(31, 'UJIAN', 'pink', ' Ujian Tengah Semester (UTS)', '25  Mei - 13 Juni 2026', '2026-05-25', 'https://baak.gunadarma.ac.id/'),
(32, 'Administrasi', 'blue-solid', ' Batas Akhir Pengurusan Cuti Akademik', '5 Juni  2026', '2026-06-05', 'https://baak.gunadarma.ac.id/'),
(33, 'tambahan', 'blue-outline', 'Kursus/Pelatihan  Berbasis Kompetensi', '15 Juni – 20 Juni 2026', '2026-06-15', 'https://baak.gunadarma.ac.id/'),
(34, 'Perkuliahan', 'yellow', 'Perkuliahan setelah UTS', '22 Juni – 18 Juli 2026', '2026-06-22', 'https://baak.gunadarma.ac.id/'),
(35, 'Ujian', 'pink', 'Ujian Utama', '20 Juli – 25 Juli 2026', '2026-07-20', 'https://baak.gunadarma.ac.id/'),
(36, 'Ujian', 'pink', 'Ujian Akhir Semester (UAS)', '27 Juli – 8 Agustus 2026', '2026-07-27', 'https://baak.gunadarma.ac.id/'),
(37, 'Perkuliahan', 'yellow', 'Libur Antar Semester', '10 Agustus – 12 September 2026', '2026-08-10', 'https://baak.gunadarma.ac.id/');

-- --------------------------------------------------------

--
-- Struktur dari tabel `materi`
--

CREATE TABLE `materi` (
  `id` int(11) NOT NULL,
  `subject_id` varchar(30) NOT NULL,
  `meeting` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `day` varchar(20) DEFAULT NULL,
  `time` varchar(30) DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  `lecturer` varchar(100) DEFAULT NULL,
  `sks` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data untuk tabel `schedules`
--

INSERT INTO `schedules` (`id`, `day`, `time`, `code`, `subject`, `room`, `lecturer`, `sks`) VALUES
(1, 'Senin', '07:30 - 10:30', 'IT***', 'Statistika', 'Ruang E511', 'Dosen Putri Irene Kanny', 3),
(2, 'Senin', '11:30 - 13:30', 'MAT**', 'Matematika  Lanjut 2', 'Ruang E321', 'Dosen Desti Riminarsih', 2),
(3, 'Senin', '13:30 - 16:30', 'IT***', 'Pemro. Berorientasi Objek', 'Ruang E333', 'Dosen Agung Slamet Riyadi', 3),
(4, 'Selasa', '07:30 - 09:30', 'MAT**', 'Matematika Sistem Informasi 2', 'Ruang E222', 'Dosen Ira  Diana Solihati', 2),
(5, 'Selasa', '09:30 - 11:30', 'IT***', 'Manajemenn dan SIM 2', 'Ruang E222', 'Mohamad Fuad', 2),
(6, 'Selasa', '11:30 - 14:30', 'IT***', 'Sistem Basis Data 2', 'Ruang E331', 'Dosen Baby Lolita Basyah', 3),
(7, 'Kamis', '10:30 - 13:30', 'IT***', 'Sistem Operasi', 'Ruang E448', 'Dosen Sunny Arief Sudiro', 3),
(8, 'Kamis', '14:30 - 17:30', '*****', 'Peng. Akuntansi Keuangan', 'Ruang E323', 'Dosen Budi Prijanto', 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `npm` varchar(50) NOT NULL,
  `status` enum('Aktif','Cuti','Non-Aktif') NOT NULL DEFAULT 'Aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data untuk tabel `students`
--

INSERT INTO `students` (`id`, `name`, `npm`, `status`) VALUES
(1, 'ABDUL GOFFUR', '10124022', 'Aktif'),
(2, 'ADETYA RACHMA ARYANI', '10124033', 'Aktif'),
(3, 'AFFAN RAFI', '10124046', 'Aktif'),
(4, 'AHMAD TSANI BAIHAQI', '10124073', 'Aktif'),
(5, 'ANGGINI DEWI BUDIARTO', '10124161', 'Aktif'),
(6, 'ANTHONY FREDERICO PATI', '10124173', 'Aktif'),
(7, 'ARDHELIA INTAN PERMATASARI', '10124179', 'Aktif'),
(8, 'ARSYA RAFAEL PRATAMA PUTRA', '10124204', 'Aktif'),
(9, 'ASSAGAF DIMASYQI ALI', '10124214', 'Aktif'),
(10, 'AUFA RADJA RIZQULLOH', '10124218', 'Aktif'),
(11, 'CLARISSA CASSADY SIENARTO', '10124287', 'Aktif'),
(12, 'DANDI WAHYU ANTOTAMA DZULLROHM', '10124299', 'Aktif'),
(13, 'DIMAS ARYAWIBOWO', '10124351', 'Aktif'),
(14, 'DIO NUGROHO', '10124361', 'Aktif'),
(15, 'FAHMI FATHURRAHMAN SYARIF', '10124413', 'Aktif'),
(16, 'FATHIR RAMDANI SUMANTRI', '10124463', 'Aktif'),
(17, 'FEBRY NABIL SAPUTRA', '10124483', 'Aktif'),
(38, 'FELLINZA SALWA RIADDY', '11124472', 'Aktif'),
(39, 'GALIH PRIYATNA PUTRA', '10124509', 'Aktif'),
(40, 'GEDE DWI WICAKSONO', '10124514', 'Aktif'),
(41, 'HILMI RAFIID MUTTAQI', '10124565', 'Aktif'),
(42, 'KIAGOOS RAJA HELVI MEIANDA HEL', '10124663', 'Aktif'),
(43, 'MUHAMMAD AUFA RAFIQI', '10124812', 'Aktif'),
(44, 'MUHAMMAD FAIZ TAJUL \'ULUM', '10124838', 'Aktif'),
(45, 'MUHAMMAD FARREL FAVIAN', '10124849', 'Aktif'),
(46, 'NAILA HARDIYANTI', '11124023', 'Aktif'),
(47, 'NAURA IZZA ULAYYA', '11124043', 'Aktif'),
(48, 'NAZWA SOPIAN', '11124052', 'Aktif'),
(49, 'NIA HERLINA HASDINIATI', '11124057', 'Aktif'),
(50, 'PRAYOGA ARDIAN PRATAMA', '11124085', 'Aktif'),
(51, 'RAFI RAIHAN PUTRA NOVIANTARA', '11124120', 'Aktif'),
(52, 'RAIHAN JOSEPH RAPHAEL', '11124140', 'Aktif'),
(53, 'RAJWA ALI ALFATH WIDODO', '11124147', 'Aktif'),
(54, 'RIJALY DAI FARHAN', '11124230', 'Aktif'),
(55, 'VERDIAN ADINATA WIJAYA', '11124356', 'Aktif'),
(56, 'WILDAN AKBAR FAHREZI', '11124369', 'Aktif'),
(57, 'YUZRIL FAUZAN HAKIM', '11124399', 'Aktif');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `deadline` varchar(50) NOT NULL,
  `note` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Indeks untuk tabel yang dibuang
--

--
-- Indeks untuk tabel `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `daftar_matkul`
--
ALTER TABLE `daftar_matkul`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indeks untuk tabel `kalender_akademik`
--
ALTER TABLE `kalender_akademik`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `materi`
--
ALTER TABLE `materi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subject_id` (`subject_id`,`meeting`);

--
-- Indeks untuk tabel `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `kalender_akademik`
--
ALTER TABLE `kalender_akademik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT untuk tabel `materi`
--
ALTER TABLE `materi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT untuk tabel `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `materi`
--
ALTER TABLE `materi`
  ADD CONSTRAINT `materi_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `daftar_matkul` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
