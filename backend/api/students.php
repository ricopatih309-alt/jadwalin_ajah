<?php
require_once '../api/cors.php';
require_once '../db.php';

$data = fetchData("SELECT * FROM students ORDER BY npm ASC");

echo json_encode($data);
?>
