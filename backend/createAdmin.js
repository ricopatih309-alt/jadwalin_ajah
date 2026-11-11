import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import prompts from 'prompts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(projectRoot, '.env');

if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const requiredConfig = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingConfig = requiredConfig.filter((key) => !process.env[key]);

if (missingConfig.length > 0) {
  console.error(`Konfigurasi database belum lengkap: ${missingConfig.join(', ')}. Isi file .env terlebih dahulu.`);
  process.exit(1);
}

const answers = await prompts([
  {
    type: 'text',
    name: 'username',
    message: 'Username admin:',
    validate: (value) => value.trim().length >= 3 || 'Username minimal 3 karakter.',
  },
  {
    type: 'text',
    name: 'name',
    message: 'Nama admin:',
    validate: (value) => value.trim().length > 0 || 'Nama wajib diisi.',
  },
  {
    type: 'password',
    name: 'password',
    message: 'Password admin (minimal 8 karakter):',
    mask: '*',
    validate: (value) => value.length >= 8 || 'Password minimal 8 karakter.',
  },
], {
  onCancel: () => {
    throw new Error('Pembuatan admin dibatalkan.');
  },
});

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
});

try {
  const [existingAdmins] = await connection.execute(
    'SELECT id FROM admins WHERE username = ? LIMIT 1',
    [answers.username.trim()],
  );

  if (existingAdmins.length > 0) {
    throw new Error('Username tersebut sudah terdaftar.');
  }

  const passwordHash = await bcrypt.hash(answers.password, 12);
  await connection.execute(
    'INSERT INTO admins (username, password, name) VALUES (?, ?, ?)',
    [answers.username.trim(), passwordHash, answers.name.trim()],
  );

  console.log(`Admin ${answers.username.trim()} berhasil dibuat.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Gagal membuat admin.');
  process.exitCode = 1;
} finally {
  await connection.end();
}