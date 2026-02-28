<?php
require_once '../api/cors.php';
require_once '../db.php';

$data = fetchData("SELECT * FROM announcements ORDER BY created_at DESC");

echo json_encode($data);
?>
