<?php
// db.php - Database Connection Configuration

require_once __DIR__ . '/env.php';
loadProjectEnvironment();

$isLocal = ($_SERVER['SERVER_NAME'] === 'localhost');
$useRemote = (getenv('DB_CONNECTION') === 'remote');

if ($isLocal && !$useRemote) {
    define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
    define('DB_PORT', (int) (getenv('DB_PORT') ?: 3306));
    define('DB_USER', getenv('DB_USER') ?: 'root');
    define('DB_PASS', getenv('DB_PASSWORD') ?: 'Rico10124173');
    define('DB_NAME', getenv('DB_NAME') ?: 'Jadwalin_Ajah');
} else {
    define('DB_HOST', getenv('DB_HOST') ?: '103.93.163.197');
    define('DB_PORT', (int) (getenv('DB_PORT') ?: 12095));
    define('DB_USER', getenv('DB_USER') ?: 'Rico_2KA19');
    define('DB_PASS', getenv('DB_PASSWORD') ?: 'Rico123.@!');
    define('DB_NAME', getenv('DB_NAME') ?: 'Rico_2KA19_DB');
}

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Set charset to utf8mb4 (support emoji & special characters)
$conn->set_charset("utf8mb4");

// Helper function untuk fetch data
function fetchData($query, $params = [], $types = '') {
    global $conn;

    if (!empty($params)) {
        $stmt = $conn->prepare($query);
        if (!$stmt) return [];
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($query);
    }

    if (!$result) return [];

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    return $data;
}
?>
