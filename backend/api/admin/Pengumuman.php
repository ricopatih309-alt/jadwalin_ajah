<?php
require_once dirname(__DIR__) . '/cors.php';
require_once __DIR__ . '/auth.php';
verifyAdminRequest();
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/crud.php';

adminCrud($conn, [
    'table' => 'Pengumuman',
    'from' => 'Pengumuman',
    'select' => 'Pengumuman.*',
    'orderBy' => 'created_at DESC',
    'fields' => [
        'subject' => ['required' => true],
        'date' => ['required' => true],
        'content' => ['required' => true],
    ],
]);
?>