<h1 align="center">Jadwalin Ajah</h1>
<p align="center">
Website manajemen jadwal perkuliahan untuk membantu mahasiswa mengakses informasi akademik secara cepat, terstruktur, dan terpusat.
</p>

---

## Tentang Project

**Jadwalin Ajah** adalah website yang dirancang sebagai media informasi terpusat bagi mahasiswa untuk mengelola jadwal perkuliahan dengan lebih efisien.

Website ini membantu:
- Mengurangi ketergantungan pada banyak sumber informasi
- Menyajikan jadwal secara terstruktur
- Mempermudah akses informasi akademik sehari-hari

---

## Fitur Utama

- Manajemen jadwal perkuliahan
- Informasi mata kuliah terstruktur
- (Planned) Notifikasi tugas dan jadwal baru
- (Planned) Login khusus admin/dosen untuk manajemen data

---

## Tech Stack

- Node.js
- React / Next.js
- Gemini API

---

## Admin Dashboard

1. Buat `.env` di root project dan isi `DB_CONNECTION=remote`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` sesuai database hosting.
2. Buat secret JWT dengan `openssl rand -hex 32`, lalu simpan hasilnya pada `JWT_SECRET` di `.env`.
3. Jalankan `npm run create-admin` untuk membuat akun admin. Password diminta secara tersembunyi dan disimpan sebagai bcrypt hash.
4. Jalankan `npm run dev-remote`, lalu buka `/admin/login`.

Route dashboard `/admin` tidak ditampilkan di navbar publik. Dashboard menyediakan CRUD terproteksi JWT untuk schedules, tasks, announcements, kalender akademik, students, dan materi. Semua endpoint admin memerlukan header `Authorization: Bearer <token>`. Form Tasks/Materi memakai dropdown mata kuliah dari schedules dan mengirim `subject_id`; data GET materi juga difilter berdasarkan mata kuliah terpilih.

## Upload Tugas

Backend memakai Google API PHP Client. Install dependensinya dengan `composer require google/apiclient --working-dir=backend`.

Upload tugas memakai OAuth 2.0 atas nama akun Gmail pribadi. Aktifkan Google Drive API, siapkan OAuth consent screen dan OAuth Client ID/Secret. Untuk membuat refresh token, tambahkan redirect URI `https://developers.google.com/oauthplayground` pada OAuth Client, buka Google OAuth Playground, aktifkan opsi "Use your own OAuth credentials", lalu otorisasi scope `https://www.googleapis.com/auth/drive` dan tukarkan authorization code dengan token. Simpan `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, dan `ROOT_FOLDER_ID` pada `.env`. Jangan kirim atau commit nilai-nilai tersebut.

Gunakan folder Drive yang dimiliki atau dapat diedit oleh akun Gmail yang diotorisasi. Jika OAuth consent screen berstatus Testing, Google dapat membuat refresh token kedaluwarsa setelah 7 hari; untuk pemakaian terus-menerus, atur consent screen sesuai status produksi Google.

Form publik tersedia di `/#/upload-tugas`. Upload dibatasi 20 MB dan file dibagikan sebagai public reader agar `webViewLink` dapat dibuka penerima.
