<?php
require_once '../api/cors.php';
require_once '../db.php';

$data = fetchData("SELECT * FROM kalender_akademik ORDER BY sort_date ASC");

echo json_encode($data);
?>
