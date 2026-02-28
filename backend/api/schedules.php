<?php
require_once '../api/cors.php';
require_once '../db.php';

$data = fetchData("SELECT * FROM schedules ORDER BY 
    CASE day 
        WHEN 'Senin' THEN 1 
        WHEN 'Selasa' THEN 2 
        WHEN 'Rabu' THEN 3 
        WHEN 'Kamis' THEN 4 
        WHEN 'Jumat' THEN 5 
        WHEN 'Sabtu' THEN 6 
        WHEN 'Minggu' THEN 7 
        ELSE 99 
    END, time ASC");

echo json_encode($data);
?>
