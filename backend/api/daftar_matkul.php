<?php
require_once '../api/cors.php';
require_once '../db.php';

$data = fetchData("SELECT * FROM daftar_matkul");

echo json_encode($data);
?>
