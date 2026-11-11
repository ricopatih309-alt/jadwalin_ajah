<?php
require_once dirname(__DIR__) . '/cors.php';
require_once __DIR__ . '/auth.php';
verifyAdminRequest();
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/crud.php';

adminCrud($conn, [
    'table' => 'Tugas',
    'from' => 'Tugas JOIN Jadwal_Kuliah ON Tugas.subject_id = Jadwal_Kuliah.subject_id',
    'select' => 'Tugas.*, Jadwal_Kuliah.subject AS subject',
    'orderBy' => 'Tugas.created_at DESC',
    'subjectForeignKey' => true,
    'fields' => [
        'subject_id' => ['required' => true],
        'deadline' => ['required' => true],
        'note' => ['required' => true],
    ],
]);
?>