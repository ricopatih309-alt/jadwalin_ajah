<?php
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

if ($path === '/api/admin/login') {
    require __DIR__ . '/api/admin/login.php';
    return true;
}

$filePath = __DIR__ . $path;
if ($path !== '/' && is_file($filePath)) {
    return false;
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not found']);
return true;