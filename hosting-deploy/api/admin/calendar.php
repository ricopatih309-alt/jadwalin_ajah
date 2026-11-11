<?php
require_once dirname(__DIR__) . '/cors.php';
require_once __DIR__ . '/auth.php';
verifyAdminRequest();
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/crud.php';

adminCrud($conn, [
    'table' => 'kalender_akademik',
    'from' => 'kalender_akademik',
    'select' => 'kalender_akademik.*',
    'orderBy' => 'sort_date ASC',
    'fields' => [
        'category' => ['required' => true],
        'variant' => ['required' => true, 'enum' => ['pink', 'yellow', 'blue-solid', 'blue-outline']],
        'title' => ['required' => true],
        'date_range' => ['required' => true],
        'sort_date' => ['required' => true],
        'url' => [],
    ],
]);
?>