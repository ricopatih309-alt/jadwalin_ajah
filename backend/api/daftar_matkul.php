<?php
require_once '../api/cors.php';
require_once '../db.php';

$data = fetchData("SELECT subject_id, subject AS name, lecturer, code, sks FROM Jadwal_Kuliah");

echo json_encode($data);
?>
