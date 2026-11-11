<?php
require_once dirname(__DIR__) . '/cors.php';
require_once __DIR__ . '/auth.php';
verifyAdminRequest();
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/crud.php';

adminCrud($conn, [
    'table' => 'Jadwal_Kuliah',
    'from' => 'Jadwal_Kuliah',
    'select' => 'Jadwal_Kuliah.*',
    'orderBy' => "CASE day WHEN 'Senin' THEN 1 WHEN 'Selasa' THEN 2 WHEN 'Rabu' THEN 3 WHEN 'Kamis' THEN 4 WHEN 'Jumat' THEN 5 WHEN 'Sabtu' THEN 6 WHEN 'Minggu' THEN 7 ELSE 99 END, time ASC",
    'fields' => [
        'subject_id' => ['required' => true],
        'subject' => ['required' => true],
        'day' => ['required' => true],
        'time' => ['required' => true],
        'code' => ['required' => true],
        'room' => ['required' => true],
        'lecturer' => ['required' => true],
        'sks' => ['required' => true, 'type' => 'int'],
    ],
]);
?>