<?php
require_once dirname(__DIR__) . '/cors.php';
require_once __DIR__ . '/auth.php';
verifyAdminRequest();
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/crud.php';

adminCrud($conn, [
    'table' => 'Materi_Kuliah',
    'from' => 'Materi_Kuliah JOIN Jadwal_Kuliah ON Materi_Kuliah.subject_id = Jadwal_Kuliah.subject_id',
    'select' => 'Materi_Kuliah.*, Jadwal_Kuliah.subject AS subject',
    'orderBy' => 'Materi_Kuliah.meeting ASC',
    'filterSubject' => true,
    'subjectForeignKey' => true,
    'fields' => [
        'subject_id' => ['required' => true],
        'meeting' => ['required' => true, 'type' => 'int'],
        'title' => ['required' => true],
        'url' => ['required' => true],
    ],
]);
?>