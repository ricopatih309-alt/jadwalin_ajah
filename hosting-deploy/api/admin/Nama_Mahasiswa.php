<?php
require_once dirname(__DIR__) . '/cors.php';
require_once __DIR__ . '/auth.php';
verifyAdminRequest();
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/crud.php';

adminCrud($conn, [
    'table' => 'Nama_Mahasiswa',
    'from' => 'Nama_Mahasiswa',
    'select' => 'Nama_Mahasiswa.*',
    'orderBy' => 'npm ASC',
    'fields' => [
        'name' => ['required' => true],
        'npm' => ['required' => true],
        'status' => ['required' => true, 'enum' => ['Aktif', 'Cuti', 'Non-Aktif']],
    ],
]);
?>