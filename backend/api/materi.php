<?php
require_once '../api/cors.php';
require_once '../db.php';

// Ambil subject_id dari query parameter
// Contoh: /api/materi.php?subject_id=pbo
if (!isset($_GET['subject_id']) || empty($_GET['subject_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'subject_id is required']);
    exit();
}

$subject_id = $_GET['subject_id'];

$data = fetchData(
    "SELECT * FROM materi WHERE subject_id = ? ORDER BY meeting ASC",
    [$subject_id],
    's'
);

echo json_encode($data);
?>
